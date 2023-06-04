
import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as interfaces from '@shared/interfaces'
import { Knex } from 'knex'

const TableName = adapterEnum.DatabaseTable.TickerQuarterly

const convertToRecord = (
  raw: interfaces.tickerQuarterlyModel.Raw,
): interfaces.tickerQuarterlyModel.Record => {
  const record: any = raw
  record.eps = raw.eps ? parseFloat(raw.eps) : null
  record.ebitda = raw.ebitda ? parseInt(raw.ebitda) : null
  record.netIncome = raw.netIncome ? parseInt(raw.netIncome) : null
  record.bookValue = raw.bookValue ? parseInt(raw.bookValue) : null
  record.grossProfit = raw.grossProfit ? parseInt(raw.grossProfit) : null
  record.totalRevenue = raw.totalRevenue ? parseInt(raw.totalRevenue) : null
  record.costOfRevenue = raw.costOfRevenue ? parseInt(raw.costOfRevenue) : null
  record.equity = raw.equity ? parseInt(raw.equity) : null
  record.totalAssets = raw.totalAssets ? parseInt(raw.totalAssets) : null
  record.totalLiabilities = raw.totalLiabilities ? parseInt(raw.totalLiabilities) : null
  record.freeCashFlow = raw.freeCashFlow ? parseInt(raw.freeCashFlow) : null
  record.grossMargin = raw.grossMargin ? parseFloat(raw.grossMargin) : null
  record.debtEquity = raw.debtEquity ? parseFloat(raw.debtEquity) : null
  record.roa = raw.roa ? parseFloat(raw.roa) : null
  record.roe = raw.roe ? parseFloat(raw.roe) : null
  record.outstandingShares = raw.outstandingShares ? parseInt(raw.outstandingShares) : null
  record.epsQoQ = raw.epsQoQ ? parseFloat(raw.epsQoQ) : null
  record.revenueQoQ = raw.revenueQoQ ? parseFloat(raw.revenueQoQ) : null
  record.debtEquityQoQ = raw.debtEquityQoQ ? parseFloat(raw.debtEquityQoQ) : null
  record.grossMarginQoQ = raw.grossMarginQoQ ? parseFloat(raw.grossMarginQoQ) : null
  return record
}

export const getRawByUK = async (
  tickerId: number,
  quarter: string,
): Promise<interfaces.tickerQuarterlyModel.Raw | null> => {
  const tickerQuarterly = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'tickerId', value: tickerId },
      { key: 'quarter', value: quarter },
    ],
  })
  return tickerQuarterly || null
}

export const getByUK = async (
  tickerId: number,
  quarter: string,
): Promise<interfaces.tickerQuarterlyModel.Record | null> => {
  const tickerQuarterly = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'tickerId', value: tickerId },
      { key: 'quarter', value: quarter },
    ],
  })
  return tickerQuarterly ? convertToRecord(tickerQuarterly) : null
}

export const getLatest = async (
  tickerId: number,
  conditions?: databaseAdapter.Condition[],
): Promise<interfaces.tickerQuarterlyModel.Record | null> => {
  const pkCondition = [{ key: 'tickerId', value: tickerId }]
  const whereConditions = conditions
    ? [...pkCondition, ...conditions]
    : pkCondition
  const tickerQuarterly = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: whereConditions,
    orderBy: [{ column: 'quarter', order: 'desc' }],
  })
  return tickerQuarterly ? convertToRecord(tickerQuarterly) : null
}

export const getAll = async (
  tickerId: number,
): Promise<interfaces.tickerQuarterlyModel.Record[]> => {
  const records = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'tickerId', value: tickerId },
    ],
    orderBy: [{ column: 'quarter', order: 'asc' }],
  })
  return records.map((raw) => convertToRecord(raw))
}

export const getPublishedByDate = async (
  date: string,
  tickerIds: number[],
): Promise<interfaces.tickerQuarterlyModel.Record[]> => {
  const targetDate = dateTool.getPreviousDate(date, 150)
  const startDate = dateTool.getPreviousDate(date, 240)

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
  values: interfaces.tickerQuarterlyModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.tickerQuarterlyModel.Record> => {
  const newRecord = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return convertToRecord(newRecord)
}

export const update = async (
  tickerQuarterlyId: number,
  values: interfaces.tickerQuarterlyModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.tickerQuarterlyModel.Record> => {
  const updatedQuarterly = await databaseAdapter.update({
    tableName: TableName,
    values,
    conditions: [
      { key: 'id', value: tickerQuarterlyId },
    ],
    transaction,
  })
  return convertToRecord(updatedQuarterly[0])
}
