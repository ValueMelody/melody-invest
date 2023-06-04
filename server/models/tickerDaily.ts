
import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as interfaces from '@shared/interfaces'
import { Knex } from 'knex'

const TableName = adapterEnum.DatabaseTable.TickerDaily

const convertToRecord = (
  raw: interfaces.tickerDailyModel.Raw,
): interfaces.tickerDailyModel.Record => {
  const record: any = raw
  record.splitMultiplier = parseFloat(raw.splitMultiplier)
  return record
}

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

export const getLatest = async (): Promise<interfaces.tickerDailyModel.Record | undefined> => {
  const record = await databaseAdapter.findOne({
    tableName: TableName,
    orderBy: [{ column: 'date', order: 'desc' }],
  })
  return record ? convertToRecord(record) : undefined
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

export const getPriceInfoByDate = async (
  date: string,
  tickerIds: number[],
): Promise<interfaces.dailyTickersModel.PriceInfo> => {
  const sevenDaysAgo = dateTool.getPreviousDate(date, 7)
  const latestTickerDailys: interfaces.tickerDailyModel.Raw[] = await databaseAdapter.findAll({
    tableName: TableName,
    select: ['tickerId', 'closePrice', 'splitMultiplier'],
    orderBy: [
      { column: 'date', order: 'desc' },
    ],
    conditions: [
      { key: 'tickerId', value: tickerIds, type: 'IN' },
      { key: 'date', value: date, type: '<=' },
      { key: 'date', value: sevenDaysAgo, type: '>=' },
    ],
  })
  const priceInfo = latestTickerDailys.reduce((prices, raw) => {
    if (prices[raw.tickerId]) return prices
    const price = parseFloat(raw.splitMultiplier) * raw.closePrice
    prices[raw.tickerId] = price
    return prices
  }, {} as interfaces.dailyTickersModel.PriceInfo)
  return priceInfo
}

export const getByDate = async (
  date: string,
  tickerIds: number[],
): Promise<interfaces.tickerDailyModel.Record[]> => {
  const tickerDaily = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'tickerId', value: tickerIds, type: 'IN' },
      { key: 'date', value: date },
    ],
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
