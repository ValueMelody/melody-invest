import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface TickerYearly {
  id: number;
  tickerId: number;
  year: string;
  earningDate: string | null;
  eps: string | null;
  ebitda: string | null;
  netIncome: string | null;
  grossProfit: string | null;
  totalRevenue: string | null;
  costOfRevenue: string | null;
}

interface TickerYearlyEdit {
  tickerId?: number;
  year?: string;
  earningDate?: string;
  eps?: string;
  ebitda?: string;
  netIncome?: string;
  grossProfit?: string;
  totalRevenue?: string;
  costOfRevenue?: string;
}

export const getLatest = async (
  tickerId: number,
  conditions?: databaseAdapter.Condition[]
): Promise<TickerYearly | null> => {
  const pkCondition = [{ key: 'tickerId', value: tickerId }]
  const whereConditions = conditions
    ? [...pkCondition, ...conditions]
    : pkCondition
  const tickerYearly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER_YEARLY,
    conditions: whereConditions,
    orderBy: { key: 'year', type: 'desc' }
  })
  return tickerYearly
}

export const getByUK = async (
  tickerId: number,
  year: string
): Promise<TickerYearly | null> => {
  const tickerYearly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER_YEARLY,
    conditions: [
      { key: 'tickerId', value: tickerId },
      { key: 'year', value: year }
    ]
  })
  return tickerYearly
}

export const create = async (
  values: TickerYearlyEdit
): Promise<TickerYearly> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TICKER_YEARLY,
    values
  })
  return newRecords?.length ? newRecords[0] : null
}

export const update = async (
  tickerYearlyId: number,
  values: TickerYearlyEdit
): Promise<TickerYearly> => {
  const updatedYearly = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TICKER_YEARLY,
    values,
    conditions: [
      { key: 'id', value: tickerYearlyId }
    ]
  })
  return updatedYearly?.length ? updatedYearly[0] : null
}
