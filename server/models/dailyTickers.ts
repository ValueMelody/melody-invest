import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as adapterEnum from '../enums/adapter'
import * as databaseAdapter from '../adapters/database'
import * as dateTool from '../tools/date'

const TableName = adapterEnum.DatabaseTable.DailyTickers

export const getLatestDate = async (): Promise<string> => {
  const record = await databaseAdapter.findOne({
    tableName: TableName,
    orderBy: [{ column: 'date', order: 'desc' }],
  })
  return record ? record.date : dateTool.getInitialDate()
}

export const getByUK = async (
  date: string,
): Promise<interfaces.dailyTickersModel.Record | null> => {
  const record = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'date', value: date },
    ],
  })
  return record
}

export const create = async (
  values: interfaces.dailyTickersModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.dailyTickersModel.Record> => {
  const newRecord = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return newRecord
}

export const update = async (
  dailyTickersId: number,
  values: interfaces.dailyTickersModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.dailyTickersModel.Record> => {
  const updated = await databaseAdapter.update({
    tableName: TableName,
    values,
    conditions: [
      { key: 'id', value: dailyTickersId },
    ],
    transaction,
  })
  return updated[0]
}

export const upsert = async (
  date: string,
  values: interfaces.dailyTickersModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.dailyTickersModel.Record> => {
  const record = await getByUK(date)
  const newRecord = record
    ? await update(record.id, values, transaction)
    : await create({ ...values, date }, transaction)
  return newRecord
}
