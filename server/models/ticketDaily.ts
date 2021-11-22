import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface TicketDaily {
  id: number;
  ticketId: number;
  date: string;
  volume: number;
  closePrice: string;
  splitCoefficient: string;
  dividendPercent: string;
  adjustedClosePrice: string;
}

interface TicketDailyEdit {
  ticketId?: number;
  date?: string;
  volume?: number;
  closePrice?: string;
  splitCoefficient?: string;
  dividendPercent?: string;
  adjustedClosePrice?: string;
}

export const getByUK = async (
  ticketId: number,
  date: string
): Promise<TicketDaily | null> => {
  const ticketDaily = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKET_DAILY,
    conditions: [
      { key: 'ticketId', value: ticketId },
      { key: 'date', value: date }
    ]
  })
  return ticketDaily
}

export const getPrevious = async (
  ticketId: number,
  date: string
): Promise<TicketDaily | null> => {
  const ticketDaily = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKET_DAILY,
    conditions: [
      { key: 'ticketId', value: ticketId },
      { key: 'date', type: '<', value: date }
    ],
    orderBy: { key: 'date', type: 'desc' }
  })
  return ticketDaily
}

export const create = async (
  values: TicketDailyEdit
): Promise<TicketDaily> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TICKET_DAILY,
    values
  })
  return newRecords?.length ? newRecords[0] : null
}
