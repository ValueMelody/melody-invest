import { Knex } from 'knex'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface Record {
  id: number;
  traderEnvId: number;
  traderDNAId: number;
  isActive: boolean;
  rebalancedAt: string;
  totalValue: number | null;
  estimatedAt: string | null;
  startedAt: string | null;
  totalDays: number | null;
  yearlyPercentNumber: number | null;
  grossPercentNumber: number | null;
  pastYearPercentNumber: number | null;
  pastQuarterPercentNumber: number | null;
  pastMonthPercentNumber: number | null;
  pastWeekPercentNumber: number | null;
}

export interface Raw {
  id: number;
  traderEnvId: number;
  traderDNAId: number;
  isActive: boolean;
  rebalancedAt: string;
  totalValue: string | null;
  estimatedAt: string | null;
  startedAt: string | null;
  totalDays: number | null;
  yearlyPercentNumber: number | null;
  grossPercentNumber: number | null;
  pastYearPercentNumber: number | null;
  pastQuarterPercentNumber: number | null;
  pastMonthPercentNumber: number | null;
  pastWeekPercentNumber: number | null;
}

interface Create {
  traderEnvId: number;
  traderDNAId: number;
  isActive: boolean;
}

interface Update {
  isActive?: boolean;
  rebalancedAt?: string;
  totalValue?: number;
  estimatedAt?: string;
  startedAt?: string ;
  totalDays?: number;
  yearlyPercentNumber?: number;
  grossPercentNumber?: number;
  pastYearPercentNumber?: number;
  pastQuarterPercentNumber?: number;
  pastMonthPercentNumber?: number;
  pastWeekPercentNumber?: number;
}

const convertToRecord = (raw: Raw): Record => ({
  id: raw.id,
  traderEnvId: raw.traderEnvId,
  traderDNAId: raw.traderDNAId,
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
  dnaId: number,
): Promise<Record | null> => {
  const trader = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TRADER,
    conditions: [
      { key: 'traderEnvId', value: envId },
      { key: 'traderDNAId', value: dnaId },
    ],
  })
  return trader ? convertToRecord(trader) : null
}

export const getActives = async (): Promise<Record[]> => {
  const traders = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TRADER,
    conditions: [
      { key: 'isActive', value: true },
    ],
  })
  return traders.map((trader) => convertToRecord(trader))
}

export const getTops = async (total: number): Promise<Record[]> => {
  const traders = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TRADER,
    conditions: [
      { key: 'isActive', value: true },
    ],
    orderBy: { key: 'yearlyPercent', type: 'desc' },
    limit: total,
  })
  return traders.map((trader) => convertToRecord(trader))
}

export const create = async (
  values: Create, transaction: Knex.Transaction,
): Promise<Record> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TRADER,
    values,
    transaction,
  })
  return newRecords[0]
}

export const createOrActive = async (
  traderEnvId: number, traderDNAId: number, transaction: Knex.Transaction,
): Promise<Record> => {
  const currentRecord = await getByUK(traderEnvId, traderDNAId)
  if (!currentRecord) return create({ traderEnvId, traderDNAId, isActive: true }, transaction)

  if (currentRecord.isActive) return currentRecord

  return update(currentRecord.id, { isActive: true }, transaction)
}

export const update = async (
  traderId: number,
  values: Update,
  transaction: Knex.Transaction,
): Promise<Record> => {
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
