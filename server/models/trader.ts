import { Knex } from 'knex'
import * as interfaces from '@interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

const convertToRecord = (raw: interfaces.traderModel.Raw): interfaces.traderModel.Record => ({
  id: raw.id,
  traderEnvId: raw.traderEnvId,
  traderPatternId: raw.traderPatternId,
  isActive: raw.isActive,
  rebalancedAt: raw.rebalancedAt,
  totalValue: raw.totalValue ? parseInt(raw.totalValue) : null,
  estimatedAt: raw.estimatedAt,
  startedAt: raw.startedAt,
  totalDays: raw.totalDays,
  yearlyPercentNumber: raw.yearlyPercentNumber,
  grossPercentNumber: raw.grossPercentNumber,
  pastYearPercentNumber: raw.pastYearPercentNumber,
  pastQuarterPercentNumber: raw.pastQuarterPercentNumber,
  pastMonthPercentNumber: raw.pastMonthPercentNumber,
  pastWeekPercentNumber: raw.pastWeekPercentNumber,
})

export const getByUK = async (
  envId: number,
  patternId: number,
): Promise<interfaces.traderModel.Record | null> => {
  const trader = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TRADER,
    conditions: [
      { key: 'traderEnvId', value: envId },
      { key: 'traderPatternId', value: patternId },
    ],
  })
  return trader ? convertToRecord(trader) : null
}

export const getActives = async (): Promise<interfaces.traderModel.Record[]> => {
  const traders = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TRADER,
    conditions: [
      { key: 'isActive', value: true },
    ],
  })
  return traders.map((trader) => convertToRecord(trader))
}

interface Tops {
  yearly: interfaces.traderModel.Record[],
  pastYear: interfaces.traderModel.Record[],
  pastQuarter: interfaces.traderModel.Record[],
  pastMonth: interfaces.traderModel.Record[],
  pastWeek: interfaces.traderModel.Record[],
}

export const getTops = async (total: number): Promise<Tops> => {
  const eachNumber = Math.floor(total / 5)

  const topYearly = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TRADER,
    conditions: [
      { key: 'isActive', value: true },
    ],
    orderBy: [{ column: 'yearlyPercentNumber', order: 'desc' }],
    limit: eachNumber,
  })

  const topPastYear = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TRADER,
    conditions: [
      { key: 'isActive', value: true },
    ],
    orderBy: [{ column: 'pastYearPercentNumber', order: 'desc' }],
    limit: eachNumber,
  })

  const topPastQuarter = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TRADER,
    conditions: [
      { key: 'isActive', value: true },
    ],
    orderBy: [{ column: 'pastQuarterPercentNumber', order: 'desc' }],
    limit: eachNumber,
  })

  const topPastMonth = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TRADER,
    conditions: [
      { key: 'isActive', value: true },
    ],
    orderBy: [{ column: 'pastMonthPercentNumber', order: 'desc' }],
    limit: eachNumber,
  })

  const topPastWeek = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TRADER,
    conditions: [
      { key: 'isActive', value: true },
    ],
    orderBy: [{ column: 'pastWeekPercentNumber', order: 'desc' }],
    limit: eachNumber,
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
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TRADER,
    values,
    transaction,
  })
  return newRecords[0]
}

export const createOrActive = async (
  traderEnvId: number, traderPatternId: number, transaction: Knex.Transaction,
): Promise<interfaces.traderModel.Record> => {
  const currentRecord = await getByUK(traderEnvId, traderPatternId)
  if (!currentRecord) return create({ traderEnvId, traderPatternId, isActive: true }, transaction)

  if (currentRecord.isActive) return currentRecord

  return update(currentRecord.id, { isActive: true }, transaction)
}

export const update = async (
  traderId: number,
  values: interfaces.traderModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.traderModel.Record> => {
  const updatedTrader = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TRADER,
    values,
    conditions: [
      { key: 'id', value: traderId },
    ],
    transaction,
  })
  return convertToRecord(updatedTrader[0])
}
