import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface TickerShare {
  tickerId: number;
  shares: number;
}

export interface HoldingDetails {
  total: number;
  cash: number;
  tickerShares: TickerShare[];
}

export interface TraderHolding {
  id: number;
  traderId: number;
  date: string;
  details: HoldingDetails;
}

interface TraderHoldingEdit {
  traderId?: number;
  date?: string;
  details?: HoldingDetails;
}

export const getLatest = async (
  traderId: number
): Promise<TraderHolding | null> => {
  const trader = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TRADER_HOLDING,
    conditions: [
      { key: 'traderId', value: traderId }
    ],
    orderBy: { key: 'date', type: 'desc' }
  })
  return trader
}

export const create = async (
  values: TraderHoldingEdit
): Promise<TraderHolding> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TRADER_HOLDING,
    values
  })
  return newRecords?.length ? newRecords[0] : null
}
