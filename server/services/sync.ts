import { NAMES } from '../enums/tables'
import { HTTP_ERRORS } from '../enums/errors'
import { findOne, upsertOne } from '../adapters/database'
import { getTicketDailyAdjusted } from '../adapters/market'
import { getInitialDate, getCurrentDate, getDaysInRange } from '../tools/datetime'

export const syncTicket = async (
  region: string,
  symbol: string
) => {
  const ticket = await findOne({
    tableName: NAMES.TICKETS,
    filters: {
      region: region.toUpperCase(),
      symbol: symbol.toUpperCase()
    }
  })
  if (!ticket) throw HTTP_ERRORS.NOT_FOUND

  const ticketData = await getTicketDailyAdjusted(symbol)

  const metaData = ticketData['Meta Data']
  const lastRefreshed = metaData['3. Last Refreshed']

  if (lastRefreshed === ticket.last_refreshed) {
    return { lastRefreshed }
  }

  const allDaysData = ticketData['Time Series (Daily)']

  const initialDate = getInitialDate()
  const currentDate = getCurrentDate()
  const allDates = getDaysInRange(initialDate, currentDate)

  for (const date of allDates) {
    const dailyData = allDaysData[date]
    if (!dailyData) continue

    const closePrice = dailyData['4. close']
    const volume = dailyData['6. volume']
    const dividendAmount = dailyData['7. dividend amount']
    const splitCoefficient = dailyData['8. split coefficient']

    const record = await findOne({
      tableName: NAMES.TICKET_DAILY,
      filters: {
        ticket_id: ticket.id,
        date
      }
    })
  }

  return {

  }
}
