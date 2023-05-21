
import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as interfaces from '@shared/interfaces'
import { Knex } from 'knex'

const TableName = adapterEnum.DatabaseTable.IndicatorYearly

const convertToRecord = (
  raw: interfaces.indicatorYearlyModel.Raw,
): interfaces.indicatorYearlyModel.Record => {
  const record: any = raw
  record.gdp = raw.gdp ? parseFloat(raw.gdp) : null
  record.inflation = raw.inflation ? parseFloat(raw.inflation) : null
  record.gdpYearlyChangePercent = raw.gdpYearlyChangePercent ? parseFloat(raw.gdpYearlyChangePercent) : null
  return record
}

export const getByUK = async (
  year: string,
): Promise<interfaces.indicatorYearlyModel.Record | null> => {
  const yearly = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'year', value: year },
    ],
  })
  return yearly ? convertToRecord(yearly) : null
}

export const getAll = async (): Promise<
  interfaces.indicatorYearlyModel.Record[]
> => {
  const yearly = await databaseAdapter.findAll({
    tableName: TableName,
    orderBy: [{ column: 'year', order: 'asc' }],
  })
  return yearly.map((raw) => convertToRecord(raw))
}

export const getPublishedByDate = async (date: string) => {
  const currentQuarter = dateTool.getQuarterByDate(date)
  const [year, quarter] = currentQuarter.split('-')

  const previousYear = dateTool.getPreviousYear(year)
  const yearBeforePrevious = dateTool.getPreviousYear(previousYear)
  const targetYear = quarter === '03' ? yearBeforePrevious : previousYear

  const raw = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'year', value: targetYear },
    ],
  })
  return raw ? convertToRecord(raw) : null
}

export const create = async (
  values: interfaces.indicatorYearlyModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.indicatorYearlyModel.Record> => {
  const newRecord = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return convertToRecord(newRecord)
}

export const update = async (
  indicatorYearlyId: number,
  values: interfaces.indicatorYearlyModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.indicatorYearlyModel.Record> => {
  const updated = await databaseAdapter.update({
    tableName: TableName,
    values,
    conditions: [
      { key: 'id', value: indicatorYearlyId },
    ],
    transaction,
  })
  return convertToRecord(updated[0])
}
