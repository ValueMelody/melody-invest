import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as adapterEnum from '../enums/adapter'
import * as databaseAdapter from '../adapters/database'

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
