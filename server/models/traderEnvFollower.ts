import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export const getByUK = async (
  userId: number,
  traderEnvId: number,
): Promise<interfaces.traderEnvFollowerModel.Record | null> => {
  const record = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.TRADER_ENV_FOLLOWER,
    conditions: [
      { key: 'userId', value: userId },
      { key: 'traderEnvId', value: traderEnvId },
    ],
    orderBy: [{ column: 'traderEnvId', order: 'asc' }],
  })
  return record
}

export const create = async (
  values: interfaces.traderEnvFollowerModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.traderEnvFollowerModel.Record> => {
  const pattern = await databaseAdapter.create({
    tableName: tableEnum.NAME.TRADER_ENV_FOLLOWER,
    values,
    transaction,
  })
  return pattern
}

export const createIfEmpty = async (
  values: interfaces.traderEnvFollowerModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.traderEnvFollowerModel.Record> => {
  const currentRecord = await getByUK(values.userId, values.traderEnvId)
  if (currentRecord) return currentRecord
  return create(values, transaction)
}
