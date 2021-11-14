import * as tableEnum from '../enums/table'
import { findOne } from '../adapters/database'

export interface TicketYearly {
  id: number;
  ticketId: number;
  year: string;
  earningDate: string;
  eps: number;
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
