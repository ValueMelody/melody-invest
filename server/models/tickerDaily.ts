import { Knex } from 'knex'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export type MovementKey =
  'priceDailyIncrease' | 'priceDailyDecrease' |
  'priceWeeklyIncrease' | 'priceWeeklyDecrease' |
  'priceMonthlyIncrease' | 'priceMonthlyDecrease' |
  'priceQuarterlyIncrease' | 'priceQuarterlyDecrease' |
  'priceYearlyIncrease' | 'priceYearlyDecrease'

interface Common {
  id: number;
  tickerId: number;
  date: string;
  volume: number;
  splitCoefficient: string;
  dividendPercent: string;
  priceDailyIncrease: number | null;
  priceDailyDecrease: number | null;
  priceWeeklyIncrease: number | null;
  priceWeeklyDecrease: number | null;
  priceMonthlyIncrease: number | null;
  priceMonthlyDecrease: number | null;
  priceQuarterlyIncrease: number | null;
  priceQuarterlyDecrease: number | null;
  priceYearlyIncrease: number | null;
  priceYearlyDecrease: number | null;
}

export interface Record extends Common {
  closePrice: number;
  adjustedClosePrice: number;
  weeklyAveragePrice: number | null;
  monthlyAveragePrice: number | null;
  quarterlyAveragePrice: number | null;
  yearlyAveragePrice: number | null;
}

interface Raw extends Common {
  closePrice: string;
  adjustedClosePrice: string;
  weeklyAveragePrice: string | null;
  monthlyAveragePrice: string | null;
  quarterlyAveragePrice: string | null;
  yearlyAveragePrice: string | null;
}

interface Create {
  tickerId: number;
  date: string;
  volume: number;
  closePrice: string;
  splitCoefficient: string;
  dividendPercent: string;
  adjustedClosePrice: number;
}

interface Update {
  weeklyAveragePrice?: number | null;
  monthlyAveragePrice?: number | null;
  quarterlyAveragePrice?: number | null;
  yearlyAveragePrice?: number | null;
  priceDailyIncrease?: number | null;
  priceDailyDecrease?: number | null;
  priceWeeklyIncrease?: number | null;
  priceWeeklyDecrease?: number | null;
  priceMonthlyIncrease?: number | null;
  priceMonthlyDecrease?: number | null;
  priceQuarterlyIncrease?: number | null;
  priceQuarterlyDecrease?: number | null;
  priceYearlyIncrease?: number | null;
  priceYearlyDecrease?: number | null;
}

const convertToRecord = (raw: Raw): Record => ({
  ...raw,
  closePrice: parseFloat(raw.closePrice),
  adjustedClosePrice: parseInt(raw.adjustedClosePrice),
  weeklyAveragePrice: raw.weeklyAveragePrice ? parseInt(raw.weeklyAveragePrice) : null,
  monthlyAveragePrice: raw.monthlyAveragePrice ? parseInt(raw.monthlyAveragePrice) : null,
  quarterlyAveragePrice: raw.quarterlyAveragePrice ? parseInt(raw.quarterlyAveragePrice) : null,
  yearlyAveragePrice: raw.yearlyAveragePrice ? parseInt(raw.yearlyAveragePrice) : null,
})

export const getByUK = async (
  tickerId: number,
  date: string,
): Promise<Record | null> => {
  const tickerDaily = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER_DAILY,
    conditions: [
      { key: 'tickerId', value: tickerId },
      { key: 'date', value: date },
    ],
  })
  return tickerDaily ? convertToRecord(tickerDaily) : null
}

export const getPreviousOne = async (
  tickerId: number,
  date: string,
): Promise<Record | null> => {
  const tickerDaily = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER_DAILY,
    conditions: [
      { key: 'tickerId', value: tickerId },
      { key: 'date', type: '<', value: date },
    ],
    orderBy: [{ column: 'date', order: 'desc' }],
  })
  return tickerDaily ? convertToRecord(tickerDaily) : null
}

export const getLatestDate = async (): Promise<string | null> => {
  const tickerDaily = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER_DAILY,
    orderBy: [{ column: 'date', order: 'desc' }],
  })
  return tickerDaily ? tickerDaily.date : null
}

export const getAll = async (
  tickerId: number,
): Promise<Record[]> => {
  const tickerDaily = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TICKER_DAILY,
    conditions: [
      { key: 'tickerId', value: tickerId },
    ],
    orderBy: [{ column: 'date', order: 'asc' }],
  })
  return tickerDaily.map((daily) => convertToRecord(daily))
}

export const getAllLatestByDate = async (date: string): Promise<Record[]> => {
  const latestTickerDailys = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TICKER_DAILY,
    orderBy: [{ column: 'tickerId', order: 'asc' }, { column: 'date', order: 'desc' }],
    groupBy: [
      `${tableEnum.NAMES.TICKER_DAILY}.id`,
      `${tableEnum.NAMES.TICKER_DAILY}.tickerId`,
    ],
    conditions: [
      { key: 'date', value: date, type: '<=' },
    ],
    distinctOn: 'tickerId',
  })
  return latestTickerDailys.map((daily) => convertToRecord(daily))
}

export const getByDate = async (
  date: string,
): Promise<Record[]> => {
  const tickerDaily = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TICKER_DAILY,
    conditions: [
      { key: 'date', value: date },
    ],
  })
  return tickerDaily.map((daily) => convertToRecord(daily))
}

export const create = async (
  values: Create, transaction: Knex.Transaction,
): Promise<Record> => {
  const newRecord = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TICKER_DAILY,
    values,
    transaction,
  })
  return convertToRecord(newRecord)
}

export const update = async (
  tickerDailyId: number,
  values: Update,
  transaction: Knex.Transaction,
): Promise<Record> => {
  const updatedDaily = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TICKER_DAILY,
    values,
    conditions: [
      { key: 'id', value: tickerDailyId },
    ],
    transaction,
  })
  return convertToRecord(updatedDaily[0])
}
