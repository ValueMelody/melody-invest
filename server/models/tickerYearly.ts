import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface Record {
  id: number;
  tickerId: number;
  year: string;
  earningDate: string | null;
  eps: number | null;
  ebitda: number | null;
  netIncome: number | null;
  grossProfit: number | null;
  totalRevenue: number | null;
  costOfRevenue: number | null;
  profitContinuousIncrease: number | null;
  profitContinuousDecrease: number | null;
  revenueContinuousIncrease: number | null;
  revenueContinuousDecrease: number | null;
  incomeContinuousIncrease: number | null;
  incomeContinuousDecrease: number | null;
}

interface Raw {
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
  profitContinuousIncrease: number | null;
  profitContinuousDecrease: number | null;
  revenueContinuousIncrease: number | null;
  revenueContinuousDecrease: number | null;
  incomeContinuousIncrease: number | null;
  incomeContinuousDecrease: number | null;
}

interface Create {
  tickerId: number;
  year: string;
  earningDate?: string;
  eps?: string;
  ebitda?: string;
  netIncome?: string;
  grossProfit?: string;
  totalRevenue?: string;
  costOfRevenue?: string;
}

interface Update {
  earningDate?: string;
  eps?: string;
  ebitda?: string;
  netIncome?: string;
  grossProfit?: string;
  totalRevenue?: string;
  costOfRevenue?: string;
  profitContinuousIncrease?: number | null;
  profitContinuousDecrease?: number | null;
  revenueContinuousIncrease?: number | null;
  revenueContinuousDecrease?: number | null;
  incomeContinuousIncrease?: number | null;
  incomeContinuousDecrease?: number | null;
}

const convertToRecord = (raw: Raw): Record => ({
  id: raw.id,
  tickerId: raw.tickerId,
  year: raw.year,
  earningDate: raw.earningDate,
  eps: raw.eps ? parseFloat(raw.eps) : null,
  ebitda: raw.ebitda ? parseInt(raw.ebitda) : null,
  netIncome: raw.netIncome ? parseInt(raw.netIncome) : null,
  grossProfit: raw.grossProfit ? parseInt(raw.grossProfit) : null,
  totalRevenue: raw.totalRevenue ? parseInt(raw.totalRevenue) : null,
  costOfRevenue: raw.costOfRevenue ? parseInt(raw.costOfRevenue) : null,
  profitContinuousIncrease: raw.profitContinuousIncrease,
  profitContinuousDecrease: raw.profitContinuousDecrease,
  revenueContinuousIncrease: raw.revenueContinuousIncrease,
  revenueContinuousDecrease: raw.revenueContinuousDecrease,
  incomeContinuousIncrease: raw.incomeContinuousIncrease,
  incomeContinuousDecrease: raw.incomeContinuousDecrease,
})

export const getLatest = async (
  tickerId: number,
  conditions?: databaseAdapter.Condition[],
): Promise<Record | null> => {
  const pkCondition = [{ key: 'tickerId', value: tickerId }]
  const whereConditions = conditions
    ? [...pkCondition, ...conditions]
    : pkCondition
  const tickerYearly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER_YEARLY,
    conditions: whereConditions,
    orderBy: { key: 'year', type: 'desc' },
  })
  return tickerYearly ? convertToRecord(tickerYearly) : null
}

export const getByUK = async (
  tickerId: number,
  year: string,
): Promise<Record | null> => {
  const tickerYearly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER_YEARLY,
    conditions: [
      { key: 'tickerId', value: tickerId },
      { key: 'year', value: year },
    ],
  })
  return tickerYearly ? convertToRecord(tickerYearly) : null
}

export const getAll = async (tickerId: number): Promise<Record[]> => {
  const records = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TICKER_YEARLY,
    conditions: [
      { key: 'tickerId', value: tickerId },
    ],
    orderBy: { key: 'year', type: 'asc' },
  })
  return records
}

export const create = async (
  values: Create,
): Promise<Record> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TICKER_YEARLY,
    values,
  })
  return convertToRecord(newRecords[0])
}

export const update = async (
  tickerYearlyId: number,
  values: Update,
): Promise<Record> => {
  const updatedYearly = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TICKER_YEARLY,
    values,
    conditions: [
      { key: 'id', value: tickerYearlyId },
    ],
  })
  return convertToRecord(updatedYearly[0])
}
