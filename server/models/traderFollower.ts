import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'

const TableName = adapterEnum.DatabaseTable.TraderFollower

export const getByUK = async (
  userId: number,
  traderId: number,
): Promise<interfaces.traderFollowerModel.Record | null> => {
  const record = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'userId', value: userId },
      { key: 'traderId', value: traderId },
    ],
    orderBy: [{ column: 'traderId', order: 'asc' }],
  })
  return record
}

export const getUserFollowed = async (
  userId: number,
): Promise<interfaces.traderFollowerModel.Record[]> => {
  const records = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'userId', value: userId },
    ],
    orderBy: [{ column: 'traderId', order: 'asc' }],
  })
  return records
}

export const create = async (
  values: interfaces.traderFollowerModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.traderFollowerModel.Record> => {
  const record = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return record
}

export const destroy = async (
  userId: number,
  traderId: number,
  transaction: Knex.Transaction,
) => {
  await databaseAdapter.destroy({
    tableName: TableName,
    conditions: [
      { key: 'userId', value: userId },
      { key: 'traderId', value: traderId },
    ],
    transaction,
  })
  return true
}
