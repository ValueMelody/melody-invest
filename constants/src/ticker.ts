import * as interfaces from '@shared/interfaces'

export const DailyMovementKeys: interfaces.tickerDailyModel.MovementKey[] = [
  'priceDailyIncrease', 'priceDailyDecrease',
  'priceWeeklyIncrease', 'priceWeeklyDecrease',
  'priceMonthlyIncrease', 'priceMonthlyDecrease',
  'priceQuarterlyIncrease', 'priceQuarterlyDecrease',
  'priceYearlyIncrease', 'priceYearlyDecrease',
]

export const YearlyCompareKeys: interfaces.tickerYearlyModel.CompareKey[] = [
  'peRatio', 'pbRatio', 'psRatio',
]

export const YearlyMovementKeys: interfaces.tickerYearlyModel.MovementKey[] = [
  'revenueYearlyIncrease', 'revenueYearlyDecrease',
  'profitYearlyIncrease', 'profitYearlyDecrease',
  'incomeYearlyIncrease', 'incomeYearlyDecrease',
  'epsYearlyIncrease', 'epsYearlyDecrease',
  'ebitdaYearlyIncrease', 'ebitdaYearlyDecrease',
  'freeCashFlowYearlyIncrease', 'freeCashFlowYearlyDecrease',
  'peYearlyIncrease', 'peYearlyDecrease',
  'pbYearlyIncrease', 'pbYearlyDecrease',
  'psYearlyIncrease', 'psYearlyDecrease',
]

export const QuarterlyCompareKeys: interfaces.tickerQuarterlyModel.CompareKey[] = [
  'peRatio', 'pbRatio', 'psRatio',
  'roa', 'roe', 'grossMargin', 'debtEquity',
]

export const QuarterlyMovementKeys: interfaces.tickerQuarterlyModel.MovementKey[] = [
  'revenueQuarterlyIncrease', 'revenueQuarterlyDecrease',
  'profitQuarterlyIncrease', 'profitQuarterlyDecrease',
  'incomeQuarterlyIncrease', 'incomeQuarterlyDecrease',
  'epsQuarterlyIncrease', 'epsQuarterlyDecrease',
  'ebitdaQuarterlyIncrease', 'ebitdaQuarterlyDecrease',
  'freeCashFlowQuarterlyIncrease', 'freeCashFlowQuarterlyDecrease',
  'peQuarterlyIncrease', 'peQuarterlyDecrease',
  'pbQuarterlyIncrease', 'pbQuarterlyDecrease',
  'psQuarterlyIncrease', 'psQuarterlyDecrease',
  'roaQuarterlyIncrease', 'roaQuarterlyDecrease',
  'roeQuarterlyIncrease', 'roeQuarterlyDecrease',
  'grossMarginQuarterlyIncrease', 'grossMarginQuarterlyDecrease',
  'debtEquityQuarterlyIncrease', 'debtEquityQuarterlyDecrease',
]
