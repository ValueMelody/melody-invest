import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface TradeDNA {
  id: number;
  hashCode: string;
  [tableEnum.DNA_KEYS.PRICE_DAILY_INCREASE_BUY]: number | null;
  [tableEnum.DNA_KEYS.PRICE_DAILY_INCREASE_SELL]: number | null;
  [tableEnum.DNA_KEYS.PRICE_DAILY_DECREASE_BUY]: number | null;
  [tableEnum.DNA_KEYS.PRICE_DAILY_DECREASE_SELL]: number | null;
  [tableEnum.DNA_KEYS.PRICE_WEEKLY_INCREASE_BUY]: number | null;
  [tableEnum.DNA_KEYS.PRICE_WEEKLY_INCREASE_SELL]: number | null;
  [tableEnum.DNA_KEYS.PRICE_WEEKLY_DECREASE_BUY]: number | null;
  [tableEnum.DNA_KEYS.PRICE_WEEKLY_DECREASE_SELL]: number | null;
  [tableEnum.DNA_KEYS.PRICE_MONTHLY_INCREASE_BUY]: number | null;
  [tableEnum.DNA_KEYS.PRICE_MONTHLY_INCREASE_SELL]: number | null;
  [tableEnum.DNA_KEYS.PRICE_MONTHLY_DECREASE_BUY]: number | null;
  [tableEnum.DNA_KEYS.PRICE_MONTHLY_DECREASE_SELL]: number | null;
  [tableEnum.DNA_KEYS.PRICE_QUARTERLY_INCREASE_BUY]: number | null;
  [tableEnum.DNA_KEYS.PRICE_QUARTERLY_INCREASE_SELL]: number | null;
  [tableEnum.DNA_KEYS.PRICE_QUARTERLY_DECREASE_BUY]: number | null;
  [tableEnum.DNA_KEYS.PRICE_QUARTERLY_DECREASE_SELL]: number | null;
  [tableEnum.DNA_KEYS.PRICE_YEARLY_INCREASE_BUY]: number | null;
  [tableEnum.DNA_KEYS.PRICE_YEARLY_INCREASE_SELL]: number | null;
  [tableEnum.DNA_KEYS.PRICE_YEARLY_DECREASE_BUY]: number | null;
  [tableEnum.DNA_KEYS.PRICE_YEARLY_DECREASE_SELL]: number | null;
  [tableEnum.DNA_KEYS.CASH_MAX_PERCENT]: number | null;
  [tableEnum.DNA_KEYS.TICKER_MIN_PERCENT]: number | null;
  [tableEnum.DNA_KEYS.TICKER_MAX_PERCENT]: number | null;
  [tableEnum.DNA_KEYS.HOLDING_BUY_PERCENT]: number | null;
  [tableEnum.DNA_KEYS.HOLDING_SELL_PERCENT]: number | null;
  [tableEnum.DNA_KEYS.TRADE_FREQUENCY]: number;
  [tableEnum.DNA_KEYS.REBALANCE_FREQUENCY]: number;
}

export interface TradeDNACreate {
  hashCode: string;
  [tableEnum.DNA_KEYS.PRICE_DAILY_INCREASE_BUY]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_DAILY_INCREASE_SELL]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_DAILY_DECREASE_BUY]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_DAILY_DECREASE_SELL]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_WEEKLY_INCREASE_BUY]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_WEEKLY_INCREASE_SELL]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_WEEKLY_DECREASE_BUY]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_WEEKLY_DECREASE_SELL]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_MONTHLY_INCREASE_BUY]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_MONTHLY_INCREASE_SELL]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_MONTHLY_DECREASE_BUY]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_MONTHLY_DECREASE_SELL]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_QUARTERLY_INCREASE_BUY]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_QUARTERLY_INCREASE_SELL]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_QUARTERLY_DECREASE_BUY]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_QUARTERLY_DECREASE_SELL]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_YEARLY_INCREASE_BUY]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_YEARLY_INCREASE_SELL]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_YEARLY_DECREASE_BUY]?: number | null;
  [tableEnum.DNA_KEYS.PRICE_YEARLY_DECREASE_SELL]?: number | null;
  [tableEnum.DNA_KEYS.CASH_MAX_PERCENT]?: number | null;
  [tableEnum.DNA_KEYS.TICKER_MIN_PERCENT]?: number | null;
  [tableEnum.DNA_KEYS.TICKER_MAX_PERCENT]?: number | null;
  [tableEnum.DNA_KEYS.HOLDING_BUY_PERCENT]?: number | null;
  [tableEnum.DNA_KEYS.HOLDING_SELL_PERCENT]?: number | null;
  [tableEnum.DNA_KEYS.TRADE_FREQUENCY]?: number | null;
  [tableEnum.DNA_KEYS.REBALANCE_FREQUENCY]?: number | null;
}

export const getByPK = async (
  id: number
): Promise<TradeDNA | null> => {
  const dna = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TRADE_DNA,
    conditions: [
      { key: 'id', value: id }
    ]
  })
  return dna
}

export const getByUK = async (
  hashCode: string
): Promise<TradeDNA | null> => {
  const dna = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TRADE_DNA,
    conditions: [
      { key: 'hashCode', value: hashCode }
    ]
  })
  return dna
}

export const create = async (
  values: TradeDNACreate
): Promise<TradeDNA> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TRADE_DNA,
    values
  })
  return newRecords?.length ? newRecords[0] : null
}
