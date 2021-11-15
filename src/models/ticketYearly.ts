import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface TicketYearly {
  id: number;
  ticketId: number;
  year: string;
  earningDate: string | null;
  eps: string | null;
}

interface TicketYearlyEdit {
  ticketId?: number;
  year?: string;
  earningDate?: string;
  eps?: string;
}

export const getLatest = async (
  ticketId: number,
  conditions?: databaseAdapter.Condition[]
): Promise<TicketYearly | null> => {
  const pkCondition = [{ key: 'ticketId', value: ticketId }]
  const whereConditions = conditions
    ? [...pkCondition, ...conditions]
    : pkCondition
  const ticketYearly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKET_YEARLY,
    conditions: whereConditions,
    orderBy: { key: 'year', type: 'desc' }
  })
  return ticketYearly
}

export const getByUK = async (
  ticketId: number,
  year: string
): Promise<TicketYearly | null> => {
  const ticketYearly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKET_YEARLY,
    conditions: [
      { key: 'ticketId', value: ticketId },
      { key: 'year', value: year }
    ]
  })
  return ticketYearly
}

export const create = async (
  values: TicketYearlyEdit
): Promise<TicketYearly> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TICKET_YEARLY,
    values
  })
  return newRecords?.length ? newRecords[0] : null
}

export const update = async (
  ticketId: number,
  values: TicketYearlyEdit
): Promise<TicketYearly> => {
  const updatedYearly = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TICKET_YEARLY,
    values,
    conditions: [
      { key: 'id', value: ticketId }
    ]
  })
  return updatedYearly?.length ? updatedYearly[0] : null
}
