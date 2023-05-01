import * as interfaces from '@shared/interfaces'

export const PriceIncreaseBuyBehaviors: interfaces.traderPatternModel.TickerMovementBuyBehavior[] = [
  'priceDailyIncreaseBuy',
  'priceWeeklyIncreaseBuy',
  'priceMonthlyIncreaseBuy',
  'priceQuarterlyIncreaseBuy',
  'priceYearlyIncreaseBuy',
]

export const PriceDecreaseBuyBehaviors: interfaces.traderPatternModel.TickerMovementBuyBehavior[] = [
  'priceDailyDecreaseBuy',
  'priceWeeklyDecreaseBuy',
  'priceMonthlyDecreaseBuy',
  'priceQuarterlyDecreaseBuy',
  'priceYearlyDecreaseBuy',
]

export const FinancialImproveBuyBehaviors: interfaces.traderPatternModel.TickerMovementBuyBehavior[] = [
  'profitQuarterlyIncreaseBuy',
  'incomeQuarterlyIncreaseBuy',
  'revenueQuarterlyIncreaseBuy',
  'profitYearlyIncreaseBuy',
  'incomeYearlyIncreaseBuy',
  'revenueYearlyIncreaseBuy',
]

export const FinancialWorsenBuyBehaviors: interfaces.traderPatternModel.TickerMovementBuyBehavior[] = [
  'profitQuarterlyDecreaseBuy',
  'incomeQuarterlyDecreaseBuy',
  'revenueQuarterlyDecreaseBuy',
  'profitYearlyDecreaseBuy',
  'incomeYearlyDecreaseBuy',
  'revenueYearlyDecreaseBuy',
]

export const IndicatorIncreaseBuyBehaviors: interfaces.traderPatternModel.IndicatorMovementBuyBehavior[] = [
  'inflationYearlyIncreaseBuy',
  'fundsRateMonthlyIncreaseBuy',
  'thirtyYearsTreasuryMonthlyIncreaseBuy',
  'tenYearsTreasuryMonthlyIncreaseBuy',
  'inflationMonthlyIncreaseBuy',
  'cpiMonthlyIncreaseBuy',
  'consumerSentimentMonthlyIncreaseBuy',
  'retailSalesMonthlyIncreaseBuy',
  'durableGoodsMonthlyIncreaseBuy',
  'unemploymentRateMonthlyIncreaseBuy',
  'nonfarmPayrollMonthlyIncreaseBuy',
]

export const IndicatorDecreaseBuyBehaviors: interfaces.traderPatternModel.IndicatorMovementBuyBehavior[] = [
  'inflationYearlyDecreaseBuy',
  'fundsRateMonthlyDecreaseBuy',
  'thirtyYearsTreasuryMonthlyDecreaseBuy',
  'tenYearsTreasuryMonthlyDecreaseBuy',
  'inflationMonthlyDecreaseBuy',
  'cpiMonthlyDecreaseBuy',
  'consumerSentimentMonthlyDecreaseBuy',
  'retailSalesMonthlyDecreaseBuy',
  'durableGoodsMonthlyDecreaseBuy',
  'unemploymentRateMonthlyDecreaseBuy',
  'nonfarmPayrollMonthlyDecreaseBuy',
]

export const EconomyImproveBuyBehaviors: interfaces.traderPatternModel.IndicatorCompareBuyBehavior[] = [
  'gdpYearlyChangeAboveBuy',
  'gdpQuarterlyChangeAboveBuy',
  'gdpQuarterlyYoYChangeAboveBuy',
]

export const EconomyWorsenBuyBehaviors: interfaces.traderPatternModel.IndicatorCompareBuyBehavior[] = [
  'gdpYearlyChangeBelowBuy',
  'gdpQuarterlyChangeBelowBuy',
  'gdpQuarterlyYoYChangeBelowBuy',
]

export const TickerMovementBuyBehaviors: interfaces.traderPatternModel.TickerMovementBuyBehavior[] = [
  ...PriceIncreaseBuyBehaviors,
  ...PriceDecreaseBuyBehaviors,
  ...FinancialImproveBuyBehaviors,
  ...FinancialWorsenBuyBehaviors,
]

export const IndicatorMovementBuyBehaviors: interfaces.traderPatternModel.IndicatorMovementBuyBehavior[] = [
  ...IndicatorIncreaseBuyBehaviors,
  ...IndicatorDecreaseBuyBehaviors,
]

export const MovementBuyBehaviors: interfaces.traderPatternModel.MovementBuyBehavior[] = [
  ...TickerMovementBuyBehaviors,
  ...IndicatorMovementBuyBehaviors,
]

export const IndicatorCompareBuyBehaviors: interfaces.traderPatternModel.IndicatorCompareBuyBehavior[] = [
  ...EconomyImproveBuyBehaviors,
  ...EconomyWorsenBuyBehaviors,
]

export const CompareBuyBehaviors: interfaces.traderPatternModel.CompareBuyBehavior[] = [
  ...IndicatorCompareBuyBehaviors,
]

export const BuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  ...MovementBuyBehaviors,
  ...CompareBuyBehaviors,
]

export const PriceIncreaseSellBehaviors: interfaces.traderPatternModel.TickerMovementSellBehavior[] = [
  'priceDailyIncreaseSell',
  'priceWeeklyIncreaseSell',
  'priceMonthlyIncreaseSell',
  'priceQuarterlyIncreaseSell',
  'priceYearlyIncreaseSell',
]

