import { Knex } from 'knex'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export type MovementKey =
  'priceDailyIncrease' | 'priceDailyDecrease' |
  'priceWeeklyIncrease' | 'priceWeeklyDecrease' |
  'priceMonthlyIncrease' | 'priceMonthlyDecrease' |
  'priceQuarterlyIncrease' | 'priceQuarterlyDecrease' |
  'priceYearlyIncrease' | 'priceYearlyDecrease'

export interface Record {
  id: number;
  tickerId: number;
  date: string;
  volume: number;
  closePrice: string;
  splitCoefficient: string;
  dividendPercent: string;
  adjustedClosePrice: number;
  weeklyAveragePrice: number | null;
  monthlyAveragePrice: number | null;
  quarterlyAveragePrice: number | null;
  yearlyAveragePrice: number | null;
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

interface Raw {
  id: number;
  tickerId: number;
  date: string;
  volume: number;
  closePrice: string;
  splitCoefficient: string;
  dividendPercent: string;
  adjustedClosePrice: string;
  weeklyAveragePrice: string | null;
  monthlyAveragePrice: string | null;
  quarterlyAveragePrice: string | null;
  yearlyAveragePrice: string | null;
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
  id: raw.id,
  tickerId: raw.tickerId,
  date: raw.date,
  volume: raw.volume,
  closePrice: raw.closePrice,
  splitCoefficient: raw.splitCoefficient,
  dividendPercent: raw.dividendPercent,
  adjustedClosePrice: parseInt(raw.adjustedClosePrice),
  weeklyAveragePrice: raw.weeklyAveragePrice ? parseInt(raw.weeklyAveragePrice) : null,
  monthlyAveragePrice: raw.monthlyAveragePrice ? parseInt(raw.monthlyAveragePrice) : null,
  quarterlyAveragePrice: raw.quarterlyAveragePrice ? parseInt(raw.quarterlyAveragePrice) : null,
  yearlyAveragePrice: raw.yearlyAveragePrice ? parseInt(raw.yearlyAveragePrice) : null,
  priceDailyIncrease: raw.priceDailyIncrease,
  priceDailyDecrease: raw.priceDailyDecrease,
  priceWeeklyIncrease: raw.priceWeeklyIncrease,
  priceWeeklyDecrease: raw.priceWeeklyDecrease,
  priceMonthlyIncrease: raw.priceMonthlyIncrease,
  priceMonthlyDecrease: raw.priceMonthlyDecrease,
  priceQuarterlyIncrease: raw.priceQuarterlyIncrease,
  priceQuarterlyDecrease: raw.priceQuarterlyDecrease,
  priceYearlyIncrease: raw.priceYearlyIncrease,
  priceYearlyDecrease: raw.priceYearlyDecrease,
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
    orderBy: { key: 'date', type: 'desc' },
  })
  return tickerDaily ? convertToRecord(tickerDaily) : null
}

export const getAll = async (
  tickerId: number,
): Promise<Record[]> => {
  const tickerDaily = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TICKER_DAILY,
    conditions: [
      { key: 'tickerId', value: tickerId },
    ],
    orderBy: { key: 'date', type: 'asc' },
  })
  return tickerDaily.map((daily) => convertToRecord(daily))
}

export const getLatestAll = async (): Promise<Record[]> => {
  const allRecords = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TICKER_DAILY,
    orderBy: { key: 'date', type: 'desc' },
  })
  const details = allRecords.reduce((details, record) => {
    if (details.tickerIds[record.tickerId]) return details
    return {
      latest: [...details.latest, convertToRecord(record)],
      tickerIds: { ...details.tickerIds, [record.tickerId]: true },
    }
  }, { latest: [], tickerIds: {} })

  return details.latest
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
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TICKER_DAILY,
    values,
    transaction,
  })
  return convertToRecord(newRecords[0])
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
