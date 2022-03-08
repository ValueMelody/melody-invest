import { Knex } from 'knex'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export type MovementBuyBehavior =
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
  'revenueYearlyIncreaseBuy' | 'revenueYearlyDecreaseBuy' |
  'inflationYearlyIncreaseBuy' | 'inflationYearlyDecreaseBuy' |
  'fundsRateMonthlyIncreaseBuy' | 'fundsRateMonthlyDecreaseBuy' |
  'thirtyYearsTreasuryMonthlyIncreaseBuy' | 'thirtyYearsTreasuryMonthlyDecreaseBuy' |
  'tenYearsTreasuryMonthlyIncreaseBuy' | 'tenYearsTreasuryMonthlyDecreaseBuy' |
  'inflationMonthlyIncreaseBuy' | 'inflationMonthlyDecreaseBuy' |
  'cpiMonthlyIncreaseBuy' | 'cpiMonthlyDecreaseBuy' |
  'consumerSentimentMonthlyIncreaseBuy' | 'consumerSentimentMonthlyDecreaseBuy' |
  'retailSalesMonthlyIncreaseBuy' | 'retailSalesMonthlyDecreaseBuy' |
  'durableGoodsMonthlyIncreaseBuy' | 'durableGoodsMonthlyDecreaseBuy' |
  'unemployeementRateMonthlyIncreaseBuy' | 'unemployeementRateMonthlyDecreaseBuy' |
  'nonfarmPayrollMonthlyIncreaseBuy' | 'nonfarmPayrollMonthlyDecreaseBuy'

export type CompareBuyBehavior =
  'gdpYearlyChangeAboveBuy' | 'gdpYearlyChangeBelowBuy' |
  'gdpQuarterlyChangeAboveBuy' | 'gdpQuarterlyChangeBelowBuy' |
  'gdpQuarterlyYoYChangeAboveBuy' | 'gdpQuarterlyYoYChangeBelowBuy'

export type MovementSellBehavior =
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
  'revenueYearlyIncreaseSell' | 'revenueYearlyDecreaseSell' |
  'inflationYearlyIncreaseSell' | 'inflationYearlyDecreaseSell' |
  'fundsRateMonthlyIncreaseSell' | 'fundsRateMonthlyDecreaseSell' |
  'thirtyYearsTreasuryMonthlyIncreaseSell' | 'thirtyYearsTreasuryMonthlyDecreaseSell' |
  'tenYearsTreasuryMonthlyIncreaseSell' | 'tenYearsTreasuryMonthlyDecreaseSell' |
  'inflationMonthlyIncreaseSell' | 'inflationMonthlyDecreaseSell' |
  'cpiMonthlyIncreaseSell' | 'cpiMonthlyDecreaseSell' |
  'consumerSentimentMonthlyIncreaseSell' | 'consumerSentimentMonthlyDecreaseSell' |
  'retailSalesMonthlyIncreaseSell' | 'retailSalesMonthlyDecreaseSell' |
  'durableGoodsMonthlyIncreaseSell' | 'durableGoodsMonthlyDecreaseSell' |
  'unemployeementRateMonthlyIncreaseSell' | 'unemployeementRateMonthlyDecreaseSell' |
  'nonfarmPayrollMonthlyIncreaseSell' | 'nonfarmPayrollMonthlyDecreaseSell'

export type CompareSellBehavior =
  'gdpYearlyChangeAboveSell' | 'gdpYearlyChangeBelowSell' |
  'gdpQuarterlyChangeAboveSell' | 'gdpQuarterlyChangeBelowSell' |
  'gdpQuarterlyYoYChangeAboveSell' | 'gdpQuarterlyYoYChangeBelowSell'