export const PriceDecreaseSellBehaviors: interfaces.traderPatternModel.TickerMovementSellBehavior[] = [
  'priceDailyDecreaseSell',
  'priceWeeklyDecreaseSell',
  'priceMonthlyDecreaseSell',
  'priceQuarterlyDecreaseSell',
  'priceYearlyDecreaseSell',
]

export const FinancialImproveSellBehaviors: interfaces.traderPatternModel.TickerMovementSellBehavior[] = [
  'profitQuarterlyIncreaseSell',
  'incomeQuarterlyIncreaseSell',
  'revenueQuarterlyIncreaseSell',
  'profitYearlyIncreaseSell',
  'incomeYearlyIncreaseSell',
  'revenueYearlyIncreaseSell',
]

export const FinancialWorsenSellBehaviors: interfaces.traderPatternModel.TickerMovementSellBehavior[] = [
  'profitQuarterlyDecreaseSell',
  'incomeQuarterlyDecreaseSell',
  'revenueQuarterlyDecreaseSell',
  'profitYearlyDecreaseSell',
  'incomeYearlyDecreaseSell',
  'revenueYearlyDecreaseSell',
]

export const IndicatorIncreaseSellBehaviors: interfaces.traderPatternModel.IndicatorMovementSellBehavior[] = [
  'inflationYearlyIncreaseSell',
  'fundsRateMonthlyIncreaseSell',
  'thirtyYearsTreasuryMonthlyIncreaseSell',
  'tenYearsTreasuryMonthlyIncreaseSell',
  'inflationMonthlyIncreaseSell',
  'cpiMonthlyIncreaseSell',
  'consumerSentimentMonthlyIncreaseSell',
  'retailSalesMonthlyIncreaseSell',
  'durableGoodsMonthlyIncreaseSell',
  'unemploymentRateMonthlyIncreaseSell',
  'nonfarmPayrollMonthlyIncreaseSell',
]

export const IndicatorDecreaseSellBehaviors: interfaces.traderPatternModel.IndicatorMovementSellBehavior[] = [
  'inflationYearlyDecreaseSell',
  'fundsRateMonthlyDecreaseSell',
  'thirtyYearsTreasuryMonthlyDecreaseSell',
  'tenYearsTreasuryMonthlyDecreaseSell',
  'inflationMonthlyDecreaseSell',
  'cpiMonthlyDecreaseSell',
  'consumerSentimentMonthlyDecreaseSell',
  'retailSalesMonthlyDecreaseSell',
  'durableGoodsMonthlyDecreaseSell',
  'unemploymentRateMonthlyDecreaseSell',
  'nonfarmPayrollMonthlyDecreaseSell',
]

export const EconomyImproveSellBehaviors: interfaces.traderPatternModel.IndicatorCompareSellBehavior[] = [
  'gdpYearlyChangeAboveSell',
  'gdpQuarterlyChangeAboveSell',
  'gdpQuarterlyYoYChangeAboveSell',
]

export const EconomyWorsenSellBehaviors: interfaces.traderPatternModel.IndicatorCompareSellBehavior[] = [
  'gdpYearlyChangeBelowSell',
  'gdpQuarterlyChangeBelowSell',
  'gdpQuarterlyYoYChangeBelowSell',
]

export const TickerMovementSellBehaviors: interfaces.traderPatternModel.TickerMovementSellBehavior[] = [
  ...PriceIncreaseSellBehaviors,
  ...PriceDecreaseSellBehaviors,
  ...FinancialImproveSellBehaviors,
  ...FinancialWorsenSellBehaviors,
]

export const IndicatorMovementSellBehaviors: interfaces.traderPatternModel.IndicatorMovementSellBehavior[] = [
  ...IndicatorIncreaseSellBehaviors,
  ...IndicatorDecreaseSellBehaviors,
]

export const MovementSellBehaviors: interfaces.traderPatternModel.MovementSellBehavior[] = [
  ...TickerMovementSellBehaviors,
  ...IndicatorMovementSellBehaviors,
]

export const IndicatorCompareSellBehaviors: interfaces.traderPatternModel.IndicatorCompareSellBehavior[] = [
  ...EconomyImproveSellBehaviors,
  ...EconomyWorsenSellBehaviors,
]

export const CompareSellBehaviors: interfaces.traderPatternModel.CompareSellBehavior[] = [
  ...IndicatorCompareSellBehaviors,
]

export const SellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  ...MovementSellBehaviors,
  ...CompareSellBehaviors,
]

export const AllocateBehaviors: interfaces.traderPatternModel.allocateBehavior[] = [
  'cashMaxPercent', 'tickerMinPercent', 'tickerMaxPercent', 'holdingBuyPercent', 'holdingSellPercent',
]

export const FrequencyBehaviors: interfaces.traderPatternModel.frequencyBehavior[] = [
  'tradeFrequency', 'rebalanceFrequency',
]

export const PreferenceBehaviors: interfaces.traderPatternModel.preferenceBehavior[] = [
  'buyPreference', 'sellPreference',
]

export const Behaviors: interfaces.traderPatternModel.Behavior[] = [
  ...BuyBehaviors,
  ...SellBehaviors,
  ...AllocateBehaviors,
  ...FrequencyBehaviors,
  ...PreferenceBehaviors,
]
