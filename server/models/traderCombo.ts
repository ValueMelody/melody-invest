import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as adapterEnum from 'enums/adapter'
import * as databaseAdapter from 'adapters/database'

const TableName = adapterEnum.DatabaseTable.TraderCombo

const convertToRecord = (
  raw: interfaces.traderComboModel.Raw,
): interfaces.traderComboModel.Record => {
  return {
    ...raw,
    traderIds: raw.traderIds.split(',').map((id) => parseInt(id)),
  }
}

export const getByPK = async (
  id: number,
): Promise<interfaces.traderComboModel.Record | null> => {
  const combo = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'id', value: id },
    ],
  })
  return combo ? convertToRecord(combo) : null
}

export const getByUK = async (
  traderIds: string,
): Promise<interfaces.traderComboModel.Record | null> => {
  const combo = await databaseAdapter.findOne({
    tableName: TableName,
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
    tableName: TableName,
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
    tableName: TableName,
    values,
    transaction,
  })
  return convertToRecord(env)
}

export const createIfEmpty = async (
  values: interfaces.traderComboModel.Create,
  transaction: Knex.Transaction,
): Promise<{
  record: interfaces.traderComboModel.Record;
  isNew: boolean;
}> => {
  const currentRecord = await getByUK(values.traderIds)
  if (currentRecord) {
    return {
      record: currentRecord,
      isNew: false,
    }
  }
  const created = await create(values, transaction)
  return {
    record: created,
    isNew: true,
  }
}
