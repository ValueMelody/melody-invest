export interface Create {
  hashCode: string;
  priceDailyIncreaseBuy?: number | null;
  priceDailyIncreaseSell?: number | null;
  priceDailyDecreaseBuy?: number | null;
  priceDailyDecreaseSell?: number | null;
  priceWeeklyIncreaseBuy?: number | null;
  priceWeeklyIncreaseSell?: number | null;
  priceWeeklyDecreaseBuy?: number | null;
  priceWeeklyDecreaseSell?: number | null;
  priceMonthlyIncreaseBuy?: number | null;
  priceMonthlyIncreaseSell?: number | null;
  priceMonthlyDecreaseBuy?: number | null;
  priceMonthlyDecreaseSell?: number | null;
  priceQuarterlyIncreaseBuy?: number | null;
  priceQuarterlyIncreaseSell?: number | null;
  priceQuarterlyDecreaseBuy?: number | null;
  priceQuarterlyDecreaseSell?: number | null;
  priceYearlyIncreaseBuy?: number | null;
  priceYearlyIncreaseSell?: number | null;
  priceYearlyDecreaseBuy?: number | null;
  priceYearlyDecreaseSell?: number | null;
  profitQuarterlyIncreaseBuy?: number | null;
  profitQuarterlyDecreaseBuy?: number | null;
  incomeQuarterlyIncreaseBuy?: number | null;
  incomeQuarterlyDecreaseBuy?: number | null;
  revenueQuarterlyIncreaseBuy?: number | null;
  revenueQuarterlyDecreaseBuy?: number | null;
  profitQuarterlyIncreaseSell?: number | null;
  profitQuarterlyDecreaseSell?: number | null;
  incomeQuarterlyIncreaseSell?: number | null;
  incomeQuarterlyDecreaseSell?: number | null;
  revenueQuarterlyIncreaseSell?: number | null;
  revenueQuarterlyDecreaseSell?: number | null;
  profitYearlyIncreaseBuy?: number | null;
  profitYearlyDecreaseBuy?: number | null;
  incomeYearlyIncreaseBuy?: number | null;
  incomeYearlyDecreaseBuy?: number | null;
  revenueYearlyIncreaseBuy?: number | null;
  revenueYearlyDecreaseBuy?: number | null;
  profitYearlyIncreaseSell?: number | null;
  profitYearlyDecreaseSell?: number | null;
  incomeYearlyIncreaseSell?: number | null;
  incomeYearlyDecreaseSell?: number | null;
  revenueYearlyIncreaseSell?: number | null;
  revenueYearlyDecreaseSell?: number | null;
  inflationYearlyIncreaseBuy?: number | null;
  inflationYearlyDecreaseBuy?: number | null;
  inflationYearlyIncreaseSell?: number | null;
  inflationYearlyDecreaseSell?: number | null;
  fundsRateMonthlyIncreaseBuy?: number | null;
  fundsRateMonthlyDecreaseBuy?: number | null;
  fundsRateMonthlyIncreaseSell?: number | null;
  fundsRateMonthlyDecreaseSell?: number | null;
  thirtyYearsTreasuryMonthlyIncreaseBuy?: number | null;
  thirtyYearsTreasuryMonthlyDecreaseBuy?: number | null;
  thirtyYearsTreasuryMonthlyIncreaseSell?: number | null;
  thirtyYearsTreasuryMonthlyDecreaseSell?: number | null;
  tenYearsTreasuryMonthlyIncreaseBuy?: number | null;
  tenYearsTreasuryMonthlyDecreaseBuy?: number | null;
  tenYearsTreasuryMonthlyIncreaseSell?: number | null;
  tenYearsTreasuryMonthlyDecreaseSell?: number | null;
  inflationMonthlyIncreaseBuy?: number | null;
  inflationMonthlyDecreaseBuy?: number | null;
  inflationMonthlyIncreaseSell?: number | null;
  inflationMonthlyDecreaseSell?: number | null;
  cpiMonthlyIncreaseBuy?: number | null;
  cpiMonthlyDecreaseBuy?: number | null;
  cpiMonthlyIncreaseSell?: number | null;
  cpiMonthlyDecreaseSell?: number | null;
  consumerSentimentMonthlyIncreaseBuy?: number | null;
  consumerSentimentMonthlyDecreaseBuy?: number | null;
  consumerSentimentMonthlyIncreaseSell?: number | null;
  consumerSentimentMonthlyDecreaseSell?: number | null;
  unemploymentRateMonthlyIncreaseBuy?: number | null;
  unemploymentRateMonthlyDecreaseBuy?: number | null;
  unemploymentRateMonthlyIncreaseSell?: number | null;
  unemploymentRateMonthlyDecreaseSell?: number | null;
  nonfarmPayrollMonthlyIncreaseBuy?: number | null;
  nonfarmPayrollMonthlyDecreaseBuy?: number | null;
  nonfarmPayrollMonthlyIncreaseSell?: number | null;
  nonfarmPayrollMonthlyDecreaseSell?: number | null;
  gdpYearlyChangeAboveBuy?: number | null;
  gdpYearlyChangeAboveSell?: number | null;
  gdpYearlyChangeBelowBuy?: number | null;
  gdpYearlyChangeBelowSell?: number | null;
  seasonalGDPQoQAboveBuy?: number | null;
  seasonalGDPQoQAboveSell?: number | null;
  seasonalGDPQoQBelowBuy?: number | null;
  seasonalGDPQoQBelowSell?: number | null;
  seasonalGDPYoYAboveBuy?: number | null;
  seasonalGDPYoYAboveSell?: number | null;
  seasonalGDPYoYBelowBuy?: number | null;
  seasonalGDPYoYBelowSell?: number | null;
  peQuarterlyIncreaseBuy?: number | null;
  peQuarterlyIncreaseSell?: number | null;
  peQuarterlyDecreaseBuy?: number | null;
  peQuarterlyDecreaseSell?: number | null;
  pbQuarterlyIncreaseBuy?: number | null;
  pbQuarterlyIncreaseSell?: number | null;
  pbQuarterlyDecreaseBuy?: number | null;
  pbQuarterlyDecreaseSell?: number | null;
  psQuarterlyIncreaseBuy?: number | null;
  psQuarterlyIncreaseSell?: number | null;
  psQuarterlyDecreaseBuy?: number | null;
  psQuarterlyDecreaseSell?: number | null;
  epsQuarterlyIncreaseBuy?: number | null;
  epsQuarterlyIncreaseSell?: number | null;
  epsQuarterlyDecreaseBuy?: number | null;
  epsQuarterlyDecreaseSell?: number | null;
  ebitdaQuarterlyIncreaseBuy?: number | null;
  ebitdaQuarterlyIncreaseSell?: number | null;
  ebitdaQuarterlyDecreaseBuy?: number | null;
  ebitdaQuarterlyDecreaseSell?: number | null;
  freeCashFlowQuarterlyIncreaseBuy?: number | null;
  freeCashFlowQuarterlyIncreaseSell?: number | null;
  freeCashFlowQuarterlyDecreaseBuy?: number | null;
  freeCashFlowQuarterlyDecreaseSell?: number | null;
  roaQuarterlyIncreaseBuy?: number | null;
  roaQuarterlyIncreaseSell?: number | null;
  roaQuarterlyDecreaseBuy?: number | null;
  roaQuarterlyDecreaseSell?: number | null;
  roeQuarterlyIncreaseBuy?: number | null;
  roeQuarterlyIncreaseSell?: number | null;
  roeQuarterlyDecreaseBuy?: number | null;
  roeQuarterlyDecreaseSell?: number | null;
  grossMarginQuarterlyIncreaseBuy?: number | null;
  grossMarginQuarterlyIncreaseSell?: number | null;
  grossMarginQuarterlyDecreaseBuy?: number | null;
  grossMarginQuarterlyDecreaseSell?: number | null;
  debtEquityQuarterlyIncreaseBuy?: number | null;
  debtEquityQuarterlyIncreaseSell?: number | null;
  debtEquityQuarterlyDecreaseBuy?: number | null;
  debtEquityQuarterlyDecreaseSell?: number | null;
  peRatioQuarterlyAboveBuy?: number | null;
  peRatioQuarterlyAboveSell?: number | null;
  peRatioQuarterlyBelowBuy?: number | null;
  peRatioQuarterlyBelowSell?: number | null;
  pbRatioQuarterlyAboveBuy?: number | null;
  pbRatioQuarterlyAboveSell?: number | null;
  pbRatioQuarterlyBelowBuy?: number | null;
  pbRatioQuarterlyBelowSell?: number | null;
  psRatioQuarterlyAboveBuy?: number | null;
  psRatioQuarterlyAboveSell?: number | null;
  psRatioQuarterlyBelowBuy?: number | null;
  psRatioQuarterlyBelowSell?: number | null;
  roaQuarterlyAboveBuy?: number | null;
  roaQuarterlyAboveSell?: number | null;
  roaQuarterlyBelowBuy?: number | null;
  roaQuarterlyBelowSell?: number | null;
  roeQuarterlyAboveBuy?: number | null;
  roeQuarterlyAboveSell?: number | null;
  roeQuarterlyBelowBuy?: number | null;
  roeQuarterlyBelowSell?: number | null;
  grossMarginQuarterlyAboveBuy?: number | null;
  grossMarginQuarterlyAboveSell?: number | null;
  grossMarginQuarterlyBelowBuy?: number | null;
  grossMarginQuarterlyBelowSell?: number | null;
  debtEquityQuarterlyAboveBuy?: number | null;
  debtEquityQuarterlyAboveSell?: number | null;
  debtEquityQuarterlyBelowBuy?: number | null;
  debtEquityQuarterlyBelowSell?: number | null;
  peYearlyIncreaseBuy?: number | null;
  peYearlyIncreaseSell?: number | null;
  peYearlyDecreaseBuy?: number | null;
  peYearlyDecreaseSell?: number | null;
  pbYearlyIncreaseBuy?: number | null;
  pbYearlyIncreaseSell?: number | null;
  pbYearlyDecreaseBuy?: number | null;
  pbYearlyDecreaseSell?: number | null;
  psYearlyIncreaseBuy?: number | null;
  psYearlyIncreaseSell?: number | null;
  psYearlyDecreaseBuy?: number | null;
  psYearlyDecreaseSell?: number | null;
  epsYearlyIncreaseBuy?: number | null;
  epsYearlyIncreaseSell?: number | null;
  epsYearlyDecreaseBuy?: number | null;
  epsYearlyDecreaseSell?: number | null;
  ebitdaYearlyIncreaseBuy?: number | null;
  ebitdaYearlyIncreaseSell?: number | null;
  ebitdaYearlyDecreaseBuy?: number | null;
  ebitdaYearlyDecreaseSell?: number | null;
  freeCashFlowYearlyIncreaseBuy?: number | null;
  freeCashFlowYearlyIncreaseSell?: number | null;
  freeCashFlowYearlyDecreaseBuy?: number | null;
  freeCashFlowYearlyDecreaseSell?: number | null;
  peRatioYearlyAboveBuy?: number | null;
  peRatioYearlyAboveSell?: number | null;
  peRatioYearlyBelowBuy?: number | null;
  peRatioYearlyBelowSell?: number | null;
  pbRatioYearlyAboveBuy?: number | null;
  pbRatioYearlyAboveSell?: number | null;
  pbRatioYearlyBelowBuy?: number | null;
  pbRatioYearlyBelowSell?: number | null;
  psRatioYearlyAboveBuy?: number | null;
  psRatioYearlyAboveSell?: number | null;
  psRatioYearlyBelowBuy?: number | null;
  psRatioYearlyBelowSell?: number | null;
  fundsRateMonthlyAboveBuy?: number | null;
  fundsRateMonthlyAboveSell?: number | null;
  fundsRateMonthlyBelowBuy?: number | null;
  fundsRateMonthlyBelowSell?: number | null;
  tenYearsTreasuryMonthlyAboveBuy?: number | null;
  tenYearsTreasuryMonthlyAboveSell?: number | null;
  tenYearsTreasuryMonthlyBelowBuy?: number | null;
  tenYearsTreasuryMonthlyBelowSell?: number | null;
  thirtyYearsTreasuryMonthlyAboveBuy?: number | null;
  thirtyYearsTreasuryMonthlyAboveSell?: number | null;
  thirtyYearsTreasuryMonthlyBelowBuy?: number | null;
  thirtyYearsTreasuryMonthlyBelowSell?: number | null;
  inflationMonthlyAboveBuy?: number | null;
  inflationMonthlyAboveSell?: number | null;
  inflationMonthlyBelowBuy?: number | null;
  inflationMonthlyBelowSell?: number | null;
  consumerSentimentMonthlyAboveBuy?: number | null;
  consumerSentimentMonthlyAboveSell?: number | null;
  consumerSentimentMonthlyBelowBuy?: number | null;
  consumerSentimentMonthlyBelowSell?: number | null;
  nonfarmPayrollMonthlyAboveBuy?: number | null;
  nonfarmPayrollMonthlyAboveSell?: number | null;
  nonfarmPayrollMonthlyBelowBuy?: number | null;
  nonfarmPayrollMonthlyBelowSell?: number | null;
  seasonalGDPQuarterlyIncreaseBuy?: number | null;
  seasonalGDPQuarterlyIncreaseSell?: number | null;
  seasonalGDPQuarterlyDecreaseBuy?: number | null;
  seasonalGDPQuarterlyDecreaseSell?: number | null;
  gdpYearlyIncreaseBuy?: number | null;
  gdpYearlyIncreaseSell?: number | null;
  gdpYearlyDecreaseBuy?: number | null;
  gdpYearlyDecreaseSell?: number | null;
  inflationYearlyAboveBuy?: number | null;
  inflationYearlyAboveSell?: number | null;
  inflationYearlyBelowBuy?: number | null;
  inflationYearlyBelowSell?: number | null;
  buyPreference: number;
  sellPreference: number;
  cashMaxPercent: number;
  tickerMinPercent: number;
  tickerMaxPercent: number;
  holdingBuyPercent: number;
  holdingSellPercent: number;
  tradeFrequency: number;
  rebalanceFrequency: number;
}

export interface Record extends Create {
  id: number;
  hashCode: string;
}

export interface Update {
  hashCode: string;
}

export type TickerMovementBuyBehavior =
  'priceDailyIncreaseBuy' | 'priceDailyDecreaseBuy' |
  'priceWeeklyIncreaseBuy' | 'priceWeeklyDecreaseBuy' |
  'priceMonthlyIncreaseBuy' | 'priceMonthlyDecreaseBuy' |
  'priceQuarterlyIncreaseBuy' | 'priceQuarterlyDecreaseBuy' |
  'priceYearlyIncreaseBuy' | 'priceYearlyDecreaseBuy' |
  'profitQuarterlyIncreaseBuy' | 'profitQuarterlyDecreaseBuy' |
  'incomeQuarterlyIncreaseBuy' | 'incomeQuarterlyDecreaseBuy' |
  'revenueQuarterlyIncreaseBuy' | 'revenueQuarterlyDecreaseBuy' |
  'profitYearlyIncreaseBuy' | 'profitYearlyDecreaseBuy' |
  'incomeYearlyIncreaseBuy' | 'incomeYearlyDecreaseBuy' |
  'revenueYearlyIncreaseBuy' | 'revenueYearlyDecreaseBuy' |
  'peQuarterlyIncreaseBuy' | 'peQuarterlyDecreaseBuy' |
  'pbQuarterlyIncreaseBuy' | 'pbQuarterlyDecreaseBuy' |
  'psQuarterlyIncreaseBuy' | 'psQuarterlyDecreaseBuy' |
  'epsQuarterlyIncreaseBuy' | 'epsQuarterlyDecreaseBuy' |
  'ebitdaQuarterlyIncreaseBuy' | 'ebitdaQuarterlyDecreaseBuy' |
  'freeCashFlowQuarterlyIncreaseBuy' | 'freeCashFlowQuarterlyDecreaseBuy' |
  'roaQuarterlyIncreaseBuy' | 'roaQuarterlyDecreaseBuy' |
  'roeQuarterlyIncreaseBuy' | 'roeQuarterlyDecreaseBuy' |
  'grossMarginQuarterlyIncreaseBuy' | 'grossMarginQuarterlyDecreaseBuy' |
  'debtEquityQuarterlyIncreaseBuy' | 'debtEquityQuarterlyDecreaseBuy' |
  'peYearlyIncreaseBuy'| 'peYearlyDecreaseBuy' |
  'pbYearlyIncreaseBuy' | 'pbYearlyDecreaseBuy' |
  'psYearlyIncreaseBuy' | 'psYearlyDecreaseBuy' |
  'epsYearlyIncreaseBuy' | 'epsYearlyDecreaseBuy' |
  'ebitdaYearlyIncreaseBuy' | 'ebitdaYearlyDecreaseBuy' |
  'freeCashFlowYearlyIncreaseBuy' | 'freeCashFlowYearlyDecreaseBuy'

