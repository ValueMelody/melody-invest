import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as interfaces from '@shared/interfaces'
import { Knex } from 'knex'

const TableName = adapterEnum.DatabaseTable.UserPayment

export const create = async (
  values: interfaces.userPaymentModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.userPaymentModel.Record> => {
  const created = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return created
}

export const getLatest = async (
  userId: number,
): Promise<interfaces.userPaymentModel.Record> => {
  const record = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'userId', value: userId },
    ],
    orderBy: [{ column: 'id', order: 'desc' }],
  })
  return record
}
