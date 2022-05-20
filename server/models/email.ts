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

export const update = async (
  emailId: string,
  values: interfaces.emailModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.emailModel.Record> => {
  const email = await databaseAdapter.update({
    tableName: TableName,
    values,
    conditions: [
      { key: 'id', value: emailId },
    ],
    transaction,
  })
  return email[0]
}

export const batchUpdate = async (
  values: interfaces.emailModel.Update,
  conditions: databaseAdapter.Condition[],
  limit: number,
  transaction: Knex.Transaction,
): Promise<interfaces.emailModel.Record[]> => {
  const updatedEmails = await databaseAdapter.update({
    tableName: TableName,
    values,
    conditions,
    transaction,
    limit,
    orderBy: [{ column: 'createdAt', order: 'asc' }],
  })
  return updatedEmails
}
