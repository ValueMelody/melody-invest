import { Knex } from 'knex'
import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'
import * as dateTool from '../tools/date'

export type MovementKey =
  'epsQuarterlyBeats' | 'epsQuarterlyMiss' |
  'incomeQuarterlyIncrease' | 'incomeQuarterlyDecrease' |
  'profitQuarterlyIncrease' | 'profitQuarterlyDecrease' |
  'revenueQuarterlyIncrease' | 'revenueQuarterlyDecrease'

export interface Record {
  id: number;
  tickerId: number;
  quarter: string;
  earningDate: string | null;
  earningReportDate: string | null;
  eps: number | null;
  estimatedEPS: number | null;
  epsSurprisePercent: number | null;
  ebitda: number | null;
  netIncome: number | null;
  grossProfit: number | null;
  totalRevenue: number | null;
  costOfRevenue: number | null;
  epsQuarterlyBeats: number | null;
  epsQuarterlyMiss: number | null;
  profitQuarterlyIncrease: number | null;
  profitQuarterlyDecrease: number | null;
  revenueQuarterlyIncrease: number | null;
  revenueQuarterlyDecrease: number | null;
  incomeQuarterlyIncrease: number | null;
  incomeQuarterlyDecrease: number | null;
}

interface Raw {
  id: number;
  tickerId: number;
  quarter: string;
  earningDate: string | null;
  earningReportDate: string | null;
  eps: string | null;
  estimatedEPS: string | null;
  epsSurprisePercent: string | null;
  ebitda: string | null;
  netIncome: string | null;
  grossProfit: string | null;
  totalRevenue: string | null;
  costOfRevenue: string | null;
  epsQuarterlyBeats: number | null;
  epsQuarterlyMiss: number | null;
  profitQuarterlyIncrease: number | null;
  profitQuarterlyDecrease: number | null;
  revenueQuarterlyIncrease: number | null;
  revenueQuarterlyDecrease: number | null;
  incomeQuarterlyIncrease: number | null;
  incomeQuarterlyDecrease: number | null;
}

interface Create {
  tickerId: number;
  quarter: string;
  earningDate?: string;
  earningReportDate?: string;
  eps?: string | null;
  estimatedEPS?: string | null;
  epsSurprisePercent?: string | null;
  ebitda?: string;
  netIncome?: string;
  grossProfit?: string;
  totalRevenue?: string;
  costOfRevenue?: string;
}

interface Update {
  earningDate?: string;
  earningReportDate?: string;
  eps?: string | null;
  estimatedEPS?: string | null;
  epsSurprisePercent?: string | null;
  ebitda?: string;
  netIncome?: string;
  grossProfit?: string;
  totalRevenue?: string;
  costOfRevenue?: string;
  epsQuarterlyBeats?: number | null;
  epsQuarterlyMiss?: number | null;
  profitQuarterlyIncrease?: number | null;
  profitQuarterlyDecrease?: number | null;
  revenueQuarterlyIncrease?: number | null;
  revenueQuarterlyDecrease?: number | null;
  incomeQuarterlyIncrease?: number | null;
  incomeQuarterlyDecrease?: number | null;
}

const convertToRecord = (raw: Raw): Record => ({
  id: raw.id,
  tickerId: raw.tickerId,
  quarter: raw.quarter,
  earningDate: raw.earningDate,
  earningReportDate: raw.earningReportDate,
  eps: raw.eps ? parseFloat(raw.eps) : null,
  estimatedEPS: raw.estimatedEPS ? parseFloat(raw.estimatedEPS) : null,
  epsSurprisePercent: raw.epsSurprisePercent ? parseFloat(raw.epsSurprisePercent) : null,
  ebitda: raw.ebitda ? parseInt(raw.ebitda) : null,
  netIncome: raw.netIncome ? parseInt(raw.netIncome) : null,
  grossProfit: raw.grossProfit ? parseInt(raw.grossProfit) : null,
  totalRevenue: raw.totalRevenue ? parseInt(raw.totalRevenue) : null,
  costOfRevenue: raw.costOfRevenue ? parseInt(raw.costOfRevenue) : null,
  epsQuarterlyBeats: raw.epsQuarterlyBeats,
  epsQuarterlyMiss: raw.epsQuarterlyMiss,
  profitQuarterlyIncrease: raw.profitQuarterlyIncrease,
  profitQuarterlyDecrease: raw.profitQuarterlyDecrease,
  revenueQuarterlyIncrease: raw.revenueQuarterlyIncrease,
  revenueQuarterlyDecrease: raw.revenueQuarterlyDecrease,
  incomeQuarterlyIncrease: raw.incomeQuarterlyIncrease,
  incomeQuarterlyDecrease: raw.incomeQuarterlyDecrease,
})

export const getByUK = async (
  tickerId: number,
  quarter: string,
): Promise<Record | null> => {
  const tickerQuarterly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER_QUARTERLY,
    conditions: [
      { key: 'tickerId', value: tickerId },
      { key: 'quarter', value: quarter },
    ],
  })
  return tickerQuarterly ? convertToRecord(tickerQuarterly) : null
}

export const getLatest = async (
  tickerId: number,
  conditions?: databaseAdapter.Condition[],
): Promise<Record | null> => {
  const pkCondition = [{ key: 'tickerId', value: tickerId }]
  const whereConditions = conditions
    ? [...pkCondition, ...conditions]
    : pkCondition
  const tickerQuarterly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER_QUARTERLY,
    conditions: whereConditions,
    orderBy: { key: 'quarter', type: 'desc' },
  })
  return tickerQuarterly ? convertToRecord(tickerQuarterly) : null
}

export const getAll = async (tickerId: number): Promise<Record[]> => {
  const records = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TICKER_QUARTERLY,
    conditions: [
      { key: 'tickerId', value: tickerId },
    ],
    orderBy: { key: 'quarter', type: 'asc' },
  })
  return records
}

export const getPublishedByDate = async (date: string): Promise<Record[]> => {
  const currentQuarter = dateTool.getQuarterByDate(date)
  const previousQuarter = dateTool.getPreviousQuarter(currentQuarter)

  const records = await databaseAdapter.findAll({
    tableName: tableEnum.NAMES.TICKER_QUARTERLY,
    conditions: [
      { key: 'earningReportDate', value: date, type: '<' },
      { key: 'quarter', value: previousQuarter, type: '>=' },
      { key: 'quarter', value: currentQuarter, type: '<=' },
    ],
    orderBy: { key: 'quarter', type: 'desc' },
  })
  return records
}

export const create = async (
  values: Create, transaction: Knex.Transaction,
): Promise<Record> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TICKER_QUARTERLY,
    values,
    transaction,
  })
  return convertToRecord(newRecords[0])
}

export const update = async (
  tickerQuarterlyId: number,
  values: Update,
  transaction: Knex.Transaction,
): Promise<Record> => {
  const updatedQuarterly = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TICKER_QUARTERLY,
    values,
    conditions: [
      { key: 'id', value: tickerQuarterlyId },
    ],
    transaction,
  })
  return convertToRecord(updatedQuarterly[0])
}
