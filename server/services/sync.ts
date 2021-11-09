import { NAMES } from '../enums/tables'
import { HTTP_ERRORS } from '../enums/errors'
import { findOne } from '../adapters/database'
import { getTicketDailyAdjusted } from '../adapters/market'

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
  console.log(ticket)
  if (!ticket) throw HTTP_ERRORS.NOT_FOUND

  const ticketData = await getTicketDailyAdjusted(symbol)
  const lastRefreshed = ticketData['Meta Data']['3. Last Refreshed']
  console.log(lastRefreshed)

  return ticketData
}
