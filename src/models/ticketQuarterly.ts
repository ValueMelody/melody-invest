import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface TicketQuarterly {
  id: number;
  ticketId: number;
  quarter: string;
  earningDate: string | null;
  eps: string | null;
  estimatedEps: string | null;
  epsSurprisePercent: string | null;
  earningReportDate: string | null;
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
  ticketId: number,
  conditions?: databaseAdapter.Condition[]
): Promise<TicketQuarterly | null> => {
  const pkCondition = [{ key: 'ticketId', value: ticketId }]
  const whereConditions = conditions
    ? [...pkCondition, ...conditions]
    : pkCondition
  const ticketQuarterly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKET_QUARTERLY,
    conditions: whereConditions,
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

export const update = async (
  ticketId: number,
  values: TicketQuarterlyEdit
): Promise<TicketQuarterly> => {
  const updatedQuarterly = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TICKET_QUARTERLY,
    values,
    conditions: [
      { key: 'id', value: ticketId }
    ]
  })
  return updatedQuarterly?.length ? updatedQuarterly[0] : null
}