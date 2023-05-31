import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as interfaces from '@shared/interfaces'
import { Knex } from 'knex'

const TableName = adapterEnum.DatabaseTable.DailyIndicators

export const getByUK = async (
  date: string,
): Promise<interfaces.dailyIndicatorsModel.Record | null> => {
  const record = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'date', value: date },
    ],
  })
  return record
}

export const create = async (
  values: interfaces.dailyIndicatorsModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.dailyIndicatorsModel.Record> => {
  const newRecord = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return newRecord
}

export const update = async (
  id: number,
  values: interfaces.dailyIndicatorsModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.dailyIndicatorsModel.Record> => {
  const updated = await databaseAdapter.update({
    tableName: TableName,
    values,
    conditions: [
      { key: 'id', value: id },
    ],
    transaction,
  })
  return updated[0]
}

export const upsert = async (
  date: string,
  values: interfaces.dailyIndicatorsModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.dailyIndicatorsModel.Record> => {
  const record = await getByUK(date)
  const newRecord = record
    ? await update(record.id, values, transaction)
    : await create({ ...values, date }, transaction)
  return newRecord
}
