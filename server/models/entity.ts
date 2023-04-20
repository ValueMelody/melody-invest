import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as interfaces from '@shared/interfaces'
import { Knex } from 'knex'

const TableName = adapterEnum.DatabaseTable.Entity

export const getAll = async (): Promise<interfaces.entityModel.Record[]> => {
  const entities = await databaseAdapter.findAll({
    tableName: TableName,
  })
  return entities
}

export const getByPK = async (
  id: number,
): Promise<interfaces.entityModel.Record | null> => {
  const entity = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'id', value: id },
    ],
  })
  return entity
}

export const create = async (
  values: interfaces.entityModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.entityModel.Record> => {
  const created = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return created
}