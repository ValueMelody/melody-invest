import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as adapterEnum from '../enums/adapter'
import * as databaseAdapter from '../adapters/database'
import * as cacheAdapter from '../adapters/cache'
import * as cacheTool from '../tools/cache'
import * as dateTool from '../tools/date'

const TableName = adapterEnum.DatabaseTable.TickerDaily

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
    tableName: TableName,
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
    tableName: TableName,
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
    tableName: TableName,
    orderBy: [{ column: 'date', order: 'desc' }],
  })
  return tickerDaily ? tickerDaily.date : dateTool.getInitialDate()
}

export const getAll = async (
  tickerId: number,
): Promise<interfaces.tickerDailyModel.Record[]> => {
  const tickerDaily = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'tickerId', value: tickerId },
    ],
    orderBy: [{ column: 'date', order: 'asc' }],
  })
  return tickerDaily.map((daily) => convertToRecord(daily))
}

export const getNearestPricesByDate = async (
  date: string,
): Promise<interfaces.tickerDailyModel.TickerPrices> => {
  const cacheKey = cacheTool.generateTickerPricesKey(date)
  const cached = await cacheAdapter.get(cacheKey)
  if (cached) return JSON.parse(cached)

  const latestTickerDailys: interfaces.tickerDailyModel.Raw[] = await databaseAdapter.findAll({
    tableName: TableName,
    select: ['tickerId', 'closePrice', 'splitMultiplier'],
    orderBy: [
      { column: 'tickerId', order: 'asc' },
      { column: 'date', order: 'desc' },
    ],
    conditions: [
      { key: 'date', value: date, type: '<=' },
    ],
    distinctOn: 'tickerId',
  })
  const initialPrices: interfaces.tickerDailyModel.TickerPrices = {}
  const tickerPrices = latestTickerDailys.reduce((prices, raw) => {
    const price = parseFloat(raw.splitMultiplier) * raw.closePrice
    return {
      ...prices,
      [raw.tickerId]: price,
    }
  }, initialPrices)
  await cacheAdapter.set(cacheKey, JSON.stringify(tickerPrices), '1d')
  return tickerPrices
}

export const getByDate = async (
  date: string,
): Promise<interfaces.tickerDailyModel.Record[]> => {
  const tickerDaily = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [{ key: 'date', value: date }],
  })
  return tickerDaily.map((daily) => convertToRecord(daily))
}

export const create = async (
  values: interfaces.tickerDailyModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.tickerDailyModel.Record> => {
  const newRecord = await databaseAdapter.create({
    tableName: TableName,
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
    tableName: TableName,
    values,
    conditions: [
      { key: 'id', value: tickerDailyId },
    ],
    transaction,
  })
  return convertToRecord(updatedDaily[0])
}
