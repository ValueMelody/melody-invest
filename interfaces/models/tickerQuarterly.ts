export type MovementKey =
  'epsQuarterlyBeat' | 'epsQuarterlyMiss' |
  'incomeQuarterlyIncrease' | 'incomeQuarterlyDecrease' |
  'profitQuarterlyIncrease' | 'profitQuarterlyDecrease' |
  'revenueQuarterlyIncrease' | 'revenueQuarterlyDecrease'

interface Common {
  id: number;
  tickerId: number;
  quarter: string;
  earningDate: string | null;
  earningReportDate: string | null;
  epsQuarterlyBeat: number | null;
  epsQuarterlyMiss: number | null;
  profitQuarterlyIncrease: number | null;
  profitQuarterlyDecrease: number | null;
  revenueQuarterlyIncrease: number | null;
  revenueQuarterlyDecrease: number | null;
  incomeQuarterlyIncrease: number | null;
  incomeQuarterlyDecrease: number | null;
}

export interface Record extends Common {
  eps: number | null;
  estimatedEPS: number | null;
  epsSurprisePercent: number | null;
  ebitda: number | null;
  netIncome: number | null;
  grossProfit: number | null;
  totalRevenue: number | null;
  costOfRevenue: number | null;
}

export interface Raw extends Common {
  eps: string | null;
  estimatedEPS: string | null;
  epsSurprisePercent: string | null;
  ebitda: string | null;
  netIncome: string | null;
  grossProfit: string | null;
  totalRevenue: string | null;
  costOfRevenue: string | null;
}

export interface Create {
  tickerId: number;
  quarter: string;
  earningDate?: string;
  earningReportDate?: string;
  eps?: string | null;
  estimatedEPS?: string | null;
  epsSurprisePercent?: string | null;
  ebitda?: string | null;
  netIncome?: string | null;
  grossProfit?: string | null;
  totalRevenue?: string | null;
  costOfRevenue?: string | null;
}

export interface Update {
  earningDate?: string;
  earningReportDate?: string;
  eps?: string | null;
  estimatedEPS?: string | null;
  epsSurprisePercent?: string | null;
  ebitda?: string | null;
  netIncome?: string | null;
  grossProfit?: string | null;
  totalRevenue?: string | null;
  costOfRevenue?: string | null;
  epsQuarterlyBeat?: number | null;
  epsQuarterlyMiss?: number | null;
  profitQuarterlyIncrease?: number | null;
  profitQuarterlyDecrease?: number | null;
  revenueQuarterlyIncrease?: number | null;
  revenueQuarterlyDecrease?: number | null;
  incomeQuarterlyIncrease?: number | null;
  incomeQuarterlyDecrease?: number | null;
}