export type TickerCompareBuyBehavior =
  'peRatioQuarterlyAboveBuy' | 'peRatioQuarterlyBelowBuy' |
  'pbRatioQuarterlyAboveBuy' | 'pbRatioQuarterlyBelowBuy' |
  'psRatioQuarterlyAboveBuy' | 'psRatioQuarterlyBelowBuy' |
  'roaQuarterlyAboveBuy' | 'roaQuarterlyBelowBuy' |
  'roeQuarterlyAboveBuy' | 'roeQuarterlyBelowBuy' |
  'grossMarginQuarterlyAboveBuy' | 'grossMarginQuarterlyBelowBuy' |
  'debtEquityQuarterlyAboveBuy' | 'debtEquityQuarterlyBelowBuy' |
  'peRatioYearlyAboveBuy' | 'peRatioYearlyBelowBuy' |
  'pbRatioYearlyAboveBuy' | 'pbRatioYearlyBelowBuy' |
  'psRatioYearlyAboveBuy' | 'psRatioYearlyBelowBuy'

export type TickerMovementSellBehavior =
  'priceDailyIncreaseSell' | 'priceDailyDecreaseSell' |
  'priceWeeklyIncreaseSell' | 'priceWeeklyDecreaseSell' |
  'priceMonthlyIncreaseSell' | 'priceMonthlyDecreaseSell' |
  'priceQuarterlyIncreaseSell' | 'priceQuarterlyDecreaseSell' |
  'priceYearlyIncreaseSell' | 'priceYearlyDecreaseSell' |
  'profitQuarterlyIncreaseSell' | 'profitQuarterlyDecreaseSell' |
  'incomeQuarterlyIncreaseSell' | 'incomeQuarterlyDecreaseSell' |
  'revenueQuarterlyIncreaseSell' | 'revenueQuarterlyDecreaseSell' |
  'profitYearlyIncreaseSell' | 'profitYearlyDecreaseSell' |
  'incomeYearlyIncreaseSell' | 'incomeYearlyDecreaseSell' |
  'revenueYearlyIncreaseSell' | 'revenueYearlyDecreaseSell' |
  'peQuarterlyIncreaseSell' | 'peQuarterlyDecreaseSell' |
  'pbQuarterlyIncreaseSell' | 'pbQuarterlyDecreaseSell' |
  'psQuarterlyIncreaseSell' | 'psQuarterlyDecreaseSell' |
  'epsQuarterlyIncreaseSell' | 'epsQuarterlyDecreaseSell' |
  'ebitdaQuarterlyIncreaseSell' | 'ebitdaQuarterlyDecreaseSell' |
  'freeCashFlowQuarterlyIncreaseSell' | 'freeCashFlowQuarterlyDecreaseSell' |
  'roaQuarterlyIncreaseSell' | 'roaQuarterlyDecreaseSell' |
  'roeQuarterlyIncreaseSell' | 'roeQuarterlyDecreaseSell' |
  'grossMarginQuarterlyIncreaseSell' | 'grossMarginQuarterlyDecreaseSell' |
  'debtEquityQuarterlyIncreaseSell' | 'debtEquityQuarterlyDecreaseSell' |
  'peYearlyIncreaseSell' | 'peYearlyDecreaseSell' |
  'pbYearlyIncreaseSell' | 'pbYearlyDecreaseSell' |
  'psYearlyIncreaseSell' | 'psYearlyDecreaseSell' |
  'epsYearlyIncreaseSell' | 'epsYearlyDecreaseSell' |
  'ebitdaYearlyIncreaseSell' | 'ebitdaYearlyDecreaseSell' |
  'freeCashFlowYearlyIncreaseSell' | 'freeCashFlowYearlyDecreaseSell'

