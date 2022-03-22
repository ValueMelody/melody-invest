import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'
import * as dateTool from '../tools/date'

const convertToRecord = (
  raw: interfaces.indicatorMonthlyModel.Raw,
): interfaces.indicatorMonthlyModel.Record => ({
  ...raw,
  fundsRate: raw.fundsRate ? parseFloat(raw.fundsRate) : null,
  cpi: raw.cpi ? parseFloat(raw.cpi) : null,
  tenYearsTreasury: raw.tenYearsTreasury ? parseFloat(raw.tenYearsTreasury) : null,
  thirtyYearsTreasury: raw.thirtyYearsTreasury ? parseFloat(raw.thirtyYearsTreasury) : null,
  inflationExpectation: raw.inflationExpectation ? parseFloat(raw.inflationExpectation) : null,
  consumerSentiment: raw.consumerSentiment ? parseFloat(raw.consumerSentiment) : null,
  retailSales: raw.retailSales ? parseInt(raw.retailSales) : null,
  durableGoods: raw.durableGoods ? parseInt(raw.durableGoods) : null,
  unemploymentRate: raw.unemploymentRate ? parseFloat(raw.unemploymentRate) : null,
  nonfarmPayroll: raw.nonfarmPayroll ? parseInt(raw.nonfarmPayroll) : null,
})

export const getByUK = async (
  month: string,
): Promise<interfaces.indicatorMonthlyModel.Record | null> => {
  const monthly = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.INDICATOR_MONTHLY,
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
    tableName: tableEnum.NAME.INDICATOR_MONTHLY,
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
    tableName: tableEnum.NAME.INDICATOR_MONTHLY,
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
    tableName: tableEnum.NAME.INDICATOR_MONTHLY,
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
    tableName: tableEnum.NAME.INDICATOR_MONTHLY,
    values,
    conditions: [
      { key: 'id', value: indicatorMonthlyId },
    ],
    transaction,
  })
  return convertToRecord(updated[0])
}
