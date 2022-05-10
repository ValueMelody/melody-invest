import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as adapterEnum from '../enums/adapter'
import * as databaseAdapter from '../adapters/database'
import * as dateTool from '../tools/date'

const TableName = adapterEnum.DatabaseTable.TickerQuarterly

const convertToRecord = (
  raw: interfaces.tickerQuarterlyModel.Raw,
): interfaces.tickerQuarterlyModel.Record => ({
  ...raw,
  eps: raw.eps ? parseFloat(raw.eps) : null,
  estimatedEPS: raw.estimatedEPS ? parseFloat(raw.estimatedEPS) : null,
  epsSurprisePercent: raw.epsSurprisePercent ? parseFloat(raw.epsSurprisePercent) : null,
  ebitda: raw.ebitda ? parseInt(raw.ebitda) : null,
  netIncome: raw.netIncome ? parseInt(raw.netIncome) : null,
  grossProfit: raw.grossProfit ? parseInt(raw.grossProfit) : null,
  totalRevenue: raw.totalRevenue ? parseInt(raw.totalRevenue) : null,
  costOfRevenue: raw.costOfRevenue ? parseInt(raw.costOfRevenue) : null,
})

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
): Promise<interfaces.tickerQuarterlyModel.Record[]> => {
  const currentQuarter = dateTool.getQuarterByDate(date)
  const previousQuarter = dateTool.getPreviousQuarter(currentQuarter)

  const records = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'earningReportDate', value: date, type: '<' },
      { key: 'quarter', value: previousQuarter, type: '>=' },
      { key: 'quarter', value: currentQuarter, type: '<=' },
    ],
    orderBy: [{ column: 'quarter', order: 'desc' }],
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