export type BehaviorType =
  MovementBuyBehavior | MovementSellBehavior |
  CompareBuyBehavior | CompareSellBehavior |
  'tickerMinPercent' | 'tickerMaxPercent' |
  'holdingBuyPercent' | 'holdingSellPercent' |
  'tradeFrequency' | 'rebalanceFrequency' | 'cashMaxPercent' |
  'buyPreference' | 'sellPreference'

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
  inflationYearlyIncreaseBuy: number | null;
  inflationYearlyDecreaseBuy: number | null;
  inflationYearlyIncreaseSell: number | null;
  inflationYearlyDecreaseSell: number | null;
  fundsRateMonthlyIncreaseBuy: number | null;
  fundsRateMonthlyDecreaseBuy: number | null;
  fundsRateMonthlyIncreaseSell: number | null;
  fundsRateMonthlyDecreaseSell: number | null;
  thirtyYearsTreasuryMonthlyIncreaseBuy: number | null;
  thirtyYearsTreasuryMonthlyDecreaseBuy: number | null;
  thirtyYearsTreasuryMonthlyIncreaseSell: number | null;
  thirtyYearsTreasuryMonthlyDecreaseSell: number | null;
  tenYearsTreasuryMonthlyIncreaseBuy: number | null;
  tenYearsTreasuryMonthlyDecreaseBuy: number | null;
  tenYearsTreasuryMonthlyIncreaseSell: number | null;
  tenYearsTreasuryMonthlyDecreaseSell: number | null;
  inflationMonthlyIncreaseBuy: number | null;
  inflationMonthlyDecreaseBuy: number | null;
  inflationMonthlyIncreaseSell: number | null;
  inflationMonthlyDecreaseSell: number | null;
  cpiMonthlyIncreaseBuy: number | null;
  cpiMonthlyDecreaseBuy: number | null;
  cpiMonthlyIncreaseSell: number | null;
  cpiMonthlyDecreaseSell: number | null;
  consumerSentimentMonthlyIncreaseBuy: number | null;
  consumerSentimentMonthlyDecreaseBuy: number | null;
  consumerSentimentMonthlyIncreaseSell: number | null;
  consumerSentimentMonthlyDecreaseSell: number | null;
  retailSalesMonthlyIncreaseBuy: number | null;
  retailSalesMonthlyDecreaseBuy: number | null;
  retailSalesMonthlyIncreaseSell: number | null;
  retailSalesMonthlyDecreaseSell: number | null;
  durableGoodsMonthlyIncreaseBuy: number | null;
  durableGoodsMonthlyDecreaseBuy: number | null;
  durableGoodsMonthlyIncreaseSell: number | null;
  durableGoodsMonthlyDecreaseSell: number | null;
  unemployeementRateMonthlyIncreaseBuy: number | null;
  unemployeementRateMonthlyDecreaseBuy: number | null;
  unemployeementRateMonthlyIncreaseSell: number | null;
  unemployeementRateMonthlyDecreaseSell: number | null;
  nonfarmPayrollMonthlyIncreaseBuy: number | null;
  nonfarmPayrollMonthlyDecreaseBuy: number | null;
  nonfarmPayrollMonthlyIncreaseSell: number | null;
  nonfarmPayrollMonthlyDecreaseSell: number | null;
  gdpYearlyChangeAboveBuy: number | null;
  gdpYearlyChangeAboveSell: number | null;
  gdpYearlyChangeBelowBuy: number | null;
  gdpYearlyChangeBelowSell: number | null;
  gdpQuarterlyChangeAboveBuy: number | null;
  gdpQuarterlyChangeBelowBuy: number | null;
  gdpQuarterlyChangeAboveSell: number | null;
  gdpQuarterlyChangeBelowSell: number | null;
  gdpQuarterlyYoYChangeAboveBuy: number | null;
  gdpQuarterlyYoYChangeBelowBuy: number | null;
  gdpQuarterlyYoYChangeAboveSell: number | null;
  gdpQuarterlyYoYChangeBelowSell: number | null;
  buyPreference: number;
  sellPreference: number;
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
  inflationYearlyIncreaseBuy: number | null;
  inflationYearlyDecreaseBuy: number | null;
  inflationYearlyIncreaseSell: number | null;
  inflationYearlyDecreaseSell: number | null;
  fundsRateMonthlyIncreaseBuy: number | null;
  fundsRateMonthlyDecreaseBuy: number | null;
  fundsRateMonthlyIncreaseSell: number | null;
  fundsRateMonthlyDecreaseSell: number | null;
  thirtyYearsTreasuryMonthlyIncreaseBuy: number | null;
  thirtyYearsTreasuryMonthlyDecreaseBuy: number | null;
  thirtyYearsTreasuryMonthlyIncreaseSell: number | null;
  thirtyYearsTreasuryMonthlyDecreaseSell: number | null;
  tenYearsTreasuryMonthlyIncreaseBuy: number | null;
  tenYearsTreasuryMonthlyDecreaseBuy: number | null;
  tenYearsTreasuryMonthlyIncreaseSell: number | null;
  tenYearsTreasuryMonthlyDecreaseSell: number | null;
  inflationMonthlyIncreaseBuy: number | null;
  inflationMonthlyDecreaseBuy: number | null;
  inflationMonthlyIncreaseSell: number | null;
  inflationMonthlyDecreaseSell: number | null;
  cpiMonthlyIncreaseBuy: number | null;
  cpiMonthlyDecreaseBuy: number | null;
  cpiMonthlyIncreaseSell: number | null;
  cpiMonthlyDecreaseSell: number | null;
  consumerSentimentMonthlyIncreaseBuy: number | null;
  consumerSentimentMonthlyDecreaseBuy: number | null;
  consumerSentimentMonthlyIncreaseSell: number | null;
  consumerSentimentMonthlyDecreaseSell: number | null;
  retailSalesMonthlyIncreaseBuy: number | null;
  retailSalesMonthlyDecreaseBuy: number | null;
  retailSalesMonthlyIncreaseSell: number | null;
  retailSalesMonthlyDecreaseSell: number | null;
  durableGoodsMonthlyIncreaseBuy: number | null;
  durableGoodsMonthlyDecreaseBuy: number | null;
  durableGoodsMonthlyIncreaseSell: number | null;
  durableGoodsMonthlyDecreaseSell: number | null;
  unemployeementRateMonthlyIncreaseBuy: number | null;
  unemployeementRateMonthlyDecreaseBuy: number | null;
  unemployeementRateMonthlyIncreaseSell: number | null;
  unemployeementRateMonthlyDecreaseSell: number | null;
  nonfarmPayrollMonthlyIncreaseBuy: number | null;
  nonfarmPayrollMonthlyDecreaseBuy: number | null;
  nonfarmPayrollMonthlyIncreaseSell: number | null;
  nonfarmPayrollMonthlyDecreaseSell: number | null;
  gdpYearlyChangeAboveBuy: number | null;
  gdpYearlyChangeAboveSell: number | null;
  gdpYearlyChangeBelowBuy: number | null;
  gdpYearlyChangeBelowSell: number | null;
  gdpQuarterlyChangeAboveBuy: number | null;
  gdpQuarterlyChangeBelowBuy: number | null;
  gdpQuarterlyChangeAboveSell: number | null;
  gdpQuarterlyChangeBelowSell: number | null;
  gdpQuarterlyYoYChangeAboveBuy: number | null;
  gdpQuarterlyYoYChangeBelowBuy: number | null;
  gdpQuarterlyYoYChangeAboveSell: number | null;
  gdpQuarterlyYoYChangeBelowSell: number | null;
  buyPreference: number | null;
  sellPreference: number | null;
}

