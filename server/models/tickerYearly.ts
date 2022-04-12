import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'
import * as dateTool from '../tools/date'

const convertToRecord = (
  raw: interfaces.tickerYearlyModel.Raw,
): interfaces.tickerYearlyModel.Record => ({
  ...raw,
  eps: raw.eps ? parseFloat(raw.eps) : null,
  ebitda: raw.ebitda ? parseInt(raw.ebitda) : null,
  netIncome: raw.netIncome ? parseInt(raw.netIncome) : null,
  grossProfit: raw.grossProfit ? parseInt(raw.grossProfit) : null,
  totalRevenue: raw.totalRevenue ? parseInt(raw.totalRevenue) : null,
  costOfRevenue: raw.costOfRevenue ? parseInt(raw.costOfRevenue) : null,
})

export const getLatest = async (
  tickerId: number,
  conditions?: databaseAdapter.Condition[],
): Promise<interfaces.tickerYearlyModel.Record | null> => {
  const pkCondition = [{ key: 'tickerId', value: tickerId }]
  const whereConditions = conditions
    ? [...pkCondition, ...conditions]
    : pkCondition
  const tickerYearly = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.TICKER_YEARLY,
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
    tableName: tableEnum.NAME.TICKER_YEARLY,
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
    tableName: tableEnum.NAME.TICKER_YEARLY,
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
    tableName: tableEnum.NAME.TICKER_YEARLY,
    conditions: [
      { key: 'tickerId', value: tickerId },
    ],
    orderBy: [{ column: 'year', order: 'asc' }],
  })
  return records.map((record) => convertToRecord(record))
}

export const getPublishedByDate = async (
  date: string,
): Promise<interfaces.tickerYearlyModel.Record[]> => {
  const currentQuarter = dateTool.getQuarterByDate(date)
  const [year, quarter] = currentQuarter.split('-')

  const previousYear = dateTool.getPreviousYear(year)
  const yearBeforePrevious = dateTool.getPreviousYear(previousYear)
  const targetYear = quarter === '03' ? yearBeforePrevious : previousYear

  const records = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TICKER_YEARLY,
    conditions: [
      { key: 'year', value: targetYear },
    ],
    orderBy: [{ column: 'year', order: 'desc' }],
  })
  return records.map((raw) => convertToRecord(raw))
}

export const create = async (
  values: interfaces.tickerYearlyModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.tickerYearlyModel.Record> => {
  const newRecord = await databaseAdapter.create({
    tableName: tableEnum.NAME.TICKER_YEARLY,
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
    tableName: tableEnum.NAME.TICKER_YEARLY,
    values,
    conditions: [
      { key: 'id', value: tickerYearlyId },
    ],
    transaction,
  })
  return convertToRecord(updatedYearly[0])
}
