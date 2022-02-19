import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface Record {
  id: number;
  symbol: string;
  region: string;
  name: string;
  firstPriceDate: string | null;
  lastPriceDate: string | null;
  firstEPSYear: string | null;
  lastEPSYear: string | null;
  firstEPSQuarter: string | null;
  lastEPSQuarter: string | null;
  firstIncomeYear: string | null;
  lastIncomeYear: string | null;
  firstIncomeQuarter: string | null;
  lastIncomeQuarter: string | null;
  quarterlyEPSMonthDiffer: number | null;
}

export interface Update {
  firstPriceDate?: string;
  lastPriceDate?: string;
  firstEPSYear?: string;
  lastEPSYear?: string;
  firstEPSQuarter?: string;
  lastEPSQuarter?: string;
  firstIncomeYear?: string;
  lastIncomeYear?: string;
  firstIncomeQuarter?: string;
  lastIncomeQuarter?: string;
  quarterlyEPSMonthDiffer?: number | null;
}

export const getByUK = async (
  region: string,
  symbol: string,
): Promise<Record | null> => {
  const tickerRegion = region.toUpperCase()
  const tickerSymbol = symbol.toUpperCase()

  const ticker = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER,
    conditions: [
      { key: 'region', value: tickerRegion },
      { key: 'symbol', value: tickerSymbol },
    ],
  })
  return ticker
}

export const getAll = async (): Promise<Record[]> => {
  const tickers = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TICKER,
  })
  return tickers
}

export const update = async (
  tickerId: number,
  values: Update,
): Promise<Record> => {
  const updatedTicker = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TICKER,
    values,
    conditions: [
      { key: 'id', value: tickerId },
    ],
  })
  return updatedTicker[0]
}
