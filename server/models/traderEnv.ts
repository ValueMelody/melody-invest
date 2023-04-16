import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'
import * as interfaces from '@shared/interfaces'
import { Knex } from 'knex'

const TableName = adapterEnum.DatabaseTable.TraderEnv

const convertToRecord = (
  raw: interfaces.traderEnvModel.Raw,
): interfaces.traderEnvModel.Record => {
  const record: any = raw
  record.tickerIds = raw.tickerIds ? raw.tickerIds.split(',').map((tickerId) => parseInt(tickerId)) : null
  return record
}

export const getAll = async (): Promise<interfaces.traderEnvModel.Record[]> => {
  const envs = await databaseAdapter.findAll({
    tableName: TableName,
  })
  return envs.map((env) => convertToRecord(env))
}

export const getByPK = async (
  id: number,
): Promise<interfaces.traderEnvModel.Record | null> => {
  const env = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'id', value: id },
    ],
  })
  return env ? convertToRecord(env) : null
}

export const getByUK = async (
  entityId: number,
  startDate: string,
  tickerIds: string | null,
): Promise<interfaces.traderEnvModel.Record | null> => {
  const env = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'entityId', value: entityId },
      { key: 'startDate', value: startDate },
      { key: 'tickerIds', value: tickerIds || null, type: tickerIds ? '=' : 'IS' },
    ],
  })
  return env ? convertToRecord(env) : null
}

export const getSystemDefined = async (): Promise<interfaces.traderEnvModel.Record[]> => {
  const envs = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'isSystem', value: true },
    ],
  })
  return envs.map((env) => convertToRecord(env))
}

export const getInPKs = async (
  ids: number[],
): Promise<interfaces.traderEnvModel.Record[]> => {
  const envs = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'id', value: ids, type: 'IN' },
    ],
  })
  return envs.map((env) => convertToRecord(env))
}

export const create = async (
  values: interfaces.traderEnvModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.traderEnvModel.Record> => {
  const env = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return convertToRecord(env)
}

export const createIfEmpty = async (
  values: interfaces.traderEnvModel.Create,
  transaction: Knex.Transaction,
): Promise<{
  record: interfaces.traderEnvModel.Record;
  isNew: boolean;
}> => {
  const currentRecord = await getByUK(values.entityId, values.startDate, values.tickerIds)
  if (currentRecord) return { record: currentRecord, isNew: false }

  const created = await create(values, transaction)
  return { record: created, isNew: true }
}
