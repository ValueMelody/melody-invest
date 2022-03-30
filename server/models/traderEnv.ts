import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

const convertToRecord = (
  raw: interfaces.traderEnvModel.Raw,
): interfaces.traderEnvModel.Record => ({
  ...raw,
  tickerIds: raw.tickerIds ? raw.tickerIds.split(',').map((tickerId) => parseInt(tickerId)) : null,
})

export const getByPK = async (
  id: number,
): Promise<interfaces.traderEnvModel.Record | null> => {
  const env = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.TRADER_ENV,
    conditions: [
      { key: 'id', value: id },
    ],
  })
  return env ? convertToRecord(env) : null
}

export const getByUK = async (
  startDate: string,
  tickerIds: string | null,
): Promise<interfaces.traderEnvModel.Record | null> => {
  const env = await databaseAdapter.findOne({
    tableName: tableEnum.NAME.TRADER_ENV,
    conditions: [
      { key: 'startDate', value: startDate },
      { key: 'tickerIds', value: tickerIds || null, type: tickerIds ? '=' : 'IS' },
    ],
  })
  return env ? convertToRecord(env) : null
}

export const create = async (
  values: interfaces.traderEnvModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.traderEnvModel.Record> => {
  const pattern = await databaseAdapter.create({
    tableName: tableEnum.NAME.TRADER_ENV,
    values,
    transaction,
  })
  return pattern
}

export const createIfEmpty = async (
  values: interfaces.traderEnvModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.traderEnvModel.Record> => {
  const currentRecord = await getByUK(values.startDate, values.tickerIds)
  if (currentRecord) return currentRecord
  return create(values, transaction)
}

export const getSystemDefined = async (): Promise<interfaces.traderEnvModel.Record[]> => {
  const envs = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER_ENV,
    conditions: [
      { key: 'isSystem', value: true },
    ],
  })
  return envs.map((env) => convertToRecord(env))
}
