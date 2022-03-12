import { Knex } from 'knex'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'
import * as dateTool from '../tools/date'

export type MovementKey =
  'incomeYearlyIncrease' | 'incomeYearlyDecrease' |
  'profitYearlyIncrease' | 'profitYearlyDecrease' |
  'revenueYearlyIncrease' | 'revenueYearlyDecrease'

interface Common {
  id: number;
  tickerId: number;
  year: string;
  earningDate: string | null;
  profitYearlyIncrease: number | null;
  profitYearlyDecrease: number | null;
  revenueYearlyIncrease: number | null;
  revenueYearlyDecrease: number | null;
  incomeYearlyIncrease: number | null;
  incomeYearlyDecrease: number | null;
}

export interface Record extends Common {
  eps: number | null;
  ebitda: number | null;
  netIncome: number | null;
  grossProfit: number | null;
  totalRevenue: number | null;
  costOfRevenue: number | null;
}

interface Raw extends Common {
  eps: string | null;
  ebitda: string | null;
  netIncome: string | null;
  grossProfit: string | null;
  totalRevenue: string | null;
  costOfRevenue: string | null;
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
  profitYearlyIncrease?: number | null;
  profitYearlyDecrease?: number | null;
  revenueYearlyIncrease?: number | null;
  revenueYearlyDecrease?: number | null;
  incomeYearlyIncrease?: number | null;
  incomeYearlyDecrease?: number | null;
}

const convertToRecord = (raw: Raw): Record => ({
  ...raw,
  eps: raw.eps ? parseFloat(raw.eps) : null,
  ebitda: raw.ebitda ? parseInt(raw.ebitda) : null,
  netIncome: raw.netIncome ? parseInt(raw.netIncome) : null,
  grossProfit: raw.grossProfit ? parseInt(raw.grossProfit) : null,
  totalRevenue: raw.totalRevenue ? parseInt(raw.totalRevenue) : null,
  costOfRevenue: raw.costOfRevenue ? parseInt(raw.costOfRevenue) : null,
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
    orderBy: [{ column: 'year', order: 'desc' }],
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
    orderBy: [{ column: 'year', order: 'asc' }],
  })
  return records
}

export const getPublishedByDate = async (date: string): Promise<Record[]> => {
  const currentQuarter = dateTool.getQuarterByDate(date)
  const [year, quarter] = currentQuarter.split('-')

  const previousYear = dateTool.getPreviousYear(year)
  const yearBeforePrevious = dateTool.getPreviousYear(previousYear)
  const targetYear = quarter === '03' ? yearBeforePrevious : previousYear

  const records = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TICKER_YEARLY,
    conditions: [
      { key: 'year', value: targetYear },
    ],
    orderBy: [{ column: 'year', order: 'desc' }],
  })
  return records.map((raw) => convertToRecord(raw))
}

export const create = async (
  values: Create, transaction: Knex.Transaction,
): Promise<Record> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TICKER_YEARLY,
    values,
    transaction,
  })
  return convertToRecord(newRecords[0])
}

export const update = async (
  tickerYearlyId: number,
  values: Update,
  transaction: Knex.Transaction,
): Promise<Record> => {
  const updatedYearly = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TICKER_YEARLY,
    values,
    conditions: [
      { key: 'id', value: tickerYearlyId },
    ],
    transaction,
  })
  return convertToRecord(updatedYearly[0])
}
