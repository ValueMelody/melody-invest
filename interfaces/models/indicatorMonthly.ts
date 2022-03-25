export type IndicatorKey =
  'fundsRate' | 'tenYearsTreasury' | 'thirtyYearsTreasury' | 'cpi' |
  'inflationExpectation' | 'consumerSentiment' | 'retailSales' |
  'durableGoods' | 'unemploymentRate' | 'nonfarmPayroll'

export type MovementKey =
  'fundsRateMonthlyIncrease' | 'fundsRateMonthlyDecrease' |
  'thirtyYearsTreasuryMonthlyIncrease' | 'thirtyYearsTreasuryMonthlyDecrease' |
  'tenYearsTreasuryMonthlyIncrease' | 'tenYearsTreasuryMonthlyDecrease' |
  'inflationMonthlyIncrease' | 'inflationMonthlyDecrease' |
  'cpiMonthlyIncrease' | 'cpiMonthlyDecrease' |
  'consumerSentimentMonthlyIncrease' | 'consumerSentimentMonthlyDecrease' |
  'retailSalesMonthlyIncrease' | 'retailSalesMonthlyDecrease' |
  'durableGoodsMonthlyIncrease' | 'durableGoodsMonthlyDecrease' |
  'unemploymentRateMonthlyIncrease' | 'unemploymentRateMonthlyDecrease' |
  'nonfarmPayrollMonthlyIncrease' | 'nonfarmPayrollMonthlyDecrease'

interface Common {
  id: number;
  month: string;
  fundsRateMonthlyIncrease: number | null;
  fundsRateMonthlyDecrease: number | null;
  thirtyYearsTreasuryMonthlyIncrease: number | null;
  thirtyYearsTreasuryMonthlyDecrease: number | null;
  tenYearsTreasuryMonthlyIncrease: number | null;
  tenYearsTreasuryMonthlyDecrease: number | null;
  inflationMonthlyIncrease: number | null;
  inflationMonthlyDecrease: number | null;
  cpiMonthlyIncrease: number | null;
  cpiMonthlyDecrease: number | null;
  consumerSentimentMonthlyIncrease: number | null;
  consumerSentimentMonthlyDecrease: number | null;
  retailSalesMonthlyIncrease: number | null;
  retailSalesMonthlyDecrease: number | null;
  durableGoodsMonthlyIncrease: number | null;
  durableGoodsMonthlyDecrease: number | null;
  unemploymentRateMonthlyIncrease: number | null;
  unemploymentRateMonthlyDecrease: number | null;
  nonfarmPayrollMonthlyIncrease: number | null;
  nonfarmPayrollMonthlyDecrease: number | null;
}

export interface Record extends Common {
  fundsRate: number | null;
  cpi: number | null;
  tenYearsTreasury: number | null;
  thirtyYearsTreasury: number | null;
  inflationExpectation: number | null;
  consumerSentiment: number | null;
  retailSales: number | null;
  durableGoods: number | null;
  unemploymentRate: number | null;
  nonfarmPayroll: number | null;
}

export interface Raw extends Common {
  fundsRate: string | null;
  cpi: string | null;
  tenYearsTreasury: string | null;
  thirtyYearsTreasury: string | null;
  inflationExpectation: string | null;
  consumerSentiment: string | null;
  retailSales: string | null;
  durableGoods: string | null;
  unemploymentRate: string | null;
  nonfarmPayroll: string | null;
}

export interface Create {
  month: string;
  fundsRate?: string;
  cpi?: string;
  tenYearsTreasury?: string;
  thirtyYearsTreasury?: string;
  inflationExpectation?: string;
  consumerSentiment?: string;
  retailSales?: string;
  durableGoods?: string;
  unemploymentRate?: string;
  nonfarmPayroll?: string;
}

export interface Update {
  fundsRate?: string;
  cpi?: string;
  tenYearsTreasury?: string;
  thirtyYearsTreasury?: string;
  inflationExpectation?: string;
  consumerSentiment?: string;
  retailSales?: string;
  durableGoods?: string;
  unemploymentRate?: string;
  nonfarmPayroll?: string;
  fundsRateMonthlyIncrease?: number | null;
  fundsRateMonthlyDecrease?: number | null;
  thirtyYearsTreasuryMonthlyIncrease?: number | null;
  thirtyYearsTreasuryMonthlyDecrease?: number | null;
  tenYearsTreasuryMonthlyIncrease?: number | null;
  tenYearsTreasuryMonthlyDecrease?: number | null;
  inflationMonthlyIncrease?: number | null;
  inflationMonthlyDecrease?: number | null;
  cpiMonthlyIncrease?: number | null;
  cpiMonthlyDecrease?: number | null;
  consumerSentimentMonthlyIncrease?: number | null;
  consumerSentimentMonthlyDecrease?: number | null;
  retailSalesMonthlyIncrease?: number | null;
  retailSalesMonthlyDecrease?: number | null;
  durableGoodsMonthlyIncrease?: number | null;
  durableGoodsMonthlyDecrease?: number | null;
  unemploymentRateMonthlyIncrease?: number | null;
  unemploymentRateMonthlyDecrease?: number | null;
  nonfarmPayrollMonthlyIncrease?: number | null;
  nonfarmPayrollMonthlyDecrease?: number | null;
}