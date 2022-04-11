import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export const getByUK = async (
  userId: number,
  traderComboId: number,
): Promise<interfaces.traderComboFollowerModel.Record | null> => {
  const record = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.TRADER_COMBO_FOLLOWER,
    conditions: [
      { key: 'userId', value: userId },
      { key: 'traderComboId', value: traderComboId },
    ],
    orderBy: [{ column: 'traderComboId', order: 'asc' }],
  })
  return record
}

export const getUserFollowed = async (
  userId: number,
): Promise<interfaces.traderComboFollowerModel.Record[]> => {
  const records = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER_COMBO_FOLLOWER,
    conditions: [
      { key: 'userId', value: userId },
    ],
    orderBy: [{ column: 'traderComboId', order: 'asc' }],
  })
  return records
}

export const create = async (
  values: interfaces.traderComboFollowerModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.traderComboFollowerModel.Record> => {
  const pattern = await databaseAdapter.create({
    tableName: tableEnum.NAME.TRADER_COMBO_FOLLOWER,
    values,
    transaction,
  })
  return pattern
}

export const createIfEmpty = async (
  values: interfaces.traderComboFollowerModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.traderComboFollowerModel.Record> => {
  const currentRecord = await getByUK(values.userId, values.traderComboId)
  if (currentRecord) return currentRecord
  return create(values, transaction)
}

export const destroy = async (
  userId: number,
  traderComboId: number,
  transaction: Knex.Transaction,
) => {
  await databaseAdapter.destroy({
    tableName: tableEnum.NAME.TRADER_COMBO_FOLLOWER,
    conditions: [
      { key: 'userId', value: userId },
      { key: 'traderComboId', value: traderComboId },
    ],
    transaction,
  })
  return true
}
