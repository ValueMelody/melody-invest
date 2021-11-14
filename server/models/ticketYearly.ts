import * as tableEnum from '../enums/table'
import { findOne, create } from '../adapters/database'

export interface TicketYearly {
  id: number;
  ticketId: number;
  year: string;
  earningDate: string;
  eps: string;
}

interface TicketYearlyEdit {
  ticketId?: number;
  year?: string;
  earningDate?: string;
  eps?: string;
}

export const getLatestTicketYearly = async (
  ticketId: number
): Promise<TicketYearly> => {
  const ticketYearly = await findOne({
    tableName: tableEnum.NAMES.TICKET_YEARLY,
    conditions: [
      { key: 'ticketId', value: ticketId }
    ],
    orderBy: { key: 'year', type: 'desc' }
  })
  return ticketYearly
}

export const getTicketYearly = async (
  ticketId: number,
  year: string
): Promise<TicketYearly> => {
  const ticketYearly = await findOne({
    tableName: tableEnum.NAMES.TICKET_YEARLY,
    conditions: [
      { key: 'ticketId', value: ticketId },
      { key: 'year', value: year }
    ]
  })
  return ticketYearly
}

export const createTicketYearly = async (
  values: TicketYearlyEdit
): Promise<TicketYearly> => {
  const newRecords = await create({
    tableName: tableEnum.NAMES.TICKET_YEARLY,
    values
  })
  return newRecords?.length ? newRecords[0] : null
}
