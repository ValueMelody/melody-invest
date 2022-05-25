import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as adapterEnum from '../enums/adapter'
import * as databaseAdapter from '../adapters/database'

const TableName = adapterEnum.DatabaseTable.TraderPattern

const convertToPublic = (
  record: interfaces.traderPatternModel.Record,
): interfaces.traderPatternModel.Public => {
  const { hashCode, ...patternPublic } = record
  return patternPublic
}

export const getByPK = async (
  id: number,
): Promise<interfaces.traderPatternModel.Record | null> => {
  const pattern = await databaseAdapter.findOne({
    tableName: TableName,
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
    tableName: TableName,
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
    tableName: TableName,
    conditions: [
      { key: 'hashCode', value: hashCode },
    ],
  })
  return pattern
}

export const getPublicByTraders = async (
  traders: interfaces.traderModel.Record[],
) => {
  const relatedPatternIds = traders.map((trader) => trader.traderPatternId)
  const patterns = await getInPKs(relatedPatternIds)
  const publics = patterns.map(convertToPublic)
  return publics
}

export const getAll = async (): Promise<interfaces.traderPatternModel.Record[]> => {
  const patterns = await databaseAdapter.findAll({
    tableName: TableName,
  })
  return patterns
}

export const create = async (
  values: interfaces.traderPatternModel.Create, transaction: Knex.Transaction,
): Promise<interfaces.traderPatternModel.Record> => {
  const pattern = await databaseAdapter.create({
    tableName: TableName,
    values,
    transaction,
  })
  return pattern
}

export const createIfEmpty = async (
  values: interfaces.traderPatternModel.Create,
  transaction: Knex.Transaction,
): Promise<{
  record: interfaces.traderPatternModel.Record;
  isNew: boolean;
}> => {
  const currentRecord = await getByUK(values.hashCode)
  if (currentRecord) return { record: currentRecord, isNew: false }
  const created = await create(values, transaction)
  return { record: created, isNew: true }
}

export const update = async (
  id: number,
  values: interfaces.traderPatternModel.Update,
  transaction: Knex.Transaction,
): Promise<interfaces.traderPatternModel.Record> => {
  const patterns = await databaseAdapter.update({
    tableName: TableName,
    values,
    conditions: [
      { key: 'id', value: id },
    ],
    transaction,
  })
  return patterns[0]
}
