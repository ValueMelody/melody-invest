
import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as interfaces from '@shared/interfaces'
import { Knex } from 'knex'

const TableName = adapterEnum.DatabaseTable.IndicatorQuarterly

const convertToRecord = (
  raw: interfaces.indicatorQuarterlyModel.Raw,
): interfaces.indicatorQuarterlyModel.Record => ({
  ...raw,
  realGDP: raw.realGDP ? parseFloat(raw.realGDP) : null,
  gdpQuarterlyChangePercent: raw.gdpQuarterlyChangePercent ? parseFloat(raw.gdpQuarterlyChangePercent) : null,
  gdpQuarterlyYoYChangePercent: raw.gdpQuarterlyYoYChangePercent ? parseFloat(raw.gdpQuarterlyYoYChangePercent) : null,
})

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
  const targetDate = dateTool.getPreviousDate(date, 30)
  const quarter = dateTool.getQuarterByDate(targetDate)
  const previousQuarter = dateTool.getPreviousQuarter(quarter)

  const raw = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'quarter', value: previousQuarter },
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
