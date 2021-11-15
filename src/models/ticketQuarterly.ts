import * as tableEnum from '../enums/table'
import { findOne, create } from '../adapters/database'

export interface TicketQuarterly {
  id: number;
  ticketId: number;
  quarter: string;
  earningDate: string;
  eps: string;
  estimatedEps: string;
  epsSurprisePercent: string;
  earningReportDate: string;
}

export interface TicketQuarterlyEdit {
  ticketId?: number;
  quarter?: string;
  earningDate?: string;
  eps?: string;
  estimatedEps?: string;
  epsSurprisePercent?: string;
  earningReportDate?: string;
}

export const getLatestTicketQuarterly = async (
  ticketId: number
): Promise<TicketQuarterly> => {
  const ticketQuarterly = await findOne({
    tableName: tableEnum.NAMES.TICKET_QUARTERLY,
    conditions: [
      { key: 'ticketId', value: ticketId }
    ],
    orderBy: { key: 'quarter', type: 'desc' }
  })
  return ticketQuarterly
}

export const createTicketQuarterly = async (
  values: TicketQuarterlyEdit
): Promise<TicketQuarterly> => {
  const newRecords = await create({
    tableName: tableEnum.NAMES.TICKET_QUARTERLY,
    values
  })
  return newRecords?.length ? newRecords[0] : null
}
