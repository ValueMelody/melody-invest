import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'
import * as generateTool from '../tools/generate'

const convertToRecord = (raw: interfaces.traderModel.Raw): interfaces.traderModel.Record => ({
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

export const getAll = async (): Promise<interfaces.traderModel.Record[]> => {
  const traders = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER,
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

export const getTops = async (total: number): Promise<Tops> => {
  const eachNumber = Math.floor(total / 5)

  const topYearly = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER,
    conditions: [
      { key: 'isActive', value: true },
    ],
    orderBy: [{ column: 'yearlyPercentNumber', order: 'desc' }],
    limit: eachNumber,
  })

  const topPastYear = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER,
    conditions: [
      { key: 'isActive', value: true },
    ],
    orderBy: [{ column: 'pastYearPercentNumber', order: 'desc' }],
    limit: eachNumber,
  })

  const topPastQuarter = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER,
    conditions: [
      { key: 'isActive', value: true },
    ],
    orderBy: [{ column: 'pastQuarterPercentNumber', order: 'desc' }],
    limit: eachNumber,
  })

  const topPastMonth = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER,
    conditions: [
      { key: 'isActive', value: true },
    ],
    orderBy: [{ column: 'pastMonthPercentNumber', order: 'desc' }],
    limit: eachNumber,
  })

  const topPastWeek = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER,
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
