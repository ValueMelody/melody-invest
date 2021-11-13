import * as tableEnum from '../enums/table'
import { findOne, create } from '../adapters/database'

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

export const getTicketDaily = async (
  ticketId: number,
  date: string
): Promise<TicketDaily> => {
  const ticketDaily = await findOne({
    tableName: tableEnum.NAMES.TICKET_DAILY,
    conditions: [
      { key: 'ticketId', value: ticketId },
      { key: 'date', value: date }
    ]
  })
  return ticketDaily
}

export const getPreviousTicketDaily = async (
  ticketId: number,
  date: string
): Promise<TicketDaily> => {
  const ticketDaily = await findOne({
    tableName: tableEnum.NAMES.TICKET_DAILY,
    conditions: [
      { key: 'ticketId', value: ticketId },
      { key: 'date', type: '<', value: date }
    ],
    orderBy: { key: 'id', type: 'desc' }
  })
  return ticketDaily
}

export const createTicketDaily = async (
  values: TicketDailyEdit
): Promise<TicketDaily> => {
  const newRecords = await create({
    tableName: tableEnum.NAMES.TICKET_DAILY,
    values
  })
  return newRecords?.length ? newRecords[0] : null
}
