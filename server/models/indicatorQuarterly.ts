
import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as interfaces from '@shared/interfaces'
import { Knex } from 'knex'

const TableName = adapterEnum.DatabaseTable.IndicatorQuarterly

const convertToRecord = (
  raw: interfaces.indicatorQuarterlyModel.Raw,
): interfaces.indicatorQuarterlyModel.Record => {
  const record: any = raw
  record.seasonalGDP = raw.seasonalGDP ? parseFloat(raw.seasonalGDP) : null
  record.seasonalGDPQoQ = raw.seasonalGDPQoQ ? parseFloat(raw.seasonalGDPQoQ) : null
  record.seasonalGDPYoY = raw.seasonalGDPYoY
    ? parseFloat(raw.seasonalGDPYoY)
    : null
  return record
}

export const getByUK = async (
  quarter: string,
): Promise<interfaces.indicatorQuarterlyModel.Record | null> => {
  const quarterly = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'quarter', value: quarter },
    ],
  })
  return quarterly ? convertToRecord(quarterly) : null
}

export const getPublishedByDate = async (
  date: string,
): Promise<interfaces.indicatorQuarterlyModel.Record | null> => {
  const targetDate = dateTool.getPreviousDate(date, 150)
  const quarter = dateTool.getQuarterByDate(targetDate)

  const raw = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'quarter', value: quarter },
    ],
  })
  return raw ? convertToRecord(raw) : null
}

export const getAll = async (): Promise<
  interfaces.indicatorQuarterlyModel.Record[]
> => {
  const quarterly = await databaseAdapter.findAll({
    tableName: TableName,
    orderBy: [{ column: 'quarter', order: 'asc' }],
  })
  return quarterly.map((raw) => convertToRecord(raw))
}

export const create = async (
  values: interfaces.indicatorQuarterlyModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.indicatorQuarterlyModel.Record> => {
  const newRecord = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return convertToRecord(newRecord)
}

export const update = async (
  indicatorQuarterlyId: number,
  values: interfaces.indicatorQuarterlyModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.indicatorQuarterlyModel.Record> => {
  const updated = await databaseAdapter.update({
    tableName: TableName,
    values,
    conditions: [
      { key: 'id', value: indicatorQuarterlyId },
    ],
    transaction,
  })
  return convertToRecord(updated[0])
}
