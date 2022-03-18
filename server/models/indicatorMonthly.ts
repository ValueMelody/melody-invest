import { Knex } from 'knex'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'
import * as dateTool from '../tools/date'

export type IndicatorKey =
  'fundsRate' | 'tenYearsTreasury' | 'thirtyYearsTreasury' | 'cpi' |
  'inflationExpectation' | 'consumerSentiment' | 'retailSales' |
  'durableGoods' | 'unemploymentRate' | 'nonfarmPayroll'

export type MovementKey =
  'fundsRateMonthlyIncrease' | 'fundsRateMonthlyDecrease' |
  'thirtyYearsTreasuryMonthlyIncrease' | 'thirtyYearsTreasuryMonthlyDecrease' |
  'tenYearsTreasuryMonthlyIncrease' | 'tenYearsTreasuryMonthlyDecrease' |
  'inflationMonthlyIncrease' | 'inflationMonthlyDecrease' |
  'cpiMonthlyIncrease' | 'cpiMonthlyDecrease' |
  'consumerSentimentMonthlyIncrease' | 'consumerSentimentMonthlyDecrease' |
  'retailSalesMonthlyIncrease' | 'retailSalesMonthlyDecrease' |
  'durableGoodsMonthlyIncrease' | 'durableGoodsMonthlyDecrease' |
  'unemployeementRateMonthlyIncrease' | 'unemployeementRateMonthlyDecrease' |
  'nonfarmPayrollMonthlyIncrease' | 'nonfarmPayrollMonthlyDecrease'

interface Common {
  id: number;
  month: string;
  fundsRateMonthlyIncrease: number | null;
  fundsRateMonthlyDecrease: number | null;
  thirtyYearsTreasuryMonthlyIncrease: number | null;
  thirtyYearsTreasuryMonthlyDecrease: number | null;
  tenYearsTreasuryMonthlyIncrease: number | null;
  tenYearsTreasuryMonthlyDecrease: number | null;
  inflationMonthlyIncrease: number | null;
  inflationMonthlyDecrease: number | null;
  cpiMonthlyIncrease: number | null;
  cpiMonthlyDecrease: number | null;
  consumerSentimentMonthlyIncrease: number | null;
  consumerSentimentMonthlyDecrease: number | null;
  retailSalesMonthlyIncrease: number | null;
  retailSalesMonthlyDecrease: number | null;
  durableGoodsMonthlyIncrease: number | null;
  durableGoodsMonthlyDecrease: number | null;
  unemployeementRateMonthlyIncrease: number | null;
  unemployeementRateMonthlyDecrease: number | null;
  nonfarmPayrollMonthlyIncrease: number | null;
  nonfarmPayrollMonthlyDecrease: number | null;
}

export interface Record extends Common {
  fundsRate: number | null;
  cpi: number | null;
  tenYearsTreasury: number | null;
  thirtyYearsTreasury: number | null;
  inflationExpectation: number | null;
  consumerSentiment: number | null;
  retailSales: number | null;
  durableGoods: number | null;
  unemploymentRate: number | null;
  nonfarmPayroll: number | null;
}

export interface Raw extends Common {
  fundsRate: string | null;
  cpi: string | null;
  tenYearsTreasury: string | null;
  thirtyYearsTreasury: string | null;
  inflationExpectation: string | null;
  consumerSentiment: string | null;
  retailSales: string | null;
  durableGoods: string | null;
  unemploymentRate: string | null;
  nonfarmPayroll: string | null;
}

interface Create {
  month: string;
  fundsRate?: string;
  cpi?: string;
  tenYearsTreasury?: string;
  thirtyYearsTreasury?: string;
  inflationExpectation?: string;
  consumerSentiment?: string;
  retailSales?: string;
  durableGoods?: string;
  unemploymentRate?: string;
  nonfarmPayroll?: string;
}

