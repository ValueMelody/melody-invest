import { Knex } from 'knex'
import * as traderFollowerModel from '../models/traderFollower'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface Record {
  userId: number;
  traderId: number;
}

export const getByUK = async (
  userId: number,
  traderId: number,
): Promise<traderFollowerModel.Record | null> => {
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
): Promise<Record[]> => {
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
  values: Record,
  transaction: Knex.Transaction,
): Promise<Record> => {
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
