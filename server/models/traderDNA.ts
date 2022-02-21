import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export type BuyGene =
  'priceDailyIncreaseBuy' | 'priceDailyDecreaseBuy' |
  'priceWeeklyIncreaseBuy' | 'priceWeeklyDecreaseBuy' |
  'priceMonthlyIncreaseBuy' | 'priceMonthlyDecreaseBuy' |
  'priceQuarterlyIncreaseBuy' | 'priceQuarterlyDecreaseBuy' |
  'priceYearlyIncreaseBuy' | 'priceYearlyDecreaseBuy' |
  'epsQuarterlyBeatsBuy' | 'epsQuarterlyMissBuy' |
  'profitQuarterlyIncreaseBuy' | 'profitQuarterlyDecreaseBuy' |
  'incomeQuarterlyIncreaseBuy' | 'incomeQuarterlyDecreaseBuy' |
  'revenueQuarterlyIncreaseBuy' | 'revenueQuarterlyDecreaseBuy' |
  'profitYearlyIncreaseBuy' | 'profitYearlyDecreaseBuy' |
  'incomeYearlyIncreaseBuy' | 'incomeYearlyDecreaseBuy' |
  'revenueYearlyIncreaseBuy' | 'revenueYearlyDecreaseBuy'

export type SellGene =
  'priceDailyIncreaseSell' | 'priceDailyDecreaseSell' |
  'priceWeeklyIncreaseSell' | 'priceWeeklyDecreaseSell' |
  'priceMonthlyIncreaseSell' | 'priceMonthlyDecreaseSell' |
  'priceQuarterlyIncreaseSell' | 'priceQuarterlyDecreaseSell' |
  'priceYearlyIncreaseSell' | 'priceYearlyDecreaseSell' |
  'epsQuarterlyBeatsSell' | 'epsQuarterlyMissSell' |
  'profitQuarterlyIncreaseSell' | 'profitQuarterlyDecreaseSell' |
  'incomeQuarterlyIncreaseSell' | 'incomeQuarterlyDecreaseSell' |
  'revenueQuarterlyIncreaseSell' | 'revenueQuarterlyDecreaseSell' |
  'profitYearlyIncreaseSell' | 'profitYearlyDecreaseSell' |
  'incomeYearlyIncreaseSell' | 'incomeYearlyDecreaseSell' |
  'revenueYearlyIncreaseSell' | 'revenueYearlyDecreaseSell'

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
  profitQuarterlyIncreaseBuy: number;
  profitQuarterlyDecreaseBuy: number;
  incomeQuarterlyIncreaseBuy: number;
  incomeQuarterlyDecreaseBuy: number;
  revenueQuarterlyIncreaseBuy: number;
  revenueQuarterlyDecreaseBuy: number;
  profitQuarterlyIncreaseSell: number;
  profitQuarterlyDecreaseSell: number;
  incomeQuarterlyIncreaseSell: number;
  incomeQuarterlyDecreaseSell: number;
  revenueQuarterlyIncreaseSell: number;
  revenueQuarterlyDecreaseSell: number;
  profitYearlyIncreaseBuy: number;
  profitYearlyDecreaseBuy: number;
  incomeYearlyIncreaseBuy: number;
  incomeYearlyDecreaseBuy: number;
  revenueYearlyIncreaseBuy: number;
  revenueYearlyDecreaseBuy: number;
  profitYearlyIncreaseSell: number;
  profitYearlyDecreaseSell: number;
  incomeYearlyIncreaseSell: number;
  incomeYearlyDecreaseSell: number;
  revenueYearlyIncreaseSell: number;
  revenueYearlyDecreaseSell: number;
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
  profitQuarterlyIncreaseBuy: number | null;
  profitQuarterlyDecreaseBuy: number | null;
  incomeQuarterlyIncreaseBuy: number | null;
  incomeQuarterlyDecreaseBuy: number | null;
  revenueQuarterlyIncreaseBuy: number | null;
  revenueQuarterlyDecreaseBuy: number | null;
  profitQuarterlyIncreaseSell: number | null;
  profitQuarterlyDecreaseSell: number | null;
  incomeQuarterlyIncreaseSell: number | null;
  incomeQuarterlyDecreaseSell: number | null;
  revenueQuarterlyIncreaseSell: number | null;
  revenueQuarterlyDecreaseSell: number | null;
  profitYearlyIncreaseBuy: number | null;
  profitYearlyDecreaseBuy: number | null;
  incomeYearlyIncreaseBuy: number | null;
  incomeYearlyDecreaseBuy: number | null;
  revenueYearlyIncreaseBuy: number | null;
  revenueYearlyDecreaseBuy: number | null;
  profitYearlyIncreaseSell: number | null;
  profitYearlyDecreaseSell: number | null;
  incomeYearlyIncreaseSell: number | null;
  incomeYearlyDecreaseSell: number | null;
  revenueYearlyIncreaseSell: number | null;
  revenueYearlyDecreaseSell: number | null;
}

export interface Update {
  hashCode: string;
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

export const getAll = async (): Promise<Record[]> => {
  const dnas = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TRADER_DNA,
  })
  return dnas
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

export const update = async (
  id: number,
  values: Update,
): Promise<Record> => {
  const updatedDNA = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TRADER_DNA,
    values,
    conditions: [
      { key: 'id', value: id },
    ],
  })
  return updatedDNA[0]
}
