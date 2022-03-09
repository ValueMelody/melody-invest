import { Knex } from 'knex'
import * as interfaces from '@interfaces'
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

export const getByPK = async (
  id: number,
): Promise<interfaces.traderPatternModel.Record | null> => {
  const pattern = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TRADER_PATTERN,
    conditions: [
      { key: 'id', value: id },
    ],
  })
  return pattern
}

export const getInPKs = async (
  ids: number[],
): Promise<interfaces.traderPatternModel.Record[]> => {
  const patterns = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TRADER_PATTERN,
    conditions: [
      { key: 'id', value: ids, type: 'IN' },
    ],
  })
  return patterns
}

export const getByUK = async (
  hashCode: string,
): Promise<interfaces.traderPatternModel.Record | null> => {
  const pattern = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TRADER_PATTERN,
    conditions: [
      { key: 'hashCode', value: hashCode },
    ],
  })
  return pattern
}

export const getAll = async (): Promise<interfaces.traderPatternModel.Record[]> => {
  const patterns = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TRADER_PATTERN,
  })
  return patterns
}

export const create = async (
  values: interfaces.traderPatternModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.traderPatternModel.Record> => {
  const patterns = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TRADER_PATTERN,
    values,
    transaction,
  })
  return patterns[0]
}

export const createIfEmpty = async (
  values: interfaces.traderPatternModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.traderPatternModel.Record> => {
  const currentRecord = await getByUK(values.hashCode)
  if (currentRecord) return currentRecord
  return create(values, transaction)
}

export const update = async (
  id: number,
  values: interfaces.traderPatternModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.traderPatternModel.Record> => {
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
