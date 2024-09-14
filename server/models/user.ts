import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as interfaces from '@shared/interfaces'
import { Knex } from 'knex'
import * as constants from '@shared/constants'

const TableName = adapterEnum.DatabaseTable.User

const convertToRecord = (
  raw: interfaces.userModel.Record,
): interfaces.userModel.Record => {
  const record: any = raw
  record.type = constants.User.Type.Premium
  return record
}

export const getByActivationCode = async (
  code: string,
): Promise<interfaces.userModel.Record | null> => {
  const user = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'activationCode', value: code },
    ],
  })
  return user ? convertToRecord(user) : null
}

export const getByPK = async (
  id: number,
): Promise<interfaces.userModel.Record | null> => {
  const user = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'id', value: id },
    ],
  })
  return user ? convertToRecord(user) : null
}

export const getByUK = async (
  email: string,
): Promise<interfaces.userModel.Record | null> => {
  const user = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'email', value: email },
    ],
  })
  return user ? convertToRecord(user) : null
}

export const create = async (
  values: interfaces.userModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.userModel.Record> => {
  const createdUser = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return convertToRecord(createdUser)
}

export const update = async (
  userId: number,
  values: interfaces.userModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.userModel.Record> => {
  const updatedUser = await databaseAdapter.update({
    tableName: TableName,
    values,
    conditions: [
      { key: 'id', value: userId },
    ],
    transaction,
  })
  return convertToRecord(updatedUser[0])
}
