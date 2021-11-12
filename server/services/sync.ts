import { NAMES } from '../enums/tables'
import { HTTP_ERRORS } from '../enums/errors'
import { findOne, create, update } from '../adapters/database'
import { getTicketDailyAdjusted } from '../adapters/market'
import {
  getInitialDate,
  getCurrentDate,
  getDaysInRange,
  getNextDate
} from '../tools/datetime'
import {
  getAdjustedClosePrice,
  getDividendPercent
} from '../tools/market'

export const syncTicket = async (
  region: string,
  symbol: string
) => {
  const ticketRegion = region.toUpperCase()
  const ticketSymbol = symbol.toUpperCase()

  const ticket = await findOne({
    tableName: NAMES.TICKETS,
    conditions: [
      { key: 'region', value: ticketRegion },
      { key: 'symbol', value: ticketSymbol }
    ]
  })
  if (!ticket) throw HTTP_ERRORS.NOT_FOUND

  const ticketData = await getTicketDailyAdjusted(symbol)

  const metaData = ticketData['Meta Data']
  const lastRefreshed = metaData['3. Last Refreshed']

  if (lastRefreshed === ticket.last_refreshed) {
    return { refreshedAt: lastRefreshed }
  }

  const allDaysData = ticketData['Time Series (Daily)']

  const startDate = ticket.last_refreshed
    ? getNextDate(ticket.last_refreshed)
    : getInitialDate()

  const endDate = getCurrentDate()
  const allDates = getDaysInRange(startDate, endDate)

  const newRecords = []
  for (const date of allDates) {
    const dailyData = allDaysData[date]
    if (!dailyData) continue

    const record = await findOne({
      tableName: NAMES.TICKET_DAILY,
      conditions: [
        { key: 'ticket_id', value: ticket.id },
        { key: 'date', value: date }
      ]
    })
    if (record) continue

    const previousRecord = await findOne({
      tableName: NAMES.TICKET_DAILY,
      conditions: [
        { key: 'ticket_id', value: ticket.id },
        { key: 'date', type: '<', value: date }
      ],
      orderBy: { key: 'id', type: 'desc' }
    })

    const closePrice = dailyData['4. close']
    const volume = dailyData['6. volume']
    const dividendAmount = dailyData['7. dividend amount']
    const splitCoefficient = dailyData['8. split coefficient']

    const adjustedClose = previousRecord
      ? getAdjustedClosePrice(
        closePrice,
        splitCoefficient,
        previousRecord.close_price,
        previousRecord.adjusted_close_price
      )
      : closePrice

    const dividendPercent = previousRecord
      ? getDividendPercent(
        dividendAmount,
        previousRecord.close_price
      )
      : '0.00'

    const newRecord = await create({
      tableName: NAMES.TICKET_DAILY,
      values: {
        ticket_id: ticket.id,
        date,
        volume: parseInt(volume),
        close_price: closePrice,
        split_coefficient: splitCoefficient.substr(0, 10),
        dividend_percent: dividendPercent,
        adjusted_close_price: adjustedClose
      }
    })
    newRecords.push(newRecord)
  }

  await update({
    tableName: NAMES.TICKETS,
    values: { last_refreshed: lastRefreshed },
    conditions: [
      { key: 'symbol', value: ticketSymbol },
      { key: 'region', value: ticketRegion }
    ]
  })

  return {
    refreshedAt: lastRefreshed,
    newRecords
  }
}
