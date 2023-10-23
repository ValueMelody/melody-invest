export type MovementIncreaseKey =
  'incomeYearlyIncrease' | 'profitYearlyIncrease' |
  'revenueYearlyIncrease' | 'peYearlyIncrease' |
  'pbYearlyIncrease' | 'psYearlyIncrease' |
  'epsYearlyIncrease' | 'ebitdaYearlyIncrease' |
  'freeCashFlowYearlyIncrease'

export type MovementDecreaseKey =
  'incomeYearlyDecrease' | 'profitYearlyDecrease' |
  'revenueYearlyDecrease' | 'peYearlyDecrease' |
  'pbYearlyDecrease' | 'psYearlyDecrease' |
  'epsYearlyDecrease' | 'ebitdaYearlyDecrease' |
  'freeCashFlowYearlyDecrease'

export type MovementKey = MovementIncreaseKey | MovementDecreaseKey

export type CompareKey = 'annualPeRatio' | 'annualPbRatio' | 'annualPsRatio'

interface Common {
  id: number;
  tickerId: number;
  year: string;
  earningDate: string;
  peRatio: string | null;
  pbRatio: string | null;
  psRatio: string | null;
  profitYearlyIncrease: number | null;
  profitYearlyDecrease: number | null;
  revenueYearlyIncrease: number | null;
  revenueYearlyDecrease: number | null;
  incomeYearlyIncrease: number | null;
  incomeYearlyDecrease: number | null;
  peYearlyIncrease: number | null;
  peYearlyDecrease: number | null;
  pbYearlyIncrease: number | null;
  pbYearlyDecrease: number | null;
  psYearlyIncrease: number | null;
  psYearlyDecrease: number | null;
  epsYearlyIncrease: number | null;
  epsYearlyDecrease: number | null;
  ebitdaYearlyIncrease: number | null;
  ebitdaYearlyDecrease: number | null;
  bookValueYearlyIncrease: number | null;
  bookValueYearlyDecrease: number | null;
  equityYearlyIncrease: number | null;
  equityYearlyDecrease: number | null;
  freeCashFlowYearlyIncrease: number | null;
  freeCashFlowYearlyDecrease: number | null;
}

export interface Record extends Common {
  eps: number | null;
  ebitda: number | null;
  netIncome: number | null;
  grossProfit: number | null;
  totalRevenue: number | null;
  costOfRevenue: number | null;
  totalLiabilities: number | null;
  totalAssets: number | null;
  bookValue: number | null;
  equity: number | null;
  outstandingShares: number | null;
  freeCashFlow: number | null;
}

export interface Raw extends Common {
  eps: string | null;
  ebitda: string | null;
  netIncome: string | null;
  grossProfit: string | null;
  totalRevenue: string | null;
  costOfRevenue: string | null;
  totalLiabilities: string | null;
  totalAssets: string | null;
  bookValue: string | null;
  equity: string | null;
  outstandingShares: string | null;
  freeCashFlow: string | null;
}

export interface Create {
  tickerId: number;
  year: string;
  earningDate: string;
  eps: string | null;
  ebitda: string | null;
  netIncome: string | null;
  grossProfit: string | null;
  totalRevenue: string | null;
  costOfRevenue: string | null;
  totalLiabilities: string | null;
  totalAssets: string | null;
  equity: string | null;
  outstandingShares: string | null;
  freeCashFlow: string | null;
}

export interface Update {
  earningDate?: string;
  eps?: string | null;
  ebitda?: string | null;
  netIncome?: string | null;
  grossProfit?: string | null;
  totalRevenue?: string | null;
  costOfRevenue?: string | null;
  totalLiabilities?: string | null;
  totalAssets?: string | null;
  bookValue?: string | null;
  equity?: string | null;
  outstandingShares?: string | null;
  freeCashFlow?: string | null;
  peRatio?: string | null;
  pbRatio?: string | null;
  psRatio?: string | null;
  profitYearlyIncrease?: number | null;
  profitYearlyDecrease?: number | null;
  revenueYearlyIncrease?: number | null;
  revenueYearlyDecrease?: number | null;
  incomeYearlyIncrease?: number | null;
  incomeYearlyDecrease?: number | null;
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
}
