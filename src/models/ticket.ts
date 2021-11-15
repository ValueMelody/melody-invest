import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface Ticket {
  id: number;
  symbol: string;
  region: string;
  name: string;
  firstPriceDate: string;
  lastPriceDate: string;
  firstEpsYear: string;
  lastEpsYear: string;
  firstEpsQuarter: string;
  lastEpsQuarter: string;
  quarterlyEpsMonthDiffer: string;
}

export interface TicketEdit {
  symbol?: string;
  region?: string;
  name?: string;
  firstPriceDate?: string;
  lastPriceDate?: string;
  firstEpsYear?: string;
  lastEpsYear?: string;
  firstEpsQuarter?: string;
  lastEpsQuarter?: string;
}

export const getByUK = async (
  region: string,
  symbol: string
): Promise<Ticket | null> => {
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

export const getAll = async (): Promise<Ticket[]> => {
  const tickets = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TICKETS
  })
  return tickets
}

export const update = async (
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
