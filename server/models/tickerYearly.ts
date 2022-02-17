import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'
import * as dateTool from '../tools/date'

export type MovementKey =
  'incomeYearlyIncrease' | 'incomeYearlyDecrease' |
  'profitYearlyIncrease' | 'profitYearlyDecrease' |
  'revenueYearlyIncrease' | 'revenueYearlyDecrease'

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
  profitYearlyIncrease: number | null;
  profitYearlyDecrease: number | null;
  revenueYearlyIncrease: number | null;
  revenueYearlyDecrease: number | null;
  incomeYearlyIncrease: number | null;
  incomeYearlyDecrease: number | null;
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
  profitYearlyIncrease: number | null;
  profitYearlyDecrease: number | null;
  revenueYearlyIncrease: number | null;
  revenueYearlyDecrease: number | null;
  incomeYearlyIncrease: number | null;
  incomeYearlyDecrease: number | null;
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
  profitYearlyIncrease: raw.profitYearlyIncrease,
  profitYearlyDecrease: raw.profitYearlyDecrease,
  revenueYearlyIncrease: raw.revenueYearlyIncrease,
  revenueYearlyDecrease: raw.revenueYearlyDecrease,
  incomeYearlyIncrease: raw.incomeYearlyIncrease,
  incomeYearlyDecrease: raw.incomeYearlyDecrease,
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

export const getPublishedByDate = async (date: string): Promise<Record[]> => {
  const currentYear = dateTool.getYearByDate(date)
  const previousYear = dateTool.getPreviousYear(currentYear)
  const currentQuarter = dateTool.getQuarterByDate(date)
  const previousQuarter = dateTool.getPreviousQuarter(currentQuarter)
  const estimatedReportDate = `${previousQuarter}-30`

  const records = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TICKER_YEARLY,
    conditions: [
      { key: 'earningDate', value: estimatedReportDate, type: '<' },
      { key: 'year', value: previousYear, type: '>=' },
      { key: 'year', value: currentYear, type: '<=' },
    ],
    orderBy: { key: 'year', type: 'desc' },
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
