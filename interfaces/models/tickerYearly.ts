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
  totalLiabilities: number | null;
  totalAssets: number | null;
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
  profitYearlyIncrease?: number | null;
  profitYearlyDecrease?: number | null;
  revenueYearlyIncrease?: number | null;
  revenueYearlyDecrease?: number | null;
  incomeYearlyIncrease?: number | null;
  incomeYearlyDecrease?: number | null;
}
