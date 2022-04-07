import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

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
    tableName: tableEnum.NAME.TRADER_HOLDING,
    conditions: [
      { key: 'traderId', value: traderId },
    ],
    orderBy: [{ column: 'date', order: 'desc' }],
  })
  return record ? convertToRecord(record) : null
}

export const getAllByTraderIds = async (
  traderIds: number[],
): Promise<interfaces.traderHoldingModel.Record[]> => {
  const records = await databaseAdapter.findAll({
    tableName: tableEnum.NAME.TRADER_HOLDING,
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
    tableName: tableEnum.NAME.TRADER_HOLDING,
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
    tableName: tableEnum.NAME.TRADER_HOLDING,
    values: {
      traderId: values.traderId,
      date: values.date,
      totalValue: String(values.totalValue),
      totalCash: String(values.totalCash),
      holdings: JSON.stringify(values.holdings),
    },
    transaction,
  })
  return convertToRecord(newRecord)
}

export const destroyTraderHoldings = async (
  traderId: number,
  transaction: Knex.Transaction,
) => {
  await databaseAdapter.destroy({
    tableName: tableEnum.NAME.TRADER_HOLDING,
    conditions: [
      { key: 'traderId', value: traderId },
    ],
    transaction,
  })
  return true
}
