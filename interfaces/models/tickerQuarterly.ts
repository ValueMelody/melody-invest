export type MovementKey =
  'incomeQuarterlyIncrease' | 'incomeQuarterlyDecrease' |
  'profitQuarterlyIncrease' | 'profitQuarterlyDecrease' |
  'revenueQuarterlyIncrease' | 'revenueQuarterlyDecrease'

interface Common {
  id: number;
  tickerId: number;
  quarter: string;
  earningDate: string | null;
  profitQuarterlyIncrease: number | null;
  profitQuarterlyDecrease: number | null;
  revenueQuarterlyIncrease: number | null;
  revenueQuarterlyDecrease: number | null;
  incomeQuarterlyIncrease: number | null;
  incomeQuarterlyDecrease: number | null;
}

export interface Record extends Common {
  eps: number | null;
  ebitda: number | null;
  netIncome: number | null;
  grossProfit: number | null;
  totalRevenue: number | null;
  costOfRevenue: number | null;
  equity: number | null;
  totalAssets: number | null;
  totalLiabilities: number | null;
  freeCashFlow: number | null;
  grossMargin: number | null;
  debtEquity: number | null;
  roa: number | null;
  roe: number | null;
  outstandingShares: number | null;
  epsQoQ: number | null;
  revenueQoQ: number | null;
}

export interface Raw extends Common {
  eps: string | null;
  ebitda: string | null;
  netIncome: string | null;
  grossProfit: string | null;
  totalRevenue: string | null;
  costOfRevenue: string | null;
  equity: string | null;
  totalAssets: string | null;
  totalLiabilities: string | null;
  freeCashFlow: string | null;
  grossMargin: string | null;
  debtEquity: string | null;
  roa: string | null;
  roe: string | null;
  outstandingShares: string | null;
  epsQoQ: string | null;
  revenueQoQ: string | null;
}

export interface Create {
  tickerId: number;
  quarter: string;
  earningDate: string;
  eps: string | null;
  ebitda: string | null;
  netIncome: string | null;
  grossProfit: string | null;
  totalRevenue: string | null;
  costOfRevenue: string | null;
  equity: string | null;
  totalAssets: string | null;
  totalLiabilities: string | null;
  freeCashFlow: string | null;
  grossMargin: string | null;
  debtEquity: string | null;
  roa: string | null;
  roe: string | null;
  outstandingShares: string | null;
  epsQoQ: string | null;
  revenueQoQ: string | null;
}

export interface Update {
  earningDate?: string;
  earningReportDate?: string;
  eps?: string | null;
  ebitda?: string | null;
  netIncome?: string | null;
  grossProfit?: string | null;
  totalRevenue?: string | null;
  costOfRevenue?: string | null;
  profitQuarterlyIncrease?: number | null;
  profitQuarterlyDecrease?: number | null;
  revenueQuarterlyIncrease?: number | null;
  revenueQuarterlyDecrease?: number | null;
  incomeQuarterlyIncrease?: number | null;
  incomeQuarterlyDecrease?: number | null;
}
