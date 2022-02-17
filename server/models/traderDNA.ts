import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export type BuyGene =
  'priceDailyIncreaseBuy' | 'priceDailyDecreaseBuy' |
  'priceWeeklyIncreaseBuy' | 'priceWeeklyDecreaseBuy' |
  'priceMonthlyIncreaseBuy' | 'priceMonthlyDecreaseBuy' |
  'priceQuarterlyIncreaseBuy' | 'priceQuarterlyDecreaseBuy' |
  'priceYearlyIncreaseBuy' | 'priceYearlyDecreaseBuy' |
  'epsQuarterlyBeatsBuy' | 'epsQuarterlyMissBuy'

export type SellGene =
  'priceDailyIncreaseSell' | 'priceDailyDecreaseSell' |
  'priceWeeklyIncreaseSell' | 'priceWeeklyDecreaseSell' |
  'priceMonthlyIncreaseSell' | 'priceMonthlyDecreaseSell' |
  'priceQuarterlyIncreaseSell' | 'priceQuarterlyDecreaseSell' |
  'priceYearlyIncreaseSell' | 'priceYearlyDecreaseSell' |
  'epsQuarterlyBeatsSell' | 'epsQuarterlyMissSell'

export type GeneType =
  BuyGene | SellGene | 'cashMaxPercent' | 'tickerMinPercent' | 'tickerMaxPercent' |
  'holdingBuyPercent' | 'holdingSellPercent' | 'tradeFrequency' | 'rebalanceFrequency'

export interface Record {
  id: number;
  hashCode: string;
  priceDailyIncreaseBuy: number | null;
  priceDailyIncreaseSell: number | null;
  priceDailyDecreaseBuy: number | null;
  priceDailyDecreaseSell: number | null;
  priceWeeklyIncreaseBuy: number | null;
  priceWeeklyIncreaseSell: number | null;
  priceWeeklyDecreaseBuy: number | null;
  priceWeeklyDecreaseSell: number | null;
  priceMonthlyIncreaseBuy: number | null;
  priceMonthlyIncreaseSell: number | null;
  priceMonthlyDecreaseBuy: number | null;
  priceMonthlyDecreaseSell: number | null;
  priceQuarterlyIncreaseBuy: number | null;
  priceQuarterlyIncreaseSell: number | null;
  priceQuarterlyDecreaseBuy: number | null;
  priceQuarterlyDecreaseSell: number | null;
  priceYearlyIncreaseBuy: number | null;
  priceYearlyIncreaseSell: number | null;
  priceYearlyDecreaseBuy: number | null;
  priceYearlyDecreaseSell: number | null;
  cashMaxPercent: number;
  tickerMinPercent: number;
  tickerMaxPercent: number;
  holdingBuyPercent: number;
  holdingSellPercent: number;
  tradeFrequency: number;
  rebalanceFrequency: number;
  epsQuarterlyBeatsBuy: number;
  epsQuarterlyMissBuy: number;
  epsQuarterlyBeatsSell: number;
  epsQuarterlyMissSell: number;
}

export interface Create {
  hashCode: string;
  priceDailyIncreaseBuy: number | null;
  priceDailyIncreaseSell: number | null;
  priceDailyDecreaseBuy: number | null;
  priceDailyDecreaseSell: number | null;
  priceWeeklyIncreaseBuy: number | null;
  priceWeeklyIncreaseSell: number | null;
  priceWeeklyDecreaseBuy: number | null;
  priceWeeklyDecreaseSell: number | null;
  priceMonthlyIncreaseBuy: number | null;
  priceMonthlyIncreaseSell: number | null;
  priceMonthlyDecreaseBuy: number | null;
  priceMonthlyDecreaseSell: number | null;
  priceQuarterlyIncreaseBuy: number | null;
  priceQuarterlyIncreaseSell: number | null;
  priceQuarterlyDecreaseBuy: number | null;
  priceQuarterlyDecreaseSell: number | null;
  priceYearlyIncreaseBuy: number | null;
  priceYearlyIncreaseSell: number | null;
  priceYearlyDecreaseBuy: number | null;
  priceYearlyDecreaseSell: number | null;
  cashMaxPercent: number;
  tickerMinPercent: number;
  tickerMaxPercent: number;
  holdingBuyPercent: number;
  holdingSellPercent: number;
  tradeFrequency: number;
  rebalanceFrequency: number;
  epsQuarterlyBeatsBuy: number | null;
  epsQuarterlyMissBuy: number | null;
  epsQuarterlyBeatsSell: number | null;
  epsQuarterlyMissSell: number | null;
}

export const getByPK = async (
  id: number,
): Promise<Record | null> => {
  const dna = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TRADER_DNA,
    conditions: [
      { key: 'id', value: id },
    ],
  })
  return dna
}

export const getByUK = async (
  hashCode: string,
): Promise<Record | null> => {
  const dna = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TRADER_DNA,
    conditions: [
      { key: 'hashCode', value: hashCode },
    ],
  })
  return dna
}

export const create = async (
  values: Create,
): Promise<Record> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TRADER_DNA,
    values,
  })
  return newRecords[0]
}
