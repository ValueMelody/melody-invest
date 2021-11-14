import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface Ticket {
  id: number;
  symbol: string;
  region: string;
  lastPriceDate: string;
  firstPriceDate: string;
  lastEpsYear: string;
  firstEpsYear: string;
  name: string;
}

export interface TicketEdit {
  symbol?: string;
  region?: string;
  lastPriceDate?: string;
  firstPriceDate?: string;
  lastEpsYear?: string;
  firstEpsYear?: string;
  name?: string;
}

export const getTicket = async (
  region: string,
  symbol: string
): Promise<Ticket> => {
  const ticketRegion = region.toUpperCase()
  const ticketSymbol = symbol.toUpperCase()

  const ticket = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKETS,
    conditions: [
      { key: 'region', value: ticketRegion },
      { key: 'symbol', value: ticketSymbol }
    ]
  })
  return ticket
}

export const updateTicket = async (
  ticketId: number,
  values: TicketEdit
): Promise<Ticket> => {
  const updatedTicket = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TICKETS,
    values,
    conditions: [
      { key: 'id', value: ticketId }
    ]
  })
  return updatedTicket?.length ? updatedTicket[0] : null
}
