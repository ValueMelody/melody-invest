import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface Holding {
  tickerId: number;
  shares: number;
  value: number;
}

export interface TraderHolding {
  id: number;
  traderId: number;
  date: string;
  totalValue: number;
  totalCash: number;
  holdings: Holding[];
}

interface TraderHoldingRaw {
  id: number;
  traderId: number;
  date: string;
  totalValue: string;
  totalCash: string;
  holdings: Holding[];
}

interface TraderHoldingCreate {
  traderId: number;
  date: string;
  totalValue: number;
  totalCash: number;
  holdings: Holding[];
}

const convertToOutput = (record: TraderHoldingRaw): TraderHolding => {
  return {
    id: record.id,
    traderId: record.traderId,
    date: record.date,
    holdings: record.holdings,
    totalValue: parseFloat(record.totalValue),
    totalCash: parseFloat(record.totalCash)
  }
}

const convertToInput = (values: TraderHoldingCreate) => {
  return {
    traderId: values.traderId,
    date: values.date,
    totalValue: String(values.totalValue),
    totalCash: String(values.totalCash),
    holdings: JSON.stringify(values.holdings)
  }
}

export const getLatest = async (
  traderId: number
): Promise<TraderHolding | null> => {
  const record = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TRADER_HOLDING,
    conditions: [
      { key: 'traderId', value: traderId }
    ],
    orderBy: { key: 'date', type: 'desc' }
  })
  return record ? convertToOutput(record) : null
}

export const create = async (
  values: TraderHoldingCreate
): Promise<TraderHolding | null> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TRADER_HOLDING,
    values: convertToInput(values)
  })
  return newRecords?.length ? convertToOutput(newRecords[0]) : null
}
