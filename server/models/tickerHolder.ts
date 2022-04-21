import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as adapterEnum from '../enums/adapter'
import * as databaseAdapter from '../adapters/database'

const TableName = adapterEnum.DatabaseTable.TickerHolder

export const create = async (
  values: interfaces.tickerHolderModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.tickerHolderModel.Record> => {
  const result = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return result
}

export const destroyTraderTickers = async (
  traderId: number,
  transaction: Knex.Transaction,
) => {
  await databaseAdapter.destroy({
    tableName: TableName,
    conditions: [
      { key: 'traderId', value: traderId },
    ],
    transaction,
  })
  return true
}
