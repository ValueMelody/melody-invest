import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'
import * as dateTool from '../tools/date'

export const getLatestDate = async (): Promise<string> => {
  const record = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.DAILY_TICKERS,
    orderBy: [{ column: 'date', order: 'desc' }],
  })
  return record ? record.date : dateTool.getInitialDate()
}

export const getByUK = async (
  date: string,
): Promise<interfaces.dailyTickersModel.Record | null> => {
  const record = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.DAILY_TICKERS,
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
    tableName: tableEnum.NAME.DAILY_TICKERS,
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
    tableName: tableEnum.NAME.DAILY_TICKERS,
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
