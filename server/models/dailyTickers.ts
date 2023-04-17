
import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as interfaces from '@shared/interfaces'
import { Knex } from 'knex'

const TableName = adapterEnum.DatabaseTable.DailyTickers

export const getLatestDate = async (): Promise<string> => {
  const record = await databaseAdapter.findOne({
    tableName: TableName,
    orderBy: [{ column: 'date', order: 'desc' }],
    select: ['date'],
  })
  return record ? record.date : dateTool.getInitialDate()
}

export const getByUK = async (
  entityId: number,
  date: string,
  select?: ('tickers' | 'indicators' | 'nearestPrices')[],
): Promise<interfaces.dailyTickersModel.Record | null> => {
  const record = await databaseAdapter.findOne({
    select,
    tableName: TableName,
    conditions: [
      { key: 'entityId', value: entityId },
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
  entityId: number,
  date: string,
  values: interfaces.dailyTickersModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.dailyTickersModel.Record> => {
  const record = await getByUK(entityId, date)
  const newRecord = record
    ? await update(record.id, values, transaction)
    : await create({ ...values, entityId, date }, transaction)
  return newRecord
}

export const destroyAll = async (
  transaction: Knex.Transaction,
) => {
  await databaseAdapter.destroy({
    tableName: TableName,
    transaction,
  })
  return true
}
