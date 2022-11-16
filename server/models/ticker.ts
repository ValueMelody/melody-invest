
import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as interfaces from '@shared/interfaces'
import { Knex } from 'knex'

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

export const create = async (
  values: interfaces.tickerModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.tickerModel.Record> => {
  const ticker = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return ticker
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