export type TickerCompareSellBehavior =
  'peRatioQuarterlyAboveSell' | 'peRatioQuarterlyBelowSell' |
  'pbRatioQuarterlyAboveSell' | 'pbRatioQuarterlyBelowSell' |
  'psRatioQuarterlyAboveSell' | 'psRatioQuarterlyBelowSell' |
  'roaQuarterlyAboveSell' | 'roaQuarterlyBelowSell' |
  'roeQuarterlyAboveSell' | 'roeQuarterlyBelowSell' |
  'grossMarginQuarterlyAboveSell' | 'grossMarginQuarterlyBelowSell' |
  'debtEquityQuarterlyAboveSell' | 'debtEquityQuarterlyBelowSell' |
  'peRatioYearlyAboveSell' |'peRatioYearlyBelowSell' |
  'pbRatioYearlyAboveSell' | 'pbRatioYearlyBelowSell' |
  'psRatioYearlyAboveSell' | 'psRatioYearlyBelowSell'

export type IndicatorMovementBuyBehavior =
  'inflationYearlyIncreaseBuy' | 'inflationYearlyDecreaseBuy' |
  'fundsRateMonthlyIncreaseBuy' | 'fundsRateMonthlyDecreaseBuy' |
  'thirtyYearsTreasuryMonthlyIncreaseBuy' | 'thirtyYearsTreasuryMonthlyDecreaseBuy' |
  'tenYearsTreasuryMonthlyIncreaseBuy' | 'tenYearsTreasuryMonthlyDecreaseBuy' |
  'inflationMonthlyIncreaseBuy' | 'inflationMonthlyDecreaseBuy' |
  'cpiMonthlyIncreaseBuy' | 'cpiMonthlyDecreaseBuy' |
  'consumerSentimentMonthlyIncreaseBuy' | 'consumerSentimentMonthlyDecreaseBuy' |
  'unemploymentRateMonthlyIncreaseBuy' | 'unemploymentRateMonthlyDecreaseBuy' |
  'nonfarmPayrollMonthlyIncreaseBuy' | 'nonfarmPayrollMonthlyDecreaseBuy' |
  'seasonalGDPQuarterlyIncreaseBuy' | 'seasonalGDPQuarterlyDecreaseBuy' |
  'gdpYearlyIncreaseBuy' | 'gdpYearlyDecreaseBuy'

