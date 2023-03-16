export interface Public {
  id: number;
  priceDailyIncreaseBuy: number | null;
  priceDailyIncreaseSell: number | null;
  priceDailyDecreaseBuy: number | null;
  priceDailyDecreaseSell: number | null;
  priceWeeklyIncreaseBuy: number | null;
  priceWeeklyIncreaseSell: number | null;
  priceWeeklyDecreaseBuy: number | null;
  priceWeeklyDecreaseSell: number | null;
  priceMonthlyIncreaseBuy: number | null;
  priceMonthlyIncreaseSell: number | null;
  priceMonthlyDecreaseBuy: number | null;
  priceMonthlyDecreaseSell: number | null;
  priceQuarterlyIncreaseBuy: number | null;
  priceQuarterlyIncreaseSell: number | null;
  priceQuarterlyDecreaseBuy: number | null;
  priceQuarterlyDecreaseSell: number | null;
  priceYearlyIncreaseBuy: number | null;
  priceYearlyIncreaseSell: number | null;
  priceYearlyDecreaseBuy: number | null;
  priceYearlyDecreaseSell: number | null;
  cashMaxPercent: number;
  tickerMinPercent: number;
  tickerMaxPercent: number;
  holdingBuyPercent: number;
  holdingSellPercent: number;
  tradeFrequency: number;
  rebalanceFrequency: number;
  epsQuarterlyBeatBuy: number | null;
  epsQuarterlyMissBuy: number | null;
  epsQuarterlyBeatSell: number | null;
  epsQuarterlyMissSell: number | null;
  profitQuarterlyIncreaseBuy: number | null;
  profitQuarterlyDecreaseBuy: number | null;
  incomeQuarterlyIncreaseBuy: number | null;
  incomeQuarterlyDecreaseBuy: number | null;
  revenueQuarterlyIncreaseBuy: number | null;
  revenueQuarterlyDecreaseBuy: number | null;
  profitQuarterlyIncreaseSell: number | null;
  profitQuarterlyDecreaseSell: number | null;
  incomeQuarterlyIncreaseSell: number | null;
  incomeQuarterlyDecreaseSell: number | null;
  revenueQuarterlyIncreaseSell: number | null;
  revenueQuarterlyDecreaseSell: number | null;
  profitYearlyIncreaseBuy: number | null;
  profitYearlyDecreaseBuy: number | null;
  incomeYearlyIncreaseBuy: number | null;
  incomeYearlyDecreaseBuy: number | null;
  revenueYearlyIncreaseBuy: number | null;
  revenueYearlyDecreaseBuy: number | null;
  profitYearlyIncreaseSell: number | null;
  profitYearlyDecreaseSell: number | null;
  incomeYearlyIncreaseSell: number | null;
  incomeYearlyDecreaseSell: number | null;
  revenueYearlyIncreaseSell: number | null;
  revenueYearlyDecreaseSell: number | null;
  inflationYearlyIncreaseBuy: number | null;
  inflationYearlyDecreaseBuy: number | null;
  inflationYearlyIncreaseSell: number | null;
  inflationYearlyDecreaseSell: number | null;
  fundsRateMonthlyIncreaseBuy: number | null;
  fundsRateMonthlyDecreaseBuy: number | null;
  fundsRateMonthlyIncreaseSell: number | null;
  fundsRateMonthlyDecreaseSell: number | null;
  thirtyYearsTreasuryMonthlyIncreaseBuy: number | null;
  thirtyYearsTreasuryMonthlyDecreaseBuy: number | null;
  thirtyYearsTreasuryMonthlyIncreaseSell: number | null;
  thirtyYearsTreasuryMonthlyDecreaseSell: number | null;
  tenYearsTreasuryMonthlyIncreaseBuy: number | null;
  tenYearsTreasuryMonthlyDecreaseBuy: number | null;
  tenYearsTreasuryMonthlyIncreaseSell: number | null;
  tenYearsTreasuryMonthlyDecreaseSell: number | null;
  inflationMonthlyIncreaseBuy: number | null;
  inflationMonthlyDecreaseBuy: number | null;
  inflationMonthlyIncreaseSell: number | null;
  inflationMonthlyDecreaseSell: number | null;
  cpiMonthlyIncreaseBuy: number | null;
  cpiMonthlyDecreaseBuy: number | null;
  cpiMonthlyIncreaseSell: number | null;
  cpiMonthlyDecreaseSell: number | null;
  consumerSentimentMonthlyIncreaseBuy: number | null;
  consumerSentimentMonthlyDecreaseBuy: number | null;
  consumerSentimentMonthlyIncreaseSell: number | null;
  consumerSentimentMonthlyDecreaseSell: number | null;
  retailSalesMonthlyIncreaseBuy: number | null;
  retailSalesMonthlyDecreaseBuy: number | null;
  retailSalesMonthlyIncreaseSell: number | null;
  retailSalesMonthlyDecreaseSell: number | null;
  durableGoodsMonthlyIncreaseBuy: number | null;
  durableGoodsMonthlyDecreaseBuy: number | null;
  durableGoodsMonthlyIncreaseSell: number | null;
  durableGoodsMonthlyDecreaseSell: number | null;
  unemploymentRateMonthlyIncreaseBuy: number | null;
  unemploymentRateMonthlyDecreaseBuy: number | null;
  unemploymentRateMonthlyIncreaseSell: number | null;
  unemploymentRateMonthlyDecreaseSell: number | null;
  nonfarmPayrollMonthlyIncreaseBuy: number | null;
  nonfarmPayrollMonthlyDecreaseBuy: number | null;
  nonfarmPayrollMonthlyIncreaseSell: number | null;
  nonfarmPayrollMonthlyDecreaseSell: number | null;
  gdpYearlyChangeAboveBuy: number | null;
  gdpYearlyChangeAboveSell: number | null;
  gdpYearlyChangeBelowBuy: number | null;
  gdpYearlyChangeBelowSell: number | null;
  gdpQuarterlyChangeAboveBuy: number | null;
  gdpQuarterlyChangeBelowBuy: number | null;
  gdpQuarterlyChangeAboveSell: number | null;
  gdpQuarterlyChangeBelowSell: number | null;
  gdpQuarterlyYoYChangeAboveBuy: number | null;
  gdpQuarterlyYoYChangeBelowBuy: number | null;
  gdpQuarterlyYoYChangeAboveSell: number | null;
  gdpQuarterlyYoYChangeBelowSell: number | null;
  buyPreference: number;
  sellPreference: number;
}

