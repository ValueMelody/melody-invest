import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface Holding {
  tickerId: number;
  shares: number;
  value: number;
}

export interface Record {
  id: number;
  traderId: number;
  date: string;
  totalValue: number;
  totalCash: number;
  holdings: Holding[];
}

interface Raw {
  id: number;
  traderId: number;
  date: string;
  totalValue: string;
  totalCash: string;
  holdings: Holding[];
}

interface Create {
  traderId: number;
  date: string;
  totalValue: number;
  totalCash: number;
  holdings: Holding[];
}

const convertToRecord = (raw: Raw): Record => {
  return {
    id: raw.id,
    traderId: raw.traderId,
    date: raw.date,
    holdings: raw.holdings,
    totalValue: parseInt(raw.totalValue),
    totalCash: parseInt(raw.totalCash)
  }
}

export const getLatest = async (
  traderId: number
): Promise<Record | null> => {
  const record = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TRADER_HOLDING,
    conditions: [
      { key: 'traderId', value: traderId }
    ],
    orderBy: { key: 'date', type: 'desc' }
  })
  return record ? convertToRecord(record) : null
}

export const create = async (
  values: Create
): Promise<Record> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TRADER_HOLDING,
    values: {
      traderId: values.traderId,
      date: values.date,
      totalValue: String(values.totalValue),
      totalCash: String(values.totalCash),
      holdings: JSON.stringify(values.holdings)
    }
  })
  return convertToRecord(newRecords[0])
}