interface Update {
  fundsRate?: string;
  cpi?: string;
  tenYearsTreasury?: string;
  thirtyYearsTreasury?: string;
  inflationExpectation?: string;
  consumerSentiment?: string;
  retailSales?: string;
  durableGoods?: string;
  unemploymentRate?: string;
  nonfarmPayroll?: string;
  fundsRateMonthlyIncrease?: number | null;
  fundsRateMonthlyDecrease?: number | null;
  thirtyYearsTreasuryMonthlyIncrease?: number | null;
  thirtyYearsTreasuryMonthlyDecrease?: number | null;
  tenYearsTreasuryMonthlyIncrease?: number | null;
  tenYearsTreasuryMonthlyDecrease?: number | null;
  inflationMonthlyIncrease?: number | null;
  inflationMonthlyDecrease?: number | null;
  cpiMonthlyIncrease?: number | null;
  cpiMonthlyDecrease?: number | null;
  consumerSentimentMonthlyIncrease?: number | null;
  consumerSentimentMonthlyDecrease?: number | null;
  retailSalesMonthlyIncrease?: number | null;
  retailSalesMonthlyDecrease?: number | null;
  durableGoodsMonthlyIncrease?: number | null;
  durableGoodsMonthlyDecrease?: number | null;
  unemployeementRateMonthlyIncrease?: number | null;
  unemployeementRateMonthlyDecrease?: number | null;
  nonfarmPayrollMonthlyIncrease?: number | null;
  nonfarmPayrollMonthlyDecrease?: number | null;
}

const convertToRecord = (raw: Raw): Record => ({
  ...raw,
  fundsRate: raw.fundsRate ? parseFloat(raw.fundsRate) : null,
  cpi: raw.cpi ? parseFloat(raw.cpi) : null,
  tenYearsTreasury: raw.tenYearsTreasury ? parseFloat(raw.tenYearsTreasury) : null,
  thirtyYearsTreasury: raw.thirtyYearsTreasury ? parseFloat(raw.thirtyYearsTreasury) : null,
  inflationExpectation: raw.inflationExpectation ? parseFloat(raw.inflationExpectation) : null,
  consumerSentiment: raw.consumerSentiment ? parseFloat(raw.consumerSentiment) : null,
  retailSales: raw.retailSales ? parseInt(raw.retailSales) : null,
  durableGoods: raw.durableGoods ? parseInt(raw.durableGoods) : null,
  unemploymentRate: raw.unemploymentRate ? parseFloat(raw.unemploymentRate) : null,
  nonfarmPayroll: raw.nonfarmPayroll ? parseInt(raw.nonfarmPayroll) : null,
})

export const getByUK = async (
  month: string,
): Promise<Record | null> => {
  const monthly = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.INDICATOR_MONTHLY,
    conditions: [
      { key: 'month', value: month },
    ],
  })
  return monthly ? convertToRecord(monthly) : null
}

export const getAll = async (): Promise<Record[]> => {
  const monthly = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.INDICATOR_MONTHLY,
    orderBy: [{ column: 'month', order: 'asc' }],
  })
  return monthly.map((raw) => convertToRecord(raw))
}

export const getPublishedByDate = async (date: string): Promise<Record | null> => {
  const estimatedDate = dateTool.getPreviousDate(date, 15)
  const month = estimatedDate.substring(0, 7)

  const raw = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.INDICATOR_MONTHLY,
    conditions: [
      { key: 'month', value: month },
    ],
  })
  return raw ? convertToRecord(raw) : null
}

export const create = async (
  values: Create, transaction: Knex.Transaction,
): Promise<Record> => {
  const newRecord = await databaseAdapter.create({
    tableName: tableEnum.NAME.INDICATOR_MONTHLY,
    values,
    transaction,
  })
  return convertToRecord(newRecord)
}

export const update = async (
  indicatorMonthlyId: number,
  values: Update,
  transaction: Knex.Transaction,
): Promise<Record> => {
  const updated = await databaseAdapter.update({
    tableName: tableEnum.NAME.INDICATOR_MONTHLY,
    values,
    conditions: [
      { key: 'id', value: indicatorMonthlyId },
    ],
    transaction,
  })
  return convertToRecord(updated[0])
}
