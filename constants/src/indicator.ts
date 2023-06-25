import * as interfaces from '@shared/interfaces'

export const IndicatorMonthlyCompareKeys: interfaces.indicatorMonthlyModel.CompareKey[] = [
  'fundsRate', 'tenYearsTreasury', 'thirtyYearsTreasury',
  'inflation', 'consumerSentiment', 'nonfarmPayroll',
]

export const IndicatorMonthlyMovementKeys: interfaces.indicatorMonthlyModel.MovementKey[] = [
  'fundsRateMonthlyIncrease', 'fundsRateMonthlyDecrease',
  'thirtyYearsTreasuryMonthlyIncrease', 'thirtyYearsTreasuryMonthlyDecrease',
  'tenYearsTreasuryMonthlyIncrease', 'tenYearsTreasuryMonthlyDecrease',
  'inflationMonthlyIncrease', 'inflationMonthlyDecrease',
  'cpiMonthlyIncrease', 'cpiMonthlyDecrease',
  'consumerSentimentMonthlyIncrease', 'consumerSentimentMonthlyDecrease',
  'unemploymentRateMonthlyIncrease', 'unemploymentRateMonthlyDecrease',
  'nonfarmPayrollMonthlyIncrease', 'nonfarmPayrollMonthlyDecrease',
]

export const IndicatorQuarterlyCompareKeys: interfaces.indicatorQuarterlyModel.CompareKey[] = [
  'seasonalGDPQoQ', 'seasonalGDPYoY',
]

export const IndicatorQuarterlyMovementKeys: interfaces.indicatorQuarterlyModel.MovementKey[] = [
  'seasonalGDPQuarterlyIncrease', 'seasonalGDPQuarterlyDecrease',
]

export const IndicatorYearlyCompareKeys: interfaces.indicatorYearlyModel.CompareKey[] = [
  'gdpYearlyChangePercent', 'annualInflation',
]

export const IndicatorYearlyMovementKeys: interfaces.indicatorYearlyModel.MovementKey[] = [
  'inflationYearlyIncrease', 'inflationYearlyDecrease',
  'gdpYearlyIncrease', 'gdpYearlyDecrease',
]
