import * as errorEnum from '../enums/error'
import * as marketAdapter from '../adapters/market'
import * as dateTool from '../tools/date'
import * as marketTool from '../tools/market'
import * as runTool from '../tools/run'
import * as ticketModel from '../models/ticket'
import * as ticketDailyModel from '../models/ticketDaily'
import * as ticketYearlyModel from '../models/ticketYearly'
import * as ticketQuarterlyModel from '../models/ticketQuarterly'

export const syncPrices = async (
  region: string,
  symbol: string
): Promise<{
  ticket: ticketModel.Ticket,
  newDaily: ticketDailyModel.TicketDaily[]
}> => {
  const ticket = await ticketModel.getByUK(region, symbol)
  if (!ticket) throw errorEnum.HTTP_ERRORS.NOT_FOUND

  const ticketData = await marketAdapter.getTicketDailyAdjusted(symbol)

  const metaData = ticketData['Meta Data']
  const lastRefreshed = metaData['3. Last Refreshed']

  if (lastRefreshed === ticket.lastPriceDate) {
    return { ticket, newDaily: [] }
  }

  const allDaysData = ticketData['Time Series (Daily)']

  const startDate = ticket.lastPriceDate
    ? dateTool.getNextDate(ticket.lastPriceDate)
    : dateTool.getInitialDate()
  const endDate = dateTool.getCurrentDate()

  const allDates = dateTool.getDaysInRange(startDate, endDate)

  const newRecords = []
  for (const date of allDates) {
    const dailyData = allDaysData[date]
    if (!dailyData) continue

    const record = await ticketDailyModel.getByUK(ticket.id, date)
    if (record) continue

    const closePrice = dailyData['4. close']
    const volume = dailyData['6. volume']
    const dividendAmount = dailyData['7. dividend amount']
    const splitCoefficient = dailyData['8. split coefficient']

    const previousRecord = await ticketDailyModel.getPrevious(ticket.id, date)

    const adjustedClose = previousRecord
      ? marketTool.getAdjustedClosePrice(
        closePrice,
        splitCoefficient,
        previousRecord.closePrice,
        previousRecord.adjustedClosePrice
      )
      : closePrice

    const dividendPercent = previousRecord
      ? marketTool.getDividendPercent(
        dividendAmount,
        previousRecord.closePrice
      )
      : '0.00'

    const newRecord = await ticketDailyModel.create({
      ticketId: ticket.id,
      date,
      volume: parseInt(volume),
      closePrice: closePrice,
      splitCoefficient: splitCoefficient.substring(0, 10),
      dividendPercent: dividendPercent,
      adjustedClosePrice: adjustedClose
    })
    newRecords.push(newRecord)
  }

  const newTicketInfo: ticketModel.TicketEdit = {}
  newTicketInfo.lastPriceDate = lastRefreshed
  if (!newTicketInfo.firstPriceDate) {
    newTicketInfo.firstPriceDate = newRecords[0].date
  }

  const updatedTicket = await ticketModel.update(ticket.id, newTicketInfo)

  return {
    ticket: updatedTicket,
    newDaily: newRecords
  }
}

