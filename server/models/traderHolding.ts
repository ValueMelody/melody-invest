import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

interface TickerShares {
  [key: string]: number
}

interface HoldingDetail {
  total: number,
  cash: number,
  tickerShares: TickerShares
}

export interface TraderHolding {
  id: number;
  traderId: number;
  date: string;
  detail: HoldingDetail;
}

export const getLatest = async (
  traderId: number
): Promise<TraderHolding | null> => {
  const trader = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TRADER,
    conditions: [
      { key: 'traderId', value: traderId }
    ],
    orderBy: { key: 'date', type: 'desc' }
  })
  return trader
}
