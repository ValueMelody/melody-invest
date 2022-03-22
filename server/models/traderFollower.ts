import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export const getByUK = async (
  userId: number,
  traderId: number,
): Promise<interfaces.traderFollowerModel.Record | null> => {
  const record = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.TRADER_FOLLOWER,
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
    tableName: tableEnum.NAME.TRADER_FOLLOWER,
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
    tableName: tableEnum.NAME.TRADER_FOLLOWER,
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
    tableName: tableEnum.NAME.TRADER_FOLLOWER,
    conditions: [
      { key: 'userId', value: userId },
      { key: 'traderId', value: traderId },
    ],
    transaction,
  })
  return true
}