export const syncEarnings = async (
  region: string,
  symbol: string,
  forceRecheck: boolean = false
): Promise<{
  ticket: ticketModel.Ticket,
  relatedYearly: ticketYearlyModel.TicketYearly[],
  relatedQuarterly: ticketQuarterlyModel.TicketQuarterly[]
}> => {
  const ticket = await ticketModel.getByUK(region, symbol)
  if (!ticket) throw errorEnum.HTTP_ERRORS.NOT_FOUND

  const ticketData = await marketAdapter.getTicketEarnings(symbol)

  const annualEarnings = ticketData.annualEarnings
  if (!annualEarnings) console.info(`Annual Earning not exist for ${ticket.symbol}`)

  const lastYearlyRecord = !forceRecheck && await ticketYearlyModel.getLatest(
    ticket.id,
    [{ key: 'eps', type: 'IS NOT', value: null }]
  )

  const startYear = lastYearlyRecord
    ? dateTool.getNextYear(lastYearlyRecord.year)
    : dateTool.getInitialYear()
  const endYear = dateTool.getCurrentYear()
  const allYears = dateTool.getYearsInRange(startYear, endYear)

  const relatedYearly = []
  for (const year of allYears) {
    const matchedEarning = annualEarnings?.find(earning => {
      return year === earning.fiscalDateEnding.substring(0, 4)
    })
    if (!matchedEarning) continue

    const yearlyEps = {
      year,
      earningDate: matchedEarning.fiscalDateEnding,
      eps: matchedEarning.reportedEPS.substring(0, 10)
    }

    const currentRecord = await ticketYearlyModel.getByUK(ticket.id, year)

    if (currentRecord && !currentRecord.eps) {
      const updatedRecord = await ticketYearlyModel.update(ticket.id, yearlyEps)
      relatedYearly.push(updatedRecord)
    }

    if (!currentRecord) {
      const createdRecord = await ticketYearlyModel.create({
        ticketId: ticket.id,
        ...yearlyEps
      })
      relatedYearly.push(createdRecord)
    }
  }

  const quarterlyEarnings = ticketData.quarterlyEarnings
  if (!quarterlyEarnings) console.info(`Quarterly Earning not exist for ${ticket.symbol}`)

  const lastQuarterlyRecord = !forceRecheck && await ticketQuarterlyModel.getLatest(
    ticket.id,
    [{ key: 'eps', type: 'IS NOT', value: null }]
  )

  const startQuarter = lastQuarterlyRecord
    ? dateTool.getNextQuarter(lastQuarterlyRecord.quarter)
    : dateTool.getInitialQuarter()
  const endQuarter = dateTool.getCurrentQuater()
  const allQuarters = dateTool.getQuartersInRange(startQuarter, endQuarter)

  const relatedQuarterly = []
  for (const quarter of allQuarters) {
    const adjustedQuarter = dateTool.getAdjustedQuarter(quarter, ticket.quarterlyEpsMonthDiffer)
    const matchedEarning = quarterlyEarnings?.find(earning => {
      return adjustedQuarter === earning.fiscalDateEnding.substring(0, 7)
    })
    if (!matchedEarning) continue

    const quarterlyEps = {
      quarter: adjustedQuarter,
      earningDate: matchedEarning.fiscalDateEnding,
      eps: matchedEarning.reportedEPS.substring(0, 10),
      estimatedEps: matchedEarning.estimatedEPS.substring(0, 10),
      epsSurprisePercent: matchedEarning.surprisePercentage.substring(0, 5),
      earningReportDate: matchedEarning.reportedDate
    }

    const currentRecord = await ticketQuarterlyModel.getByUK(ticket.id, adjustedQuarter)

    if (currentRecord && !currentRecord.eps) {
      const updatedRecord = await ticketQuarterlyModel.update(ticket.id, quarterlyEps)
      relatedQuarterly.push(updatedRecord)
    }

    if (!currentRecord) {
      const createdRecord = await ticketQuarterlyModel.create({
        ticketId: ticket.id,
        ...quarterlyEps
      })
      relatedQuarterly.push(createdRecord)
    }
  }

  const newTicketInfo: ticketModel.TicketEdit = {}
  if (relatedYearly.length) {
    newTicketInfo.lastEpsYear = relatedYearly[relatedYearly.length - 1].year
    if (!ticket.firstEpsYear) newTicketInfo.firstEpsYear = relatedYearly[0].year
  }
  if (relatedQuarterly.length) {
    newTicketInfo.lastEpsQuarter = relatedQuarterly[relatedQuarterly.length - 1].quarter
    if (!ticket.firstEpsQuarter) newTicketInfo.firstEpsQuarter = relatedQuarterly[0].quarter
  }

  const updateTicket = Object.keys(newTicketInfo).length
    ? await ticketModel.update(ticket.id, newTicketInfo)
    : ticket

  return { ticket: updateTicket, relatedYearly, relatedQuarterly }
}

export const syncAllEarnings = async (
  year: string, quarter: string
): Promise<{
  tickets: ticketModel.Ticket[]
}> => {
  const allTickets = await ticketModel.getAll()

  const updatedTickets = []
  for (const ticket of allTickets) {
    const isYearSynced = ticket.lastEpsYear === year
    const isQuarterSynced = ticket.lastEpsQuarter === quarter
    if (isYearSynced && isQuarterSynced) continue
    const result = await syncEarnings(ticket.region, ticket.symbol)
    updatedTickets.push(result.ticket)
    // note: key rate limit
    await runTool.sleep(15)
  }

  return { tickets: updatedTickets }
}