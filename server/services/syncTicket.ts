import * as errorEnum from '../enums/error'
import * as marketAdapter from '../adapters/market'
import * as dateTool from '../tools/date'
import * as marketTool from '../tools/market'
import * as ticketModel from '../models/ticket'
import * as ticketDailyModel from '../models/ticketDaily'
import * as ticketYearlyModel from '../models/ticketYearly'

export const syncTicketPrices = async (
  region: string,
  symbol: string
): Promise<{
  ticket: ticketModel.Ticket,
  newDaily: ticketDailyModel.TicketDaily[]
}> => {
  const ticket = await ticketModel.getTicket(region, symbol)
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

    const record = await ticketDailyModel.getTicketDaily(ticket.id, date)
    if (record) continue

    const closePrice = dailyData['4. close']
    const volume = dailyData['6. volume']
    const dividendAmount = dailyData['7. dividend amount']
    const splitCoefficient = dailyData['8. split coefficient']

    const previousRecord = await ticketDailyModel.getPreviousTicketDaily(ticket.id, date)

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

    const newRecord = await ticketDailyModel.createTicketDaily({
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

  const updatedTicket = await ticketModel.updateTicket(ticket.id, newTicketInfo)

  return {
    ticket: updatedTicket,
    newDaily: newRecords
  }
}

export const syncTicketEarnings = async (
  region: string,
  symbol: string
): Promise<{
  ticket: ticketModel.Ticket,
  newYearly: ticketYearlyModel.TicketYearly[]
}> => {
  const ticket = await ticketModel.getTicket(region, symbol)
  if (!ticket) throw errorEnum.HTTP_ERRORS.NOT_FOUND

  const ticketData = await marketAdapter.getTicketEarnings(symbol)

  const annualEarnings = ticketData.annualEarnings
  const lastYearlyRecord = await ticketYearlyModel.getLatestTicketYearly(ticket.id)

  const startYear = lastYearlyRecord
    ? dateTool.getNextYear(lastYearlyRecord.year)
    : dateTool.getInitialYear()
  const endYear = dateTool.getCurrentYear()
  const allYears = dateTool.getYearsInRange(startYear, endYear)

  const newYearly = []
  for (const year of allYears) {
    const matchedEarning = annualEarnings.find(earning => {
      return year === earning.fiscalDateEnding.substring(0, 4)
    })
    if (!matchedEarning) continue
    const newRecord = await ticketYearlyModel.createTicketYearly({
      ticketId: ticket.id,
      year,
      earningDate: matchedEarning.fiscalDateEnding,
      eps: matchedEarning.reportedEPS.substring(0, 10)
    })
    newYearly.push(newRecord)
  }

  const newTicketInfo: ticketModel.TicketEdit = {}
  if (newYearly.length) {
    newTicketInfo.lastEpsYear = newYearly[newYearly.length - 1].year
    if (!ticket.firstEpsYear) newTicketInfo.firstEpsYear = newYearly[0].year
  }

  const updateTicket = Object.keys(newTicketInfo).length
    ? await ticketModel.updateTicket(ticket.id, newTicketInfo)
    : ticket

  return { ticket: updateTicket, newYearly }
}
