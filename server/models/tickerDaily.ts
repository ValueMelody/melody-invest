import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface TickerDaily {
  id: number;
  tickerId: number;
  date: string;
  volume: number;
  closePrice: string;
  splitCoefficient: string;
  dividendPercent: string;
  adjustedClosePrice: string;
  priceDailyIncrease: number;
  priceDailyDecrease: number;
  priceWeeklyIncrease: number;
  priceWeeklyDecrease: number;
  weeklyAveragePrice: string;
  monthlyAveragePrice: string;
  quarterlyAveragePrice: string;
  yearlyAveragePrice: string;
}

interface TickerDailyEdit {
  tickerId?: number;
  date?: string;
  volume?: number;
  closePrice?: string;
  splitCoefficient?: string;
  dividendPercent?: string;
  adjustedClosePrice?: string;
  priceDailyIncrease?: number;
  priceDailyDecrease?: number;
  priceWeeklyIncrease?: number;
  priceWeeklyDecrease?: number;
  weeklyAveragePrice?: string;
  monthlyAveragePrice?: string;
  quarterlyAveragePrice?: string;
  yearlyAveragePrice?: string;
}

export const getByUK = async (
  tickerId: number,
  date: string
): Promise<TickerDaily | null> => {
  const tickerDaily = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER_DAILY,
    conditions: [
      { key: 'tickerId', value: tickerId },
      { key: 'date', value: date }
    ]
  })
  return tickerDaily
}

export const getPreviousOne = async (
  tickerId: number,
  date: string
): Promise<TickerDaily | null> => {
  const tickerDaily = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER_DAILY,
    conditions: [
      { key: 'tickerId', value: tickerId },
      { key: 'date', type: '<', value: date }
    ],
    orderBy: { key: 'date', type: 'desc' }
  })
  return tickerDaily
}

export const getAll = async (
  tickerId: number
): Promise<TickerDaily[]> => {
  const tickerDaily = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TICKER_DAILY,
    conditions: [
      { key: 'tickerId', value: tickerId }
    ],
    orderBy: { key: 'date', type: 'asc' }
  })
  return tickerDaily
}

export const create = async (
  values: TickerDailyEdit
): Promise<TickerDaily> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TICKER_DAILY,
    values
  })
  return newRecords?.length ? newRecords[0] : null
}

export const update = async (
  tickerDailyId: number,
  values: TickerDailyEdit
): Promise<TickerDaily> => {
  const updatedDaily = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TICKER_DAILY,
    values,
    conditions: [
      { key: 'id', value: tickerDailyId }
    ]
  })
  return updatedDaily?.length ? updatedDaily[0] : null
}