export type IndicatorMovementSellBehavior =
  'inflationYearlyIncreaseSell' | 'inflationYearlyDecreaseSell' |
  'fundsRateMonthlyIncreaseSell' | 'fundsRateMonthlyDecreaseSell' |
  'thirtyYearsTreasuryMonthlyIncreaseSell' | 'thirtyYearsTreasuryMonthlyDecreaseSell' |
  'tenYearsTreasuryMonthlyIncreaseSell' | 'tenYearsTreasuryMonthlyDecreaseSell' |
  'inflationMonthlyIncreaseSell' | 'inflationMonthlyDecreaseSell' |
  'cpiMonthlyIncreaseSell' | 'cpiMonthlyDecreaseSell' |
  'consumerSentimentMonthlyIncreaseSell' | 'consumerSentimentMonthlyDecreaseSell' |
  'unemploymentRateMonthlyIncreaseSell' | 'unemploymentRateMonthlyDecreaseSell' |
  'nonfarmPayrollMonthlyIncreaseSell' | 'nonfarmPayrollMonthlyDecreaseSell' |
  'seasonalGDPQuarterlyIncreaseSell' | 'seasonalGDPQuarterlyDecreaseSell' |
  'gdpYearlyIncreaseSell' | 'gdpYearlyDecreaseSell'

