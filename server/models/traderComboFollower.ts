import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'

const TableName = adapterEnum.DatabaseTable.TraderComboFollower

export const getByUK = async (
  userId: number,
  traderComboId: number,
): Promise<interfaces.traderComboFollowerModel.Record | null> => {
  const record = await databaseAdapter.findOne({
    tableName: TableName,
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
    tableName: TableName,
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
  const record = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return record
}

export const createIfEmpty = async (
  values: interfaces.traderComboFollowerModel.Create,
  transaction: Knex.Transaction,
): Promise<{
  record: interfaces.traderComboFollowerModel.Record;
  isNew: boolean;
}> => {
  const currentRecord = await getByUK(values.userId, values.traderComboId)
  if (currentRecord) {
    return {
      record: currentRecord,
      isNew: false,
    }
  }
  const created = await create(values, transaction)
  return {
    record: created,
    isNew: true,
  }
}

export const destroy = async (
  userId: number,
  traderComboId: number,
  transaction: Knex.Transaction,
) => {
  await databaseAdapter.destroy({
    tableName: TableName,
    conditions: [
      { key: 'userId', value: userId },
      { key: 'traderComboId', value: traderComboId },
    ],
    transaction,
  })
  return true
}
