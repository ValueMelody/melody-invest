import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface Ticker {
  id: number;
  symbol: string;
  region: string;
  name: string;
  firstPriceDate: string;
  lastPriceDate: string;
  firstEPSYear: string;
  lastEPSYear: string;
  firstEPSQuarter: string;
  lastEPSQuarter: string;
  quarterlyEPSMonthDiffer: string;
  firstIncomeYear: string;
  lastIncomeYear: string;
  firstIncomeQuarter: string;
  lastIncomeQuarter: string;
  lastDailyChecked: string;
}

export interface TickerEdit {
  symbol?: string;
  region?: string;
  name?: string;
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
  lastDailyChecked?: string;
}

export const getByUK = async (
  region: string,
  symbol: string
): Promise<Ticker | null> => {
  const tickerRegion = region.toUpperCase()
  const tickerSymbol = symbol.toUpperCase()

  const ticker = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER,
    conditions: [
      { key: 'region', value: tickerRegion },
      { key: 'symbol', value: tickerSymbol }
    ]
  })
  return ticker
}

export const getAll = async (): Promise<Ticker[]> => {
  const tickers = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TICKER
  })
  return tickers
}

export const update = async (
  tickerId: number,
  values: TickerEdit
): Promise<Ticker> => {
  const updatedTicker = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TICKER,
    values,
    conditions: [
      { key: 'id', value: tickerId }
    ]
  })
  return updatedTicker?.length ? updatedTicker[0] : null
}
