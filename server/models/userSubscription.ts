import { Knex } from 'knex'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'

const TableName = adapterEnum.DatabaseTable.UserSubscription

export const getByUK = async (
  subscriptionId: string,
): Promise<interfaces.userSubscriptionModel.Record | null> => {
  const record = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'subscriptionId', value: subscriptionId },
    ],
  })
  return record
}

export const getUserLatest = async (
  userId: number,
): Promise<interfaces.userSubscriptionModel.Record | null> => {
  const record = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'userId', value: userId },
    ],
    orderBy: [{
      column: 'startAtUTC',
      order: 'desc',
    }],
  })
  return record
}

export const getUserActive = async (
  userId: number,
): Promise<interfaces.userSubscriptionModel.Record | null> => {
  const record = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'userId', value: userId },
      { key: 'status', value: constants.User.SubscriptionStatus.Active },
    ],
    orderBy: [{
      column: 'startAtUTC',
      order: 'desc',
    }],
  })
  return record
}

export const create = async (
  values: interfaces.userSubscriptionModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.userSubscriptionModel.Record> => {
  const created = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return created
}

export const update = async (
  id: number,
  values: interfaces.userSubscriptionModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.userSubscriptionModel.Record> => {
  const updatedUser = await databaseAdapter.update({
    tableName: TableName,
    values,
    conditions: [
      { key: 'id', value: id },
    ],
    transaction,
  })
  return updatedUser[0]
}
