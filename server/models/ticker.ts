import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as adapterEnum from '../enums/adapter'
import * as databaseAdapter from '../adapters/database'

const TableName = adapterEnum.DatabaseTable.Ticker

export const getByUK = async (
  region: string,
  symbol: string,
): Promise<interfaces.tickerModel.Record | null> => {
  const tickerRegion = region.toUpperCase()
  const tickerSymbol = symbol.toUpperCase()

  const ticker = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'region', value: tickerRegion },
      { key: 'symbol', value: tickerSymbol },
    ],
  })
  return ticker
}

export const getAll = async (): Promise<interfaces.tickerModel.Record[]> => {
  const tickers = await databaseAdapter.findAll({
    tableName: TableName,
  })
  return tickers
}

export const update = async (
  tickerId: number,
  values: interfaces.tickerModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.tickerModel.Record> => {
  const updatedTicker = await databaseAdapter.update({
    tableName: TableName,
    values,
    conditions: [
      { key: 'id', value: tickerId },
    ],
    transaction,
  })
  return updatedTicker[0]
}