export interface Update {
  hashCode: string;
}

export const getByPK = async (
  id: number,
): Promise<Record | null> => {
  const pattern = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TRADER_PATTERN,
    conditions: [
      { key: 'id', value: id },
    ],
  })
  return pattern
}

export const getByUK = async (
  hashCode: string,
): Promise<Record | null> => {
  const pattern = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TRADER_PATTERN,
    conditions: [
      { key: 'hashCode', value: hashCode },
    ],
  })
  return pattern
}

export const getAll = async (): Promise<Record[]> => {
  const patterns = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TRADER_PATTERN,
  })
  return patterns
}

export const create = async (
  values: Create, transaction: Knex.Transaction,
): Promise<Record> => {
  const patterns = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TRADER_PATTERN,
    values,
    transaction,
  })
  return patterns[0]
}

export const createIfEmpty = async (
  values: Create, transaction: Knex.Transaction,
): Promise<Record> => {
  const currentRecord = await getByUK(values.hashCode)
  if (currentRecord) return currentRecord
  return create(values, transaction)
}

export const update = async (
  id: number,
  values: Update,
  transaction: Knex.Transaction,
): Promise<Record> => {
  const patterns = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TRADER_PATTERN,
    values,
    conditions: [
      { key: 'id', value: id },
    ],
    transaction,
  })
  return patterns[0]
}