export type IndicatorCompareBuyBehavior =
  'gdpYearlyChangeAboveBuy' | 'gdpYearlyChangeBelowBuy' |
  'seasonalGDPQoQAboveBuy' | 'seasonalGDPQoQBelowBuy' |
  'seasonalGDPYoYAboveBuy' | 'seasonalGDPYoYBelowBuy' |
  'fundsRateMonthlyAboveBuy' | 'fundsRateMonthlyBelowBuy' |
  'tenYearsTreasuryMonthlyAboveBuy' | 'tenYearsTreasuryMonthlyBelowBuy' |
  'thirtyYearsTreasuryMonthlyAboveBuy' | 'thirtyYearsTreasuryMonthlyBelowBuy' |
  'inflationMonthlyAboveBuy' | 'inflationMonthlyBelowBuy' |
  'consumerSentimentMonthlyAboveBuy' | 'consumerSentimentMonthlyBelowBuy' |
  'nonfarmPayrollMonthlyAboveBuy' | 'nonfarmPayrollMonthlyBelowBuy' |
  'inflationYearlyAboveBuy' | 'inflationYearlyBelowBuy'

export type IndicatorCompareSellBehavior =
  'gdpYearlyChangeAboveSell' | 'gdpYearlyChangeBelowSell' |
  'seasonalGDPQoQAboveSell' | 'seasonalGDPQoQBelowSell' |
  'seasonalGDPYoYAboveSell' | 'seasonalGDPYoYBelowSell' |
  'fundsRateMonthlyAboveSell' | 'fundsRateMonthlyBelowSell' |
  'tenYearsTreasuryMonthlyAboveSell' | 'tenYearsTreasuryMonthlyBelowSell' |
  'thirtyYearsTreasuryMonthlyAboveSell' | 'thirtyYearsTreasuryMonthlyBelowSell' |
  'inflationMonthlyAboveSell' | 'inflationMonthlyBelowSell' |
  'consumerSentimentMonthlyAboveSell' | 'consumerSentimentMonthlyBelowSell' |
  'nonfarmPayrollMonthlyAboveSell' | 'nonfarmPayrollMonthlyBelowSell' |
  'inflationYearlyAboveSell' | 'inflationYearlyBelowSell'

