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
  yearlyPercent: string | null;
  grossPercent: string | null;
  totalDays: number | null;
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
  yearlyPercent: string | null;
  grossPercent: string | null;
  totalDays: number | null;
}

interface Update {
  isActive?: boolean;
  rebalancedAt?: string;
  totalValue?: number;
  estimatedAt?: string;
  startedAt?: string ;
  yearlyPercent?: string;
  grossPercent?: string;
  totalDays?: number;
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
  yearlyPercent: raw.yearlyPercent,
  grossPercent: raw.grossPercent,
  totalDays: raw.totalDays,
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

export const update = async (
  traderId: number,
  values: Update,
): Promise<Record> => {
  const updatedTrader = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TRADER,
    values,
    conditions: [
      { key: 'id', value: traderId },
    ],
  })
  return convertToRecord(updatedTrader[0])
}
