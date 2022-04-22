import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as adapterEnum from '../enums/adapter'
import * as databaseAdapter from '../adapters/database'
import * as generateTool from '../tools/generate'

const TableName = adapterEnum.DatabaseTable.Trader

const convertToRecord = (
  raw: interfaces.traderModel.Raw,
): interfaces.traderModel.Record => ({
  ...raw,
  totalValue: raw.totalValue ? parseInt(raw.totalValue) : null,
  oneYearTrends: raw.oneYearTrends?.split(',').map((val) => parseInt(val)) || null,
  oneDecadeTrends: raw.oneDecadeTrends?.split(',').map((val) => parseInt(val)) || null,
})

export const getByPK = async (
  id: number,
): Promise<interfaces.traderModel.Record | null> => {
  const pattern = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'id', value: id },
    ],
  })
  return pattern
}

export const getByUK = async (
  envId: number,
  patternId: number,
): Promise<interfaces.traderModel.Record | null> => {
  const trader = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'traderEnvId', value: envId },
      { key: 'traderPatternId', value: patternId },
    ],
  })
  return trader ? convertToRecord(trader) : null
}

export const getActives = async (): Promise<interfaces.traderModel.Record[]> => {
  const traders = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'isActive', value: true },
    ],
  })
  return traders.map((trader) => convertToRecord(trader))
}

export const getByPattern = async (
  traderPatternId: number,
): Promise<interfaces.traderModel.Record[]> => {
  const traders = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'traderPatternId', value: traderPatternId },
    ],
  })
  return traders.map((trader) => convertToRecord(trader))
}

export const getAll = async (): Promise<interfaces.traderModel.Record[]> => {
  const traders = await databaseAdapter.findAll({
    tableName: TableName,
  })
  return traders.map((trader) => convertToRecord(trader))
}

export const getInPKs = async (
  ids: number[],
): Promise<interfaces.traderModel.Record[]> => {
  const traders = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'id', value: ids, type: 'IN' },
    ],
  })
  return traders.map((trader) => convertToRecord(trader))
}

interface TopOptions {
  envId?: number;
  behavior?: interfaces.traderPatternModel.Behavior;
  tickerId?: number;
}

export const getTopPerformancers = async (
  envId: number,
  total: number,
  type: 'yearlyPercentNumber',
): Promise<interfaces.traderModel.Record[]> => {
  const records = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'traderEnvId', value: envId },
      { key: type, value: null, type: 'IS NOT' },
    ],
    orderBy: [{ column: type, order: 'desc' }],
    limit: total,
  })
  return records.map((record) => convertToRecord(record))
}

export const getTops = async (
  each: number,
  options?: TopOptions,
): Promise<interfaces.traderModel.Tops> => {
  const conditions: databaseAdapter.Condition[] = [{ key: 'isActive', value: true }]
  let join

  if (options?.envId) conditions.push({ key: 'traderEnvId', value: options.envId })

  if (options?.behavior) {
    conditions.push({
      key: `${adapterEnum.DatabaseTable.TraderPattern}.${options.behavior}`, value: null, type: 'IS NOT',
    })
    join = {
      joinTable: adapterEnum.DatabaseTable.TraderPattern,
      foreignKey: `${TableName}.traderPatternId`,
      joinKey: `${adapterEnum.DatabaseTable.TraderPattern}.id`,
    }
  }

  if (options?.tickerId) {
    conditions.push({
      key: `${adapterEnum.DatabaseTable.TickerHolder}.tickerId`, value: options.tickerId,
    })
    join = {
      joinTable: adapterEnum.DatabaseTable.TickerHolder,
      foreignKey: `${TableName}.id`,
      joinKey: `${adapterEnum.DatabaseTable.TickerHolder}.traderId`,
    }
  }

  const topYearly = await databaseAdapter.findAll({
    tableName: TableName,
    select: [`${TableName}.*`],
    conditions: [
      ...conditions,
      { key: 'yearlyPercentNumber', value: null, type: 'IS NOT' },
    ],
    orderBy: [{ column: 'yearlyPercentNumber', order: 'desc' }],
    limit: each,
    join,
  })

  const topPastYear = await databaseAdapter.findAll({
    tableName: TableName,
    select: [`${TableName}.*`],
    conditions: [
      ...conditions,
      { key: 'pastYearPercentNumber', value: null, type: 'IS NOT' },
    ],
    orderBy: [{ column: 'pastYearPercentNumber', order: 'desc' }],
    limit: each,
    join,
  })

  const topPastQuarter = await databaseAdapter.findAll({
    tableName: TableName,
    select: [`${TableName}.*`],
    conditions: [
      ...conditions,
      { key: 'pastQuarterPercentNumber', value: null, type: 'IS NOT' },
    ],
    orderBy: [{ column: 'pastQuarterPercentNumber', order: 'desc' }],
    limit: each,
    join,
  })

  const topPastMonth = await databaseAdapter.findAll({
    tableName: TableName,
    select: [`${TableName}.*`],
    conditions: [
      ...conditions,
      { key: 'pastMonthPercentNumber', value: null, type: 'IS NOT' },
    ],
    orderBy: [{ column: 'pastMonthPercentNumber', order: 'desc' }],
    limit: each,
    join,
  })

  const topPastWeek = await databaseAdapter.findAll({
    tableName: TableName,
    select: [`${TableName}.*`],
    conditions: [
      ...conditions,
      { key: 'pastWeekPercentNumber', value: null, type: 'IS NOT' },
    ],
    orderBy: [{ column: 'pastWeekPercentNumber', order: 'desc' }],
    limit: each,
    join,
  })

  return {
    yearly: topYearly.map((trader) => convertToRecord(trader)),
    pastYear: topPastYear.map((trader) => convertToRecord(trader)),
    pastQuarter: topPastQuarter.map((trader) => convertToRecord(trader)),
    pastMonth: topPastMonth.map((trader) => convertToRecord(trader)),
    pastWeek: topPastWeek.map((trader) => convertToRecord(trader)),
  }
}

export const create = async (
  values: interfaces.traderModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.traderModel.Record> => {
  const newRecord = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return convertToRecord(newRecord)
}

export const createOrActive = async (
  traderEnvId: number, traderPatternId: number, transaction: Knex.Transaction,
): Promise<interfaces.traderModel.Record> => {
  const currentRecord = await getByUK(traderEnvId, traderPatternId)
  const accessCode = generateTool.buildAccessHash(16)
  if (!currentRecord) return create({ traderEnvId, traderPatternId, isActive: true, accessCode }, transaction)
  if (currentRecord.isActive) return currentRecord
  return update(currentRecord.id, { isActive: true }, transaction)
}

export const update = async (
  traderId: number,
  values: interfaces.traderModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.traderModel.Record> => {
  const updatedTraders = await databaseAdapter.update({
    tableName: TableName,
    values,
    conditions: [
      { key: 'id', value: traderId },
    ],
    transaction,
  })
  return convertToRecord(updatedTraders[0])
}