export type TickerMovementBehavior = TickerMovementBuyBehavior | TickerMovementSellBehavior
export type TickerCompareBehavior = TickerCompareBuyBehavior | TickerCompareSellBehavior

export type IndicatorMovementBehavior = IndicatorMovementBuyBehavior | IndicatorMovementSellBehavior
export type indicatorCompareBehavior = IndicatorCompareBuyBehavior | IndicatorCompareSellBehavior

export type MovementBuyBehavior = TickerMovementBuyBehavior | IndicatorMovementBuyBehavior
export type CompareBuyBehavior = TickerCompareBuyBehavior | IndicatorCompareBuyBehavior
export type BuyBehavior = MovementBuyBehavior | CompareBuyBehavior

export type MovementSellBehavior = TickerMovementSellBehavior | IndicatorMovementSellBehavior
export type CompareSellBehavior = TickerCompareSellBehavior | IndicatorCompareSellBehavior
export type SellBehavior = MovementSellBehavior | CompareSellBehavior

export type MovementBehavior = MovementBuyBehavior | MovementSellBehavior
export type CompareBehavior = CompareBuyBehavior | CompareSellBehavior

export type preferenceBehavior = 'buyPreference' | 'sellPreference'

export type allocateBehavior = 'cashMaxPercent' |
  'tickerMinPercent' | 'tickerMaxPercent' |
  'holdingBuyPercent' | 'holdingSellPercent'

export type frequencyBehavior = 'tradeFrequency' | 'rebalanceFrequency'

export type Behavior =
  BuyBehavior | SellBehavior | allocateBehavior | frequencyBehavior | preferenceBehavior
