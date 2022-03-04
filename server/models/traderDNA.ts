import { Knex } from 'knex'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export type MovementBuyGene =
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

export type CompareBuyGene =
  'gdpYearlyChangeAboveBuy' | 'gdpYearlyChangeBelowBuy' |
  'gdpQuarterlyChangeAboveBuy' | 'gdpQuarterlyChangeBelowBuy' |
  'gdpQuarterlyYoYChangeAboveBuy' | 'gdpQuarterlyYoYChangeBelowBuy'

export type MovementSellGene =
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

export type CompareSellGene =
  'gdpYearlyChangeAboveSell' | 'gdpYearlyChangeBelowSell' |
  'gdpQuarterlyChangeAboveSell' | 'gdpQuarterlyChangeBelowSell' |
  'gdpQuarterlyYoYChangeAboveSell' | 'gdpQuarterlyYoYChangeBelowSell'

export type GeneType =
  MovementBuyGene | MovementSellGene |
  CompareBuyGene | CompareSellGene |
  'tickerMinPercent' | 'tickerMaxPercent' |
  'holdingBuyPercent' | 'holdingSellPercent' |
  'tradeFrequency' | 'rebalanceFrequency' | 'cashMaxPercent'

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
  values: Create, transaction: Knex.Transaction,
): Promise<Record> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TRADER_DNA,
    values,
    transaction,
  })
  return newRecords[0]
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
  const updatedDNA = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TRADER_DNA,
    values,
    conditions: [
      { key: 'id', value: id },
    ],
    transaction,
  })
  return updatedDNA[0]
}
