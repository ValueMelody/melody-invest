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

  const ticketData = await marketAdapter.getTicketPrices(symbol)

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
  if (!ticket.firstPriceDate) {
    newTicketInfo.firstPriceDate = newRecords[0].date
  }

  const updatedTicket = await ticketModel.update(ticket.id, newTicketInfo)

  return {
    ticket: updatedTicket,
    newDaily: newRecords
  }
}

export const syncAllPrices = async (
  date: string
): Promise<{
  tickets: ticketModel.Ticket[]
}> => {
  const allTickets = await ticketModel.getAll()
  const cooldown = marketAdapter.getCooldownPerMin()

  const updatedTickets = []
  for (const ticket of allTickets) {
    const isDateSynced = ticket.lastPriceDate >= date
    if (isDateSynced) continue
    const result = await syncPrices(ticket.region, ticket.symbol)
    updatedTickets.push(result.ticket)
    await runTool.sleep(cooldown)
  }

  return { tickets: updatedTickets }
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
    const matchedEarning = annualEarnings.find(earning => {
      return year === earning.fiscalDateEnding.substring(0, 4)
    })
    if (!matchedEarning) continue

    const yearlyEPS = {
      year,
      earningDate: matchedEarning.fiscalDateEnding,
      eps: matchedEarning.reportedEPS.substring(0, 10)
    }

    const currentRecord = await ticketYearlyModel.getByUK(ticket.id, year)

    if (!currentRecord) {
      const createdRecord = await ticketYearlyModel.create({
        ticketId: ticket.id,
        ...yearlyEPS
      })
      relatedYearly.push(createdRecord)
    } else if (currentRecord && !currentRecord.eps) {
      const updatedRecord = await ticketYearlyModel.update(currentRecord.id, yearlyEPS)
      relatedYearly.push(updatedRecord)
    } else if (forceRecheck) {
      relatedYearly.push(currentRecord)
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
    : dateTool.getInitialQuarter(ticket.quarterlyEPSMonthDiffer)
  const endQuarter = dateTool.getCurrentQuater()
  const allQuarters = dateTool.getQuartersInRange(startQuarter, endQuarter)

  const relatedQuarterly = []
  for (const quarter of allQuarters) {
    const matchedEarning = quarterlyEarnings.find(earning => {
      return quarter === earning.fiscalDateEnding.substring(0, 7)
    })
    if (!matchedEarning) continue

    const eps = matchedEarning.reportedEPS === 'None'
      ? null
      : matchedEarning.reportedEPS.substring(0, 10)
    const estimatedEPS = matchedEarning.estimatedEPS === 'None'
      ? null
      : matchedEarning.estimatedEPS.substring(0, 10)
    const epsSurprisePercent = matchedEarning.surprisePercentage === 'None'
      ? null
      : matchedEarning.surprisePercentage.substring(0, 5)
    const quarterlyEPS = {
      quarter,
      earningDate: matchedEarning.fiscalDateEnding,
      earningReportDate: matchedEarning.reportedDate,
      eps,
      estimatedEPS,
      epsSurprisePercent
    }

    const currentRecord = await ticketQuarterlyModel.getByUK(ticket.id, quarter)

    if (!currentRecord) {
      const createdRecord = await ticketQuarterlyModel.create({
        ticketId: ticket.id,
        ...quarterlyEPS
      })
      relatedQuarterly.push(createdRecord)
    } else if (currentRecord && !currentRecord.eps) {
      const updatedRecord = await ticketQuarterlyModel.update(currentRecord.id, quarterlyEPS)
      relatedQuarterly.push(updatedRecord)
    } else if (forceRecheck) {
      relatedQuarterly.push(currentRecord)
    }
  }

  const newTicketInfo: ticketModel.TicketEdit = {}
  if (relatedYearly.length) {
    newTicketInfo.lastEPSYear = relatedYearly[relatedYearly.length - 1].year
    if (!ticket.firstEPSYear || forceRecheck) newTicketInfo.firstEPSYear = relatedYearly[0].year
  }
  if (relatedQuarterly.length) {
    newTicketInfo.lastEPSQuarter = relatedQuarterly[relatedQuarterly.length - 1].quarter
    if (!ticket.firstEPSQuarter || forceRecheck) newTicketInfo.firstEPSQuarter = relatedQuarterly[0].quarter
  }

  const updateTicket = Object.keys(newTicketInfo).length
    ? await ticketModel.update(ticket.id, newTicketInfo)
    : ticket

  return { ticket: updateTicket, relatedYearly, relatedQuarterly }
}

export const syncAllEarnings = async (
  year: string,
  quarter: string,
  forceRecheck: boolean = false
): Promise<{
  tickets: ticketModel.Ticket[]
}> => {
  const allTickets = await ticketModel.getAll()
  const cooldown = marketAdapter.getCooldownPerMin()

  const updatedTickets = []
  for (const ticket of allTickets) {
    const isYearSynced = ticket.lastEPSYear >= year
    const isQuarterSynced = ticket.lastEPSQuarter >= quarter
    if (isYearSynced && isQuarterSynced && !forceRecheck) continue
    const result = await syncEarnings(ticket.region, ticket.symbol, forceRecheck)
    updatedTickets.push(result.ticket)
    await runTool.sleep(cooldown)
  }

  return { tickets: updatedTickets }
}

export const syncIncomes = async (
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

  const ticketData = await marketAdapter.getTicketIncomes(symbol)

  const annualIncomes = ticketData.annualReports
  if (!annualIncomes) console.info(`Annual Incomes not exist for ${ticket.symbol}`)

  const lastYearlyRecord = !forceRecheck && await ticketYearlyModel.getLatest(
    ticket.id,
    [{ key: 'netIncome', type: 'IS NOT', value: null }]
  )

  const startYear = lastYearlyRecord
    ? dateTool.getNextYear(lastYearlyRecord.year)
    : dateTool.getInitialYear()
  const endYear = dateTool.getCurrentYear()
  const allYears = dateTool.getYearsInRange(startYear, endYear)

  const relatedYearly = []
  for (const year of allYears) {
    const matchedIncome = annualIncomes.find(income => {
      return year === income.fiscalDateEnding.substring(0, 4)
    })
    if (!matchedIncome) continue

    const yearlyIncome = {
      year,
      ebitda: matchedIncome.ebitda,
      netIncome: matchedIncome.netIncome,
      grossProfit: matchedIncome.grossProfit,
      totalRevenue: matchedIncome.totalRevenue,
      costOfRevenue: matchedIncome.costOfRevenue
    }

    const currentRecord = await ticketYearlyModel.getByUK(ticket.id, year)

    if (!currentRecord) {
      const createdRecord = await ticketYearlyModel.create({
        ticketId: ticket.id,
        ...yearlyIncome
      })
      relatedYearly.push(createdRecord)
    } else if (currentRecord && !currentRecord.netIncome) {
      const updatedRecord = await ticketYearlyModel.update(currentRecord.id, yearlyIncome)
      relatedYearly.push(updatedRecord)
    } else if (forceRecheck) {
      relatedYearly.push(currentRecord)
    }
  }

  const quarterlyIncomes = ticketData.quarterlyReports
  if (!quarterlyIncomes) console.info(`Quarterly Incomes not exist for ${ticket.symbol}`)

  const lastQuarterlyRecord = !forceRecheck && await ticketQuarterlyModel.getLatest(
    ticket.id,
    [{ key: 'netIncome', type: 'IS NOT', value: null }]
  )

  const startQuarter = lastQuarterlyRecord
    ? dateTool.getNextQuarter(lastQuarterlyRecord.quarter)
    : dateTool.getInitialQuarter(ticket.quarterlyEPSMonthDiffer)
  const endQuarter = dateTool.getCurrentQuater()
  const allQuarters = dateTool.getQuartersInRange(startQuarter, endQuarter)

  const relatedQuarterly = []
  for (const quarter of allQuarters) {
    const matchedIncome = quarterlyIncomes.find(income => {
      return quarter === income.fiscalDateEnding.substring(0, 7)
    })
    if (!matchedIncome) continue

    const quarterlyEPS = {
      quarter,
      ebitda: matchedIncome.ebitda,
      netIncome: matchedIncome.netIncome,
      grossProfit: matchedIncome.grossProfit,
      totalRevenue: matchedIncome.totalRevenue,
      costOfRevenue: matchedIncome.costOfRevenue
    }

    const currentRecord = await ticketQuarterlyModel.getByUK(ticket.id, quarter)

    if (!currentRecord) {
      const createdRecord = await ticketQuarterlyModel.create({
        ticketId: ticket.id,
        ...quarterlyEPS
      })
      relatedQuarterly.push(createdRecord)
    } else if (currentRecord && !currentRecord.netIncome) {
      const updatedRecord = await ticketQuarterlyModel.update(currentRecord.id, quarterlyEPS)
      relatedQuarterly.push(updatedRecord)
    } else if (forceRecheck) {
      relatedQuarterly.push(currentRecord)
    }
  }

  const newTicketInfo: ticketModel.TicketEdit = {}
  if (relatedYearly.length) {
    newTicketInfo.lastIncomeYear = relatedYearly[relatedYearly.length - 1].year
    if (!ticket.firstIncomeYear || forceRecheck) newTicketInfo.firstIncomeYear = relatedYearly[0].year
  }
  if (relatedQuarterly.length) {
    newTicketInfo.lastIncomeQuarter = relatedQuarterly[relatedQuarterly.length - 1].quarter
    if (!ticket.firstIncomeQuarter || forceRecheck) newTicketInfo.firstIncomeQuarter = relatedQuarterly[0].quarter
  }

  const updateTicket = Object.keys(newTicketInfo).length
    ? await ticketModel.update(ticket.id, newTicketInfo)
    : ticket

  return { ticket: updateTicket, relatedYearly, relatedQuarterly }
}

export const syncAllIncomes = async (
  year: string,
  quarter: string,
  forceRecheck: boolean = false
): Promise<{
  tickets: ticketModel.Ticket[]
}> => {
  const allTickets = await ticketModel.getAll()
  const cooldown = marketAdapter.getCooldownPerMin()

  const updatedTickets = []
  for (const ticket of allTickets) {
    const isYearSynced = ticket.lastIncomeYear >= year
    const isQuarterSynced = ticket.lastIncomeQuarter >= quarter
    if (isYearSynced && isQuarterSynced && !forceRecheck) continue
    const result = await syncIncomes(ticket.region, ticket.symbol, forceRecheck)
    updatedTickets.push(result.ticket)
    await runTool.sleep(cooldown)
  }

  return { tickets: updatedTickets }
}
