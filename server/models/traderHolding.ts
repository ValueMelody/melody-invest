import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as adapterEnum from '../enums/adapter'
import * as databaseAdapter from '../adapters/database'

const TableName = adapterEnum.DatabaseTable.TraderHolding

const convertToRecord = (
  raw: interfaces.traderHoldingModel.Raw,
): interfaces.traderHoldingModel.Record => {
  return {
    ...raw,
    totalValue: parseInt(raw.totalValue),
    totalCash: parseInt(raw.totalCash),
  }
}

export const getLatest = async (
  traderId: number,
): Promise<interfaces.traderHoldingModel.Record | null> => {
  const record = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'traderId', value: traderId },
    ],
    orderBy: [{ column: 'date', order: 'desc' }],
  })
  return record ? convertToRecord(record) : null
}

export const getLatestByDate = async (
  traderId: number,
  date: string,
): Promise<interfaces.traderHoldingModel.Record | null> => {
  const record = await databaseAdapter.findOne({
    tableName: TableName,
    conditions: [
      { key: 'traderId', value: traderId },
      { key: 'date', value: date, type: '<=' },
    ],
    orderBy: [{ column: 'date', order: 'desc' }],
  })
  return record ? convertToRecord(record) : null
}

export const getAllByTraderIds = async (
  traderIds: number[],
): Promise<interfaces.traderHoldingModel.Record[]> => {
  const records = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'traderId', value: traderIds, type: 'IN' },
    ],
    orderBy: [{ column: 'date', order: 'asc' }],
  })
  return records.map((raw) => convertToRecord(raw))
}

export const getAll = async (
  traderId: number,
): Promise<interfaces.traderHoldingModel.Record[]> => {
  const records = await databaseAdapter.findAll({
    tableName: TableName,
    conditions: [
      { key: 'traderId', value: traderId },
    ],
    orderBy: [{ column: 'date', order: 'desc' }],
  })
  return records.map((raw) => convertToRecord(raw))
}

export const create = async (
  values: interfaces.traderHoldingModel.Create,
  transaction: Knex.Transaction,
): Promise<interfaces.traderHoldingModel.Record> => {
  const newRecord = await databaseAdapter.create({
    tableName: TableName,
    values: {
      traderId: values.traderId,
      date: values.date,
      totalValue: values.totalValue.toFixed(2),
      totalCash: values.totalCash.toFixed(2),
      items: JSON.stringify(values.items),
    },
    transaction,
  })
  return convertToRecord(newRecord)
}

export const destroyAll = async (
  traderId: number,
  transaction: Knex.Transaction,
) => {
  await databaseAdapter.destroy({
    tableName: TableName,
    conditions: [
      { key: 'traderId', value: traderId },
    ],
    transaction,
  })
  return true
}
