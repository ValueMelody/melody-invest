import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

const convertToRecord = (
  raw: interfaces.traderComboModel.Raw,
): interfaces.traderComboModel.Record => {
  return {
    ...raw,
    traderIds: raw.traderIds.split(',').map((id) => parseInt(id)),
  }
}

export const getByUK = async (
  traderIds: string,
): Promise<interfaces.traderComboModel.Record | null> => {
  const combo = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.TRADER_COMBO,
    conditions: [
      { key: 'traderIds', value: traderIds },
    ],
  })
  return combo ? convertToRecord(combo) : null
}

export const getInPKs = async (
  ids: number[],
): Promise<interfaces.traderComboModel.Record[]> => {
  const combos = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER_COMBO,
    conditions: [
      { key: 'id', value: ids, type: 'IN' },
    ],
  })
  return combos.map((combo) => convertToRecord(combo))
}

export const create = async (
  values: interfaces.traderComboModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.traderComboModel.Record> => {
  const env = await databaseAdapter.create({
    tableName: tableEnum.NAME.TRADER_COMBO,
    values,
    transaction,
  })
  return convertToRecord(env)
}

export const createIfEmpty = async (
  values: interfaces.traderComboModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.traderComboModel.Record> => {
  const currentRecord = await getByUK(values.traderIds)
  if (currentRecord) return currentRecord
  return create(values, transaction)
}
