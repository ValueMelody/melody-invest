import * as tableEnum from '../enums/table'
import * as databaseAdapter from '../adapters/database'

export interface TickerQuarterly {
  id: number;
  tickerId: number;
  quarter: string;
  earningDate: string | null;
  eps: string | null;
  estimatedEPS: string | null;
  epsSurprisePercent: string | null;
  earningReportDate: string | null;
  ebitda?: string;
  netIncome?: string;
  grossProfit?: string;
  totalRevenue?: string;
  costOfRevenue?: string;
}

export interface TickerQuarterlyEdit {
  tickerId?: number;
  quarter?: string;
  earningDate?: string;
  eps?: string | null;
  estimatedEPS?: string | null;
  epsSurprisePercent?: string | null;
  earningReportDate?: string;
  ebitda?: string;
  netIncome?: string;
  grossProfit?: string;
  totalRevenue?: string;
  costOfRevenue?: string;
}

export const getByUK = async (
  tickerId: number,
  quarter: string
): Promise<TickerQuarterly | null> => {
  const tickerQuarterly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER_QUARTERLY,
    conditions: [
      { key: 'tickerId', value: tickerId },
      { key: 'quarter', value: quarter }
    ]
  })
  return tickerQuarterly
}

export const getLatest = async (
  tickerId: number,
  conditions?: databaseAdapter.Condition[]
): Promise<TickerQuarterly | null> => {
  const pkCondition = [{ key: 'tickerId', value: tickerId }]
  const whereConditions = conditions
    ? [...pkCondition, ...conditions]
    : pkCondition
  const tickerQuarterly = await databaseAdapter.findOne({
    tableName: tableEnum.NAMES.TICKER_QUARTERLY,
    conditions: whereConditions,
    orderBy: { key: 'quarter', type: 'desc' }
  })
  return tickerQuarterly
}

export const create = async (
  values: TickerQuarterlyEdit
): Promise<TickerQuarterly> => {
  const newRecords = await databaseAdapter.create({
    tableName: tableEnum.NAMES.TICKER_QUARTERLY,
    values
  })
  return newRecords?.length ? newRecords[0] : null
}

export const update = async (
  tickerQuarterlyId: number,
  values: TickerQuarterlyEdit
): Promise<TickerQuarterly> => {
  const updatedQuarterly = await databaseAdapter.update({
    tableName: tableEnum.NAMES.TICKER_QUARTERLY,
    values,
    conditions: [
      { key: 'id', value: tickerQuarterlyId }
    ]
  })
  return updatedQuarterly?.length ? updatedQuarterly[0] : null
}
