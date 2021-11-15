import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

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

export const getByUK = async (
  ticketId: number,
  quarter: string
): Promise<TicketQuarterly | null> => {
  const ticketQuarterly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKET_QUARTERLY,
    conditions: [
      { key: 'ticketId', value: ticketId },
      { key: 'quarter', value: quarter }
    ]
  })
  return ticketQuarterly
}

export const getLatest = async (
  ticketId: number
): Promise<TicketQuarterly | null> => {
  const ticketQuarterly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKET_QUARTERLY,
    conditions: [
      { key: 'ticketId', value: ticketId }
    ],
    orderBy: { key: 'quarter', type: 'desc' }
  })
  return ticketQuarterly
}

export const create = async (
  values: TicketQuarterlyEdit
): Promise<TicketQuarterly> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TICKET_QUARTERLY,
    values
  })
  return newRecords?.length ? newRecords[0] : null
}
