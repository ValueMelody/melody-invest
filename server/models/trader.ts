import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'
import * as generateTool from '../tools/generate'

const convertToRecord = (
  raw: interfaces.traderModel.Raw,
): interfaces.traderModel.Record => ({
  ...raw,
  totalValue: raw.totalValue ? parseInt(raw.totalValue) : null,
})

export const getByPK = async (
  id: number,
): Promise<interfaces.traderModel.Record | null> => {
  const pattern = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.TRADER,
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
    tableName: tableEnum.NAME.TRADER,
    conditions: [
      { key: 'traderEnvId', value: envId },
      { key: 'traderPatternId', value: patternId },
    ],
  })
  return trader ? convertToRecord(trader) : null
}

export const getActives = async (): Promise<interfaces.traderModel.Record[]> => {
  const traders = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER,
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
    tableName: tableEnum.NAME.TRADER,
    conditions: [
      { key: 'traderPatternId', value: traderPatternId },
    ],
  })
  return traders.map((trader) => convertToRecord(trader))
}

export const getAll = async (): Promise<interfaces.traderModel.Record[]> => {
  const traders = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER,
  })
  return traders.map((trader) => convertToRecord(trader))
}

export const getInPKs = async (
  ids: number[],
): Promise<interfaces.traderModel.Record[]> => {
  const traders = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER,
    conditions: [
      { key: 'id', value: ids, type: 'IN' },
    ],
  })
  return traders.map((trader) => convertToRecord(trader))
}

export const getTops = async (
  each: number,
  envId?: number,
  behavior?: interfaces.traderPatternModel.Behavior,
): Promise<interfaces.traderModel.Tops> => {
  const conditions: databaseAdapter.Condition[] = [{ key: 'isActive', value: true }]
  if (envId) conditions.push({ key: 'traderEnvId', value: envId })
  if (behavior) {
    conditions.push({
      key: `${tableEnum.NAME.TRADER_PATTERN}.${behavior}`, value: null, type: 'IS NOT',
    })
  }

  const leftJoin = behavior
    ? {
        joinTable: tableEnum.NAME.TRADER_PATTERN,
        foreignKey: `${tableEnum.NAME.TRADER}.traderPatternId`,
        joinKey: `${tableEnum.NAME.TRADER_PATTERN}.id`,
      }
    : undefined

  const topYearly = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER,
    select: [`${tableEnum.NAME.TRADER}.*`],
    conditions: [
      ...conditions,
      { key: 'yearlyPercentNumber', value: null, type: 'IS NOT' },
    ],
    orderBy: [{ column: 'yearlyPercentNumber', order: 'desc' }],
    limit: each,
    leftJoin,
  })

  const topPastYear = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER,
    select: [`${tableEnum.NAME.TRADER}.*`],
    conditions: [
      ...conditions,
      { key: 'pastYearPercentNumber', value: null, type: 'IS NOT' },
    ],
    orderBy: [{ column: 'pastYearPercentNumber', order: 'desc' }],
    limit: each,
    leftJoin,
  })

  const topPastQuarter = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER,
    select: [`${tableEnum.NAME.TRADER}.*`],
    conditions: [
      ...conditions,
      { key: 'pastQuarterPercentNumber', value: null, type: 'IS NOT' },
    ],
    orderBy: [{ column: 'pastQuarterPercentNumber', order: 'desc' }],
    limit: each,
    leftJoin,
  })

  const topPastMonth = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER,
    select: [`${tableEnum.NAME.TRADER}.*`],
    conditions: [
      ...conditions,
      { key: 'pastMonthPercentNumber', value: null, type: 'IS NOT' },
    ],
    orderBy: [{ column: 'pastMonthPercentNumber', order: 'desc' }],
    limit: each,
    leftJoin,
  })

  const topPastWeek = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER,
    select: [`${tableEnum.NAME.TRADER}.*`],
    conditions: [
      ...conditions,
      { key: 'pastWeekPercentNumber', value: null, type: 'IS NOT' },
    ],
    orderBy: [{ column: 'pastWeekPercentNumber', order: 'desc' }],
    limit: each,
    leftJoin,
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
    tableName: tableEnum.NAME.TRADER,
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
    tableName: tableEnum.NAME.TRADER,
    values,
    conditions: [
      { key: 'id', value: traderId },
    ],
    transaction,
  })
  return convertToRecord(updatedTraders[0])
}
