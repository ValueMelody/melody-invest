import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

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
  costOfRevenue: raw.costOfRevenue ? parseInt(raw.costOfRevenue) : null
})

export const getByUK = async (
  tickerId: number,
  quarter: string
): Promise<Record | null> => {
  const tickerQuarterly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER_QUARTERLY,
    conditions: [
      { key: 'tickerId', value: tickerId },
      { key: 'quarter', value: quarter }
    ]
  })
  return tickerQuarterly ? convertToRecord(tickerQuarterly) : null
}

export const getLatest = async (
  tickerId: number,
  conditions?: databaseAdapter.Condition[]
): Promise<Record | null> => {
  const pkCondition = [{ key: 'tickerId', value: tickerId }]
  const whereConditions = conditions
    ? [...pkCondition, ...conditions]
    : pkCondition
  const tickerQuarterly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER_QUARTERLY,
    conditions: whereConditions,
    orderBy: { key: 'quarter', type: 'desc' }
  })
  return tickerQuarterly ? convertToRecord(tickerQuarterly) : null
}

export const create = async (
  values: Create
): Promise<Record> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TICKER_QUARTERLY,
    values
  })
  return convertToRecord(newRecords[0])
}

export const update = async (
  tickerQuarterlyId: number,
  values: Update
): Promise<Record> => {
  const updatedQuarterly = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TICKER_QUARTERLY,
    values,
    conditions: [
      { key: 'id', value: tickerQuarterlyId }
    ]
  })
  return convertToRecord(updatedQuarterly[0])
}
