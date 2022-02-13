import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface Record {
  id: number;
  traderEnvId: number;
  traderDNAId: number;
  isActive: boolean;
  rebalancedAt: string;
}

interface Update {
  isActive?: boolean;
  rebalancedAt?: string;
}

export const getByUK = async (
  envId: number,
  dnaId: number
): Promise<Record | null> => {
  const trader = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TRADER,
    conditions: [
      { key: 'traderEnvId', value: envId },
      { key: 'traderDNAId', value: dnaId }
    ]
  })
  return trader
}

export const getActives = async (): Promise<Record[]> => {
  const traders = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TRADER,
    conditions: [
      { key: 'isActive', value: true }
    ]
  })
  return traders
}

export const update = async (
  traderId: number,
  values: Update
): Promise<Record> => {
  const updatedTrader = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TRADER,
    values,
    conditions: [
      { key: 'id', value: traderId }
    ]
  })
  return updatedTrader[0]
}