export interface Record extends Public {
  hashCode: string;
}

export interface Create {
  hashCode: string;
  priceDailyIncreaseBuy: number | null;
  priceDailyIncreaseSell: number | null;
  priceDailyDecreaseBuy: number | null;
  priceDailyDecreaseSell: number | null;
  priceWeeklyIncreaseBuy: number | null;
  priceWeeklyIncreaseSell: number | null;
  priceWeeklyDecreaseBuy: number | null;
  priceWeeklyDecreaseSell: number | null;
  priceMonthlyIncreaseBuy: number | null;
  priceMonthlyIncreaseSell: number | null;
  priceMonthlyDecreaseBuy: number | null;
  priceMonthlyDecreaseSell: number | null;
  priceQuarterlyIncreaseBuy: number | null;
  priceQuarterlyIncreaseSell: number | null;
  priceQuarterlyDecreaseBuy: number | null;
  priceQuarterlyDecreaseSell: number | null;
  priceYearlyIncreaseBuy: number | null;
  priceYearlyIncreaseSell: number | null;
  priceYearlyDecreaseBuy: number | null;
  priceYearlyDecreaseSell: number | null;
  cashMaxPercent: number;
  tickerMinPercent: number;
  tickerMaxPercent: number;
  holdingBuyPercent: number;
  holdingSellPercent: number;
  tradeFrequency: number;
  rebalanceFrequency: number;
  epsQuarterlyBeatBuy: number | null;
  epsQuarterlyMissBuy: number | null;
  epsQuarterlyBeatSell: number | null;
  epsQuarterlyMissSell: number | null;
  profitQuarterlyIncreaseBuy: number | null;
  profitQuarterlyDecreaseBuy: number | null;
  incomeQuarterlyIncreaseBuy: number | null;
  incomeQuarterlyDecreaseBuy: number | null;
  revenueQuarterlyIncreaseBuy: number | null;
  revenueQuarterlyDecreaseBuy: number | null;
  profitQuarterlyIncreaseSell: number | null;
  profitQuarterlyDecreaseSell: number | null;
  incomeQuarterlyIncreaseSell: number | null;
  incomeQuarterlyDecreaseSell: number | null;
  revenueQuarterlyIncreaseSell: number | null;
  revenueQuarterlyDecreaseSell: number | null;
  profitYearlyIncreaseBuy: number | null;
  profitYearlyDecreaseBuy: number | null;
  incomeYearlyIncreaseBuy: number | null;
  incomeYearlyDecreaseBuy: number | null;
  revenueYearlyIncreaseBuy: number | null;
  revenueYearlyDecreaseBuy: number | null;
  profitYearlyIncreaseSell: number | null;
  profitYearlyDecreaseSell: number | null;
  incomeYearlyIncreaseSell: number | null;
  incomeYearlyDecreaseSell: number | null;
  revenueYearlyIncreaseSell: number | null;
  revenueYearlyDecreaseSell: number | null;
  inflationYearlyIncreaseBuy: number | null;
  inflationYearlyDecreaseBuy: number | null;
  inflationYearlyIncreaseSell: number | null;
  inflationYearlyDecreaseSell: number | null;
  fundsRateMonthlyIncreaseBuy: number | null;
  fundsRateMonthlyDecreaseBuy: number | null;
  fundsRateMonthlyIncreaseSell: number | null;
  fundsRateMonthlyDecreaseSell: number | null;
  thirtyYearsTreasuryMonthlyIncreaseBuy: number | null;
  thirtyYearsTreasuryMonthlyDecreaseBuy: number | null;
  thirtyYearsTreasuryMonthlyIncreaseSell: number | null;
  thirtyYearsTreasuryMonthlyDecreaseSell: number | null;
  tenYearsTreasuryMonthlyIncreaseBuy: number | null;
  tenYearsTreasuryMonthlyDecreaseBuy: number | null;
  tenYearsTreasuryMonthlyIncreaseSell: number | null;
  tenYearsTreasuryMonthlyDecreaseSell: number | null;
  inflationMonthlyIncreaseBuy: number | null;
  inflationMonthlyDecreaseBuy: number | null;
  inflationMonthlyIncreaseSell: number | null;
  inflationMonthlyDecreaseSell: number | null;
  cpiMonthlyIncreaseBuy: number | null;
  cpiMonthlyDecreaseBuy: number | null;
  cpiMonthlyIncreaseSell: number | null;
  cpiMonthlyDecreaseSell: number | null;
  consumerSentimentMonthlyIncreaseBuy: number | null;
  consumerSentimentMonthlyDecreaseBuy: number | null;
  consumerSentimentMonthlyIncreaseSell: number | null;
  consumerSentimentMonthlyDecreaseSell: number | null;
  retailSalesMonthlyIncreaseBuy: number | null;
  retailSalesMonthlyDecreaseBuy: number | null;
  retailSalesMonthlyIncreaseSell: number | null;
  retailSalesMonthlyDecreaseSell: number | null;
  durableGoodsMonthlyIncreaseBuy: number | null;
  durableGoodsMonthlyDecreaseBuy: number | null;
  durableGoodsMonthlyIncreaseSell: number | null;
  durableGoodsMonthlyDecreaseSell: number | null;
  unemploymentRateMonthlyIncreaseBuy: number | null;
  unemploymentRateMonthlyDecreaseBuy: number | null;
  unemploymentRateMonthlyIncreaseSell: number | null;
  unemploymentRateMonthlyDecreaseSell: number | null;
  nonfarmPayrollMonthlyIncreaseBuy: number | null;
  nonfarmPayrollMonthlyDecreaseBuy: number | null;
  nonfarmPayrollMonthlyIncreaseSell: number | null;
  nonfarmPayrollMonthlyDecreaseSell: number | null;
  gdpYearlyChangeAboveBuy: number | null;
  gdpYearlyChangeAboveSell: number | null;
  gdpYearlyChangeBelowBuy: number | null;
  gdpYearlyChangeBelowSell: number | null;
  gdpQuarterlyChangeAboveBuy: number | null;
  gdpQuarterlyChangeBelowBuy: number | null;
  gdpQuarterlyChangeAboveSell: number | null;
  gdpQuarterlyChangeBelowSell: number | null;
  gdpQuarterlyYoYChangeAboveBuy: number | null;
  gdpQuarterlyYoYChangeBelowBuy: number | null;
  gdpQuarterlyYoYChangeAboveSell: number | null;
  gdpQuarterlyYoYChangeBelowSell: number | null;
  buyPreference: number | null;
  sellPreference: number | null;
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
  'epsQuarterlyBeatBuy' | 'epsQuarterlyMissBuy' |
  'profitQuarterlyIncreaseBuy' | 'profitQuarterlyDecreaseBuy' |
  'incomeQuarterlyIncreaseBuy' | 'incomeQuarterlyDecreaseBuy' |
  'revenueQuarterlyIncreaseBuy' | 'revenueQuarterlyDecreaseBuy' |
  'profitYearlyIncreaseBuy' | 'profitYearlyDecreaseBuy' |
  'incomeYearlyIncreaseBuy' | 'incomeYearlyDecreaseBuy' |
  'revenueYearlyIncreaseBuy' | 'revenueYearlyDecreaseBuy'

export type IndicatorMovementBuyBehavior =
  'inflationYearlyIncreaseBuy' | 'inflationYearlyDecreaseBuy' |
  'fundsRateMonthlyIncreaseBuy' | 'fundsRateMonthlyDecreaseBuy' |
  'thirtyYearsTreasuryMonthlyIncreaseBuy' | 'thirtyYearsTreasuryMonthlyDecreaseBuy' |
  'tenYearsTreasuryMonthlyIncreaseBuy' | 'tenYearsTreasuryMonthlyDecreaseBuy' |
  'inflationMonthlyIncreaseBuy' | 'inflationMonthlyDecreaseBuy' |
  'cpiMonthlyIncreaseBuy' | 'cpiMonthlyDecreaseBuy' |
  'consumerSentimentMonthlyIncreaseBuy' | 'consumerSentimentMonthlyDecreaseBuy' |
  'retailSalesMonthlyIncreaseBuy' | 'retailSalesMonthlyDecreaseBuy' |
  'durableGoodsMonthlyIncreaseBuy' | 'durableGoodsMonthlyDecreaseBuy' |
  'unemploymentRateMonthlyIncreaseBuy' | 'unemploymentRateMonthlyDecreaseBuy' |
  'nonfarmPayrollMonthlyIncreaseBuy' | 'nonfarmPayrollMonthlyDecreaseBuy'

export type MovementBuyBehavior = TickerMovementBuyBehavior | IndicatorMovementBuyBehavior

export type IndicatorCompareBuyBehavior =
  'gdpYearlyChangeAboveBuy' | 'gdpYearlyChangeBelowBuy' |
  'gdpQuarterlyChangeAboveBuy' | 'gdpQuarterlyChangeBelowBuy' |
  'gdpQuarterlyYoYChangeAboveBuy' | 'gdpQuarterlyYoYChangeBelowBuy'

export type CompareBuyBehavior = IndicatorCompareBuyBehavior

export type BuyBehavior = MovementBuyBehavior | CompareBuyBehavior

export type TickerMovementSellBehavior =
  'priceDailyIncreaseSell' | 'priceDailyDecreaseSell' |
  'priceWeeklyIncreaseSell' | 'priceWeeklyDecreaseSell' |
  'priceMonthlyIncreaseSell' | 'priceMonthlyDecreaseSell' |
  'priceQuarterlyIncreaseSell' | 'priceQuarterlyDecreaseSell' |
  'priceYearlyIncreaseSell' | 'priceYearlyDecreaseSell' |
  'epsQuarterlyBeatSell' | 'epsQuarterlyMissSell' |
  'profitQuarterlyIncreaseSell' | 'profitQuarterlyDecreaseSell' |
  'incomeQuarterlyIncreaseSell' | 'incomeQuarterlyDecreaseSell' |
  'revenueQuarterlyIncreaseSell' | 'revenueQuarterlyDecreaseSell' |
  'profitYearlyIncreaseSell' | 'profitYearlyDecreaseSell' |
  'incomeYearlyIncreaseSell' | 'incomeYearlyDecreaseSell' |
  'revenueYearlyIncreaseSell' | 'revenueYearlyDecreaseSell'

export type IndicatorMovementSellBehavior =
  'inflationYearlyIncreaseSell' | 'inflationYearlyDecreaseSell' |
  'fundsRateMonthlyIncreaseSell' | 'fundsRateMonthlyDecreaseSell' |
  'thirtyYearsTreasuryMonthlyIncreaseSell' | 'thirtyYearsTreasuryMonthlyDecreaseSell' |
  'tenYearsTreasuryMonthlyIncreaseSell' | 'tenYearsTreasuryMonthlyDecreaseSell' |
  'inflationMonthlyIncreaseSell' | 'inflationMonthlyDecreaseSell' |
  'cpiMonthlyIncreaseSell' | 'cpiMonthlyDecreaseSell' |
  'consumerSentimentMonthlyIncreaseSell' | 'consumerSentimentMonthlyDecreaseSell' |
  'retailSalesMonthlyIncreaseSell' | 'retailSalesMonthlyDecreaseSell' |
  'durableGoodsMonthlyIncreaseSell' | 'durableGoodsMonthlyDecreaseSell' |
  'unemploymentRateMonthlyIncreaseSell' | 'unemploymentRateMonthlyDecreaseSell' |
  'nonfarmPayrollMonthlyIncreaseSell' | 'nonfarmPayrollMonthlyDecreaseSell'

export type MovementSellBehavior = TickerMovementSellBehavior | IndicatorMovementSellBehavior

export type IndicatorCompareSellBehavior =
  'gdpYearlyChangeAboveSell' | 'gdpYearlyChangeBelowSell' |
  'gdpQuarterlyChangeAboveSell' | 'gdpQuarterlyChangeBelowSell' |
  'gdpQuarterlyYoYChangeAboveSell' | 'gdpQuarterlyYoYChangeBelowSell'

export type CompareSellBehavior = IndicatorCompareSellBehavior

export type TickerMovementBehavior = TickerMovementBuyBehavior | TickerMovementSellBehavior

export type IndicatorMovementBehavior = IndicatorMovementBuyBehavior | IndicatorMovementSellBehavior

export type indicatorCompareBehavior = IndicatorCompareBuyBehavior | IndicatorCompareSellBehavior

export type MovementBehavior = MovementBuyBehavior | MovementSellBehavior

export type CompareBehavior = CompareBuyBehavior | CompareSellBehavior

export type SellBehavior = MovementSellBehavior | CompareSellBehavior

export type preferenceBehavior = 'buyPreference' | 'sellPreference'

export type allocateBehavior = 'cashMaxPercent' |
  'tickerMinPercent' | 'tickerMaxPercent' |
  'holdingBuyPercent' | 'holdingSellPercent'

export type frequencyBehavior = 'tradeFrequency' | 'rebalanceFrequency'

export type Behavior =
  BuyBehavior | SellBehavior | allocateBehavior | frequencyBehavior | preferenceBehavior
