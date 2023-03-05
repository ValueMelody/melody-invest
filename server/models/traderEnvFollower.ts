import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as interfaces from '@shared/interfaces'
import { Knex } from 'knex'

const TableName = adapterEnum.DatabaseTable.TraderEnvFollower

export const getByUK = async (
  userId: number,
  traderEnvId: number,
): Promise<interfaces.traderEnvFollowerModel.Record | null> => {
  const record = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'userId', value: userId },
      { key: 'traderEnvId', value: traderEnvId },
    ],
    orderBy: [{ column: 'traderEnvId', order: 'asc' }],
  })
  return record
}

export const getUserFollowed = async (
  userId: number,
): Promise<interfaces.traderEnvFollowerModel.Record[]> => {
  const records = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'userId', value: userId },
    ],
    orderBy: [{ column: 'traderEnvId', order: 'asc' }],
  })
  return records
}

export const getEnvFollowers = async (
  envId: number,
): Promise<interfaces.traderEnvFollowerModel.Record[]> => {
  const records = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'envId', value: envId },
    ],
  })
  return records
}

export const create = async (
  values: interfaces.traderEnvFollowerModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.traderEnvFollowerModel.Record> => {
  const record = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return record
}

export const createIfEmpty = async (
  values: interfaces.traderEnvFollowerModel.Create,
  transaction: Knex.Transaction,
): Promise<{
  record: interfaces.traderEnvFollowerModel.Record;
  isNew: boolean;
}> => {
  const currentRecord = await getByUK(values.userId, values.traderEnvId)
  if (currentRecord) return { record: currentRecord, isNew: false }

  const created = await create(values, transaction)
  return { record: created, isNew: true }
}

export const destroy = async (
  userId: number,
  traderEnvId: number,
  transaction: Knex.Transaction,
) => {
  await databaseAdapter.destroy({
    tableName: TableName,
    conditions: [
      { key: 'userId', value: userId },
      { key: 'traderEnvId', value: traderEnvId },
    ],
    transaction,
  })
  return true
}
