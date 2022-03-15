import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export const getByUK = async (
  email: string,
): Promise<interfaces.userModel.Record | null> => {
  const user = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.USER,
    conditions: [
      { key: 'email', value: email },
    ],
  })
  return user
}

export const create = async (
  values: interfaces.userModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.userModel.Record> => {
  const createdUser = await databaseAdapter.create({
    tableName: tableEnum.NAMES.USER,
    values,
    transaction,
  })
  return createdUser[0]
}

export const update = async (
  userId: number,
  values: interfaces.userModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.userModel.Record> => {
  const updatedUser = await databaseAdapter.update({
    tableName: tableEnum.NAMES.USER,
    values,
    conditions: [
      { key: 'id', value: userId },
    ],
    transaction,
  })
  return updatedUser[0]
}
