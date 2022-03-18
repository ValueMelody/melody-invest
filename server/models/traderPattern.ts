import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export const getByPK = async (
  id: number,
): Promise<interfaces.traderPatternModel.Record | null> => {
  const pattern = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.TRADER_PATTERN,
    conditions: [
      { key: 'id', value: id },
    ],
  })
  return pattern
}

export const getInPKs = async (
  ids: number[],
): Promise<interfaces.traderPatternModel.Record[]> => {
  const patterns = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER_PATTERN,
    conditions: [
      { key: 'id', value: ids, type: 'IN' },
    ],
  })
  return patterns
}

export const getByUK = async (
  hashCode: string,
): Promise<interfaces.traderPatternModel.Record | null> => {
  const pattern = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.TRADER_PATTERN,
    conditions: [
      { key: 'hashCode', value: hashCode },
    ],
  })
  return pattern
}

export const getAll = async (): Promise<interfaces.traderPatternModel.Record[]> => {
  const patterns = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER_PATTERN,
  })
  return patterns
}

export const create = async (
  values: interfaces.traderPatternModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.traderPatternModel.Record> => {
  const pattern = await databaseAdapter.create({
    tableName: tableEnum.NAME.TRADER_PATTERN,
    values,
    transaction,
  })
  return pattern
}

export const createIfEmpty = async (
  values: interfaces.traderPatternModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.traderPatternModel.Record> => {
  const currentRecord = await getByUK(values.hashCode)
  if (currentRecord) return currentRecord
  return create(values, transaction)
}

export const update = async (
  id: number,
  values: interfaces.traderPatternModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.traderPatternModel.Record> => {
  const patterns = await databaseAdapter.update({
    tableName: tableEnum.NAME.TRADER_PATTERN,
    values,
    conditions: [
      { key: 'id', value: id },
    ],
    transaction,
  })
  return patterns[0]
}
