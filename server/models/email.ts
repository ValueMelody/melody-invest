import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as adapterEnum from '../enums/adapter'
import * as databaseAdapter from '../adapters/database'

const TableName = adapterEnum.DatabaseTable.Email

export const create = async (
  values: interfaces.emailModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.emailModel.Record> => {
  const createdEmail = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return createdEmail
}
