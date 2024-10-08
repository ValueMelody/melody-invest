import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as interfaces from '@shared/interfaces'
import { Knex } from 'knex'

const TableName = adapterEnum.DatabaseTable.TickerYearly

const convertToRecord = (
  raw: interfaces.tickerYearlyModel.Raw,
): interfaces.tickerYearlyModel.Record => {
  const record: any = raw
  record.eps = raw.eps ? parseFloat(raw.eps) : null
  record.ebitda = raw.ebitda ? parseInt(raw.ebitda) : null
  record.netIncome = raw.netIncome ? parseInt(raw.netIncome) : null
  record.grossProfit = raw.grossProfit ? parseInt(raw.grossProfit) : null
  record.totalRevenue = raw.totalRevenue ? parseInt(raw.totalRevenue) : null
  record.costOfRevenue = raw.costOfRevenue ? parseInt(raw.costOfRevenue) : null
  record.totalLiabilities = raw.totalLiabilities ? parseInt(raw.totalLiabilities) : null
  record.bookValue = raw.bookValue ? parseInt(raw.bookValue) : null
  record.totalAssets = raw.totalAssets ? parseInt(raw.totalAssets) : null
  record.equity = raw.equity ? parseInt(raw.equity) : null
  record.outstandingShares = raw.outstandingShares ? parseInt(raw.outstandingShares) : null
  record.freeCashFlow = raw.freeCashFlow ? parseInt(raw.freeCashFlow) : null
  return record
}

export const getLatest = async (
  tickerId: number,
  conditions?: databaseAdapter.Condition[],
): Promise<interfaces.tickerYearlyModel.Record | null> => {
  const pkCondition = [{ key: 'tickerId', value: tickerId }]
  const whereConditions = conditions
    ? [...pkCondition, ...conditions]
    : pkCondition
  const tickerYearly = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: whereConditions,
    orderBy: [{ column: 'year', order: 'desc' }],
  })
  return tickerYearly ? convertToRecord(tickerYearly) : null
}

export const getRawByUK = async (
  tickerId: number,
  year: string,
): Promise<interfaces.tickerYearlyModel.Raw | null> => {
  const tickerYearly = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'tickerId', value: tickerId },
      { key: 'year', value: year },
    ],
  })
  return tickerYearly || null
}

export const getByUK = async (
  tickerId: number,
  year: string,
): Promise<interfaces.tickerYearlyModel.Record | null> => {
  const tickerYearly = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'tickerId', value: tickerId },
      { key: 'year', value: year },
    ],
  })
  return tickerYearly ? convertToRecord(tickerYearly) : null
}

export const getAll = async (
  tickerId: number,
): Promise<interfaces.tickerYearlyModel.Record[]> => {
  const records = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'tickerId', value: tickerId },
    ],
    orderBy: [{ column: 'year', order: 'asc' }],
  })
  return records.map((record) => convertToRecord(record))
}

export const getPublishedByDate = async (
  date: string,
  tickerIds: number[],
): Promise<interfaces.tickerYearlyModel.Record[]> => {
  const targetDate = dateTool.getPreviousDate(date, 480)
  const startDate = dateTool.getPreviousDate(date, 840)

  const records = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'earningDate', value: targetDate, type: '<' },
      { key: 'earningDate', value: startDate, type: '>=' },
      { key: 'tickerId', value: tickerIds, type: 'IN' },
    ],
    orderBy: [
      { column: 'earningDate', order: 'desc' },
    ],
  })
  return records.map((raw) => convertToRecord(raw))
}

export const create = async (
  values: interfaces.tickerYearlyModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.tickerYearlyModel.Record> => {
  const newRecord = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return convertToRecord(newRecord)
}

export const update = async (
  tickerYearlyId: number,
  values: interfaces.tickerYearlyModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.tickerYearlyModel.Record> => {
  const updatedYearly = await databaseAdapter.update({
    tableName: TableName,
    values,
    conditions: [
      { key: 'id', value: tickerYearlyId },
    ],
    transaction,
  })
  return convertToRecord(updatedYearly[0])
}
