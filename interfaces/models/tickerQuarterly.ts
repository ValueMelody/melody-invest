export type MovementIncreaseKey =
  'incomeQuarterlyIncrease' | 'profitQuarterlyIncrease' |
  'revenueQuarterlyIncrease' | 'peQuarterlyIncrease' |
  'pbQuarterlyIncrease' | 'psQuarterlyIncrease' |
  'epsQuarterlyIncrease' | 'ebitdaQuarterlyIncrease' |
  'bookValueQuarterlyIncrease' | 'equityQuarterlyIncrease' |
  'freeCashFlowQuarterlyIncrease' | 'roaQuarterlyIncrease' |
  'roeQuarterlyIncrease' | 'grossMarginQuarterlyIncrease' |
  'debtEquityQuarterlyIncrease'

export type MovementDecreaseKey =
  'incomeQuarterlyDecrease' | 'profitQuarterlyDecrease' |
  'revenueQuarterlyDecrease' | 'peQuarterlyDecrease' |
  'pbQuarterlyDecrease' | 'psQuarterlyDecrease' |
  'epsQuarterlyDecrease' | 'ebitdaQuarterlyDecrease' |
  'bookValueQuarterlyDecrease' | 'equityQuarterlyDecrease' |
  'freeCashFlowQuarterlyDecrease' | 'roaQuarterlyDecrease' |
  'roeQuarterlyDecrease' | 'grossMarginQuarterlyDecrease' |
  'debtEquityQuarterlyDecrease'

export type MovementKey = MovementIncreaseKey | MovementDecreaseKey

export type CompareKey = 'peRatio' | 'pbRatio' | 'psRatio' | 'roa' | 'roe' | 'grossMargin' | 'debtEquity'

interface Common {
  id: number;
  tickerId: number;
  quarter: string;
  earningDate: string;
  peRatio: string | null;
  pbRatio: string | null;
  psRatio: string | null;
  profitQuarterlyIncrease: number | null;
  profitQuarterlyDecrease: number | null;
  revenueQuarterlyIncrease: number | null;
  revenueQuarterlyDecrease: number | null;
  incomeQuarterlyIncrease: number | null;
  incomeQuarterlyDecrease: number | null;
  peQuarterlyIncrease: number | null;
  peQuarterlyDecrease: number | null;
  pbQuarterlyIncrease: number | null;
  pbQuarterlyDecrease: number | null;
  psQuarterlyIncrease: number | null;
  psQuarterlyDecrease: number | null;
  epsQuarterlyIncrease: number | null;
  epsQuarterlyDecrease: number | null;
  ebitdaQuarterlyIncrease: number | null;
  ebitdaQuarterlyDecrease: number | null;
  bookValueQuarterlyIncrease: number | null;
  bookValueQuarterlyDecrease: number | null;
  equityQuarterlyIncrease: number | null;
  equityQuarterlyDecrease: number | null;
  freeCashFlowQuarterlyIncrease: number | null;
  freeCashFlowQuarterlyDecrease: number | null;
  roaQuarterlyIncrease: number | null;
  roaQuarterlyDecrease: number | null;
  roeQuarterlyIncrease: number | null;
  roeQuarterlyDecrease: number | null;
  grossMarginQuarterlyIncrease: number | null;
  grossMarginQuarterlyDecrease: number | null;
  debtEquityQuarterlyIncrease: number | null;
  debtEquityQuarterlyDecrease: number | null;
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
  bookValue: number | null;
  totalLiabilities: number | null;
  freeCashFlow: number | null;
  grossMargin: number | null;
  debtEquity: number | null;
  roa: number | null;
  roe: number | null;
  outstandingShares: number | null;
  epsQoQ: number | null;
  revenueQoQ: number | null;
  grossMarginQoQ: number | null;
  debtEquityQoQ : number | null;
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
  bookValue: string | null;
  totalLiabilities: string | null;
  freeCashFlow: string | null;
  grossMargin: string | null;
  debtEquity: string | null;
  roa: string | null;
  roe: string | null;
  outstandingShares: string | null;
  peRatio: string | null;
  pbRatio: string | null;
  psRatio: string | null;
  epsQoQ: string | null;
  grossMarginQoQ: string | null;
  revenueQoQ: string | null;
  debtEquityQoQ: string | null;
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
  grossMarginQoQ?: string | null;
  debtEquityQoQ?: string | null;
  eps?: string | null;
  ebitda?: string | null;
  netIncome?: string | null;
  grossProfit?: string | null;
  bookValue?: string | null;
  totalRevenue?: string | null;
  costOfRevenue?: string | null;
  peRatio?: string | null;
  pbRatio?: string | null;
  psRatio?: string | null;
  profitQuarterlyIncrease?: number | null;
  profitQuarterlyDecrease?: number | null;
  revenueQuarterlyIncrease?: number | null;
  revenueQuarterlyDecrease?: number | null;
  incomeQuarterlyIncrease?: number | null;
  incomeQuarterlyDecrease?: number | null;
  peYearlyIncrease?: number | null;
  peYearlyDecrease?: number | null;
  pbYearlyIncrease?: number | null;
  pbYearlyDecrease?: number | null;
  psYearlyIncrease?: number | null;
  psYearlyDecrease?: number | null;
  epsYearlyIncrease?: number | null;
  epsYearlyDecrease?: number | null;
  ebitdaYearlyIncrease?: number | null;
  ebitdaYearlyDecrease?: number | null;
  bookValueYearlyIncrease?: number | null;
  bookValueYearlyDecrease?: number | null;
  equityYearlyIncrease?: number | null;
  equityYearlyDecrease?: number | null;
  freeCashFlowYearlyIncrease?: number | null;
  freeCashFlowYearlyDecrease?: number | null;
  roaQuarterlyIncrease?: number | null;
  roaQuarterlyDecrease?: number | null;
  roeQuarterlyIncrease?: number | null;
  roeQuarterlyDecrease?: number | null;
  grossMarginQuarterlyIncrease?: number | null;
  grossMarginQuarterlyDecrease?: number | null;
  debtEquityQuarterlyIncrease?: number | null;
  debtEquityQuarterlyDecrease?: number | null;
}
