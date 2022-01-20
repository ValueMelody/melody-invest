import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

interface TradeRecord {
  lastTradeDate: string;
  history: [];
}

export interface Trader {
  id: number;
  tradeEnvId: number;
  tradeDNAId: number;
  currentValue: number;
  tradeRecord: TradeRecord;
  isActive: boolean;
  lastTradeDate: string;
}

export interface TraderEdit {
  tradeEnvId?: number;
  tradeDNAId?: number;
  currentValue?: number;
  tradeRecord?: string;
  isActive?: boolean;
  lastTradeDate?: string;
}

export const getByUK = async (
  envId: number,
  dnaId: number
): Promise<Trader | null> => {
  const trader = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TRADER,
    conditions: [
      { key: 'tradeEnvId', value: envId },
      { key: 'tradeDNAId', value: dnaId }
    ]
  })
  return trader
}

export const getActives = async (): Promise<Trader[]> => {
  const traders = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TRADER,
    conditions: [
      { key: 'isActive', value: true }
    ]
  })
  return traders
}
