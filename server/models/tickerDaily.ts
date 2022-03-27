import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'
import * as dateTool from '../tools/date'

const convertToRecord = (
  raw: interfaces.tickerDailyModel.Raw,
): interfaces.tickerDailyModel.Record => ({
  ...raw,
  dividendAmount: parseFloat(raw.dividendAmount),
  splitMultiplier: parseFloat(raw.splitMultiplier),
})

export const getByUK = async (
  tickerId: number,
  date: string,
): Promise<interfaces.tickerDailyModel.Record | null> => {
  const tickerDaily = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.TICKER_DAILY,
    conditions: [
      { key: 'tickerId', value: tickerId },
      { key: 'date', value: date },
    ],
  })
  return tickerDaily ? convertToRecord(tickerDaily) : null
}

export const getPreviousOne = async (
  tickerId: number,
  date: string,
): Promise<interfaces.tickerDailyModel.Record | null> => {
  const tickerDaily = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.TICKER_DAILY,
    conditions: [
      { key: 'tickerId', value: tickerId },
      { key: 'date', type: '<', value: date },
    ],
    orderBy: [{ column: 'date', order: 'desc' }],
  })
  return tickerDaily ? convertToRecord(tickerDaily) : null
}

export const getLatestDate = async (): Promise<string> => {
  const tickerDaily = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.TICKER_DAILY,
    orderBy: [{ column: 'date', order: 'desc' }],
  })
  return tickerDaily ? tickerDaily.date : dateTool.getInitialDate()
}

export const getAll = async (
  tickerId: number,
): Promise<interfaces.tickerDailyModel.Record[]> => {
  const tickerDaily = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TICKER_DAILY,
    conditions: [
      { key: 'tickerId', value: tickerId },
    ],
    orderBy: [{ column: 'date', order: 'asc' }],
  })
  return tickerDaily.map((daily) => convertToRecord(daily))
}

export const getAllLatestByDate = async (
  date: string,
): Promise<interfaces.tickerDailyModel.Record[]> => {
  const latestTickerDailys = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TICKER_DAILY,
    orderBy: [{ column: 'tickerId', order: 'asc' }, { column: 'date', order: 'desc' }],
    groupBy: [
      `${tableEnum.NAME.TICKER_DAILY}.id`,
      `${tableEnum.NAME.TICKER_DAILY}.tickerId`,
    ],
    conditions: [
      { key: 'date', value: date, type: '<=' },
    ],
    distinctOn: 'tickerId',
  })
  return latestTickerDailys.map((daily) => convertToRecord(daily))
}

export const getByDate = async (
  date: string,
  tickerIds: number[] | null,
): Promise<interfaces.tickerDailyModel.Record[]> => {
  const conditions: databaseAdapter.Condition[] = [{ key: 'date', value: date }]
  if (tickerIds) conditions.push({ key: 'tickerId', value: tickerIds, type: 'IN' })
  const tickerDaily = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TICKER_DAILY,
    conditions,
  })
  return tickerDaily.map((daily) => convertToRecord(daily))
}

export const create = async (
  values: interfaces.tickerDailyModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.tickerDailyModel.Record> => {
  const newRecord = await databaseAdapter.create({
    tableName: tableEnum.NAME.TICKER_DAILY,
    values,
    transaction,
  })
  return convertToRecord(newRecord)
}

export const update = async (
  tickerDailyId: number,
  values: interfaces.tickerDailyModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.tickerDailyModel.Record> => {
  const updatedDaily = await databaseAdapter.update({
    tableName: tableEnum.NAME.TICKER_DAILY,
    values,
    conditions: [
      { key: 'id', value: tickerDailyId },
    ],
    transaction,
  })
  return convertToRecord(updatedDaily[0])
}
