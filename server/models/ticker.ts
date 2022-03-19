import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export const getByUK = async (
  region: string,
  symbol: string,
): Promise<interfaces.tickerModel.Record | null> => {
  const tickerRegion = region.toUpperCase()
  const tickerSymbol = symbol.toUpperCase()

  const ticker = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.TICKER,
    conditions: [
      { key: 'region', value: tickerRegion },
      { key: 'symbol', value: tickerSymbol },
    ],
  })
  return ticker
}

export const getAll = async (): Promise<interfaces.tickerModel.Record[]> => {
  const tickers = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TICKER,
  })
  return tickers
}

export const update = async (
  tickerId: number,
  values: interfaces.tickerModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.tickerModel.Record> => {
  const updatedTicker = await databaseAdapter.update({
    tableName: tableEnum.NAME.TICKER,
    values,
    conditions: [
      { key: 'id', value: tickerId },
    ],
    transaction,
  })
  return updatedTicker[0]
}
