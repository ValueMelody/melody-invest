import * as errorEnum from '../enums/error'
import * as marketAdapter from '../adapters/market'
import * as dateTool from '../tools/date'
import * as marketTool from '../tools/market'
import * as ticketModel from '../models/ticket'
import * as ticketDailyModel from '../models/ticketDaily'

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

  if (lastRefreshed === ticket.refreshedDate) {
    return { ticket, newDaily: [] }
  }

  const allDaysData = ticketData['Time Series (Daily)']

  const startDate = ticket.refreshedDate
    ? dateTool.getNextDate(ticket.refreshedDate)
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
      splitCoefficient: splitCoefficient.substr(0, 10),
      dividendPercent: dividendPercent,
      adjustedClosePrice: adjustedClose
    })
    newRecords.push(newRecord)
  }

  const newTicket = await ticketModel.updateTicket(ticket.id, {
    refreshedDate: lastRefreshed
  })

  return {
    ticket: newTicket,
    newDaily: newRecords
  }
}

export const syncTicketEarnings = (
  region: string,
  symbol: string
) => {

}
