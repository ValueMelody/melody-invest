
import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as interfaces from '@shared/interfaces'
import { Knex } from 'knex'

const TableName = adapterEnum.DatabaseTable.IndicatorMonthly

const convertToRecord = (
  raw: interfaces.indicatorMonthlyModel.Raw,
): interfaces.indicatorMonthlyModel.Record => {
  const record: any = raw
  record.fundsRate = raw.fundsRate ? parseFloat(raw.fundsRate) : null
  record.cpi = raw.cpi ? parseFloat(raw.cpi) : null
  record.tenYearsTreasury = raw.tenYearsTreasury ? parseFloat(raw.tenYearsTreasury) : null
  record.thirtyYearsTreasury = raw.thirtyYearsTreasury ? parseFloat(raw.thirtyYearsTreasury) : null
  record.inflation = raw.inflation ? parseFloat(raw.inflation) : null
  record.consumerSentiment = raw.consumerSentiment ? parseFloat(raw.consumerSentiment) : null
  record.unemploymentRate = raw.unemploymentRate ? parseFloat(raw.unemploymentRate) : null
  record.nonfarmPayroll = raw.nonfarmPayroll ? parseInt(raw.nonfarmPayroll) : null
  return record
}

export const getByUK = async (
  month: string,
): Promise<interfaces.indicatorMonthlyModel.Record | null> => {
  const monthly = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'month', value: month },
    ],
  })
  return monthly ? convertToRecord(monthly) : null
}

export const getAll = async (): Promise<
  interfaces.indicatorMonthlyModel.Record[]
> => {
  const monthly = await databaseAdapter.findAll({
    tableName: TableName,
    orderBy: [{ column: 'month', order: 'asc' }],
  })
  return monthly.map((raw) => convertToRecord(raw))
}

export const getPublishedByDate = async (
  date: string,
): Promise<interfaces.indicatorMonthlyModel.Record | null> => {
  const estimatedDate = dateTool.getPreviousDate(date, 15)
  const month = estimatedDate.substring(0, 7)

  const raw = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'month', value: month },
    ],
  })
  return raw ? convertToRecord(raw) : null
}

export const create = async (
  values: interfaces.indicatorMonthlyModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.indicatorMonthlyModel.Record> => {
  const newRecord = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return convertToRecord(newRecord)
}

export const update = async (
  indicatorMonthlyId: number,
  values: interfaces.indicatorMonthlyModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.indicatorMonthlyModel.Record> => {
  const updated = await databaseAdapter.update({
    tableName: TableName,
    values,
    conditions: [
      { key: 'id', value: indicatorMonthlyId },
    ],
    transaction,
  })
  return convertToRecord(updated[0])
}
