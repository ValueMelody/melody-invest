import * as interfaces from '@shared/interfaces'

export const PriceIncreaseBuyBehaviors: interfaces.traderPatternModel.MovementBuyBehavior[] = [
  'priceDailyIncreaseBuy',
  'priceWeeklyIncreaseBuy',
  'priceMonthlyIncreaseBuy',
  'priceQuarterlyIncreaseBuy',
  'priceYearlyIncreaseBuy',
]

export const PriceDecreaseBuyBehaviors: interfaces.traderPatternModel.MovementBuyBehavior[] = [
  'priceDailyDecreaseBuy',
  'priceWeeklyDecreaseBuy',
  'priceMonthlyDecreaseBuy',
  'priceQuarterlyDecreaseBuy',
  'priceYearlyDecreaseBuy',
]

export const FinancialImproveBuyBehaviors: interfaces.traderPatternModel.MovementBuyBehavior[] = [
  'epsQuarterlyBeatBuy',
  'profitQuarterlyIncreaseBuy',
  'incomeQuarterlyIncreaseBuy',
  'revenueQuarterlyIncreaseBuy',
  'profitYearlyIncreaseBuy',
  'incomeYearlyIncreaseBuy',
  'revenueYearlyIncreaseBuy',
]

export const FinancialWorsenBuyBehaviors: interfaces.traderPatternModel.MovementBuyBehavior[] = [
  'epsQuarterlyMissBuy',
  'profitQuarterlyDecreaseBuy',
  'incomeQuarterlyDecreaseBuy',
  'revenueQuarterlyDecreaseBuy',
  'profitYearlyDecreaseBuy',
  'incomeYearlyDecreaseBuy',
  'revenueYearlyDecreaseBuy',
]

export const IndicatorIncreaseBuyBehaviors: interfaces.traderPatternModel.MovementBuyBehavior[] = [
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

export const IndicatorDecreaseBuyBehaviors: interfaces.traderPatternModel.MovementBuyBehavior[] = [
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

export const EconomyImproveBuyBehaviors: interfaces.traderPatternModel.CompareBuyBehavior[] = [
  'gdpYearlyChangeAboveBuy',
  'gdpQuarterlyChangeAboveBuy',
  'gdpQuarterlyYoYChangeAboveBuy',
]

export const EconomyWorsenBuyBehaviors: interfaces.traderPatternModel.CompareBuyBehavior[] = [
  'gdpYearlyChangeBelowBuy',
  'gdpQuarterlyChangeBelowBuy',
  'gdpQuarterlyYoYChangeBelowBuy',
]

export const MovementBuyBehaviors: interfaces.traderPatternModel.MovementBuyBehavior[] = [
  ...PriceIncreaseBuyBehaviors,
  ...PriceDecreaseBuyBehaviors,
  ...FinancialImproveBuyBehaviors,
  ...FinancialWorsenBuyBehaviors,
  ...IndicatorIncreaseBuyBehaviors,
  ...IndicatorDecreaseBuyBehaviors,
]

export const CompareBuyBehaviors: interfaces.traderPatternModel.CompareBuyBehavior[] = [
  ...EconomyImproveBuyBehaviors,
  ...EconomyWorsenBuyBehaviors,
]

export const BuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  ...MovementBuyBehaviors,
  ...CompareBuyBehaviors,
]

export const PriceIncreaseSellBehaviors: interfaces.traderPatternModel.MovementSellBehavior[] = [
  'priceDailyIncreaseSell',
  'priceWeeklyIncreaseSell',
  'priceMonthlyIncreaseSell',
  'priceQuarterlyIncreaseSell',
  'priceYearlyIncreaseSell',
]

export const PriceDecreaseSellBehaviors: interfaces.traderPatternModel.MovementSellBehavior[] = [
  'priceDailyDecreaseSell',
  'priceWeeklyDecreaseSell',
  'priceMonthlyDecreaseSell',
  'priceQuarterlyDecreaseSell',
  'priceYearlyDecreaseSell',
]

export const FinancialImproveSellBehaviors: interfaces.traderPatternModel.MovementSellBehavior[] = [
  'epsQuarterlyBeatSell',
  'profitQuarterlyIncreaseSell',
  'incomeQuarterlyIncreaseSell',
  'revenueQuarterlyIncreaseSell',
  'profitYearlyIncreaseSell',
  'incomeYearlyIncreaseSell',
  'revenueYearlyIncreaseSell',
]

export const FinancialWorsenSellBehaviors: interfaces.traderPatternModel.MovementSellBehavior[] = [
  'epsQuarterlyMissSell',
  'profitQuarterlyDecreaseSell',
  'incomeQuarterlyDecreaseSell',
  'revenueQuarterlyDecreaseSell',
  'profitYearlyDecreaseSell',
  'incomeYearlyDecreaseSell',
  'revenueYearlyDecreaseSell',
]

export const IndicatorIncreaseSellBehaviors: interfaces.traderPatternModel.MovementSellBehavior[] = [
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

export const IndicatorDecreaseSellBehaviors: interfaces.traderPatternModel.MovementSellBehavior[] = [
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

export const EconomyImproveSellBehaviors: interfaces.traderPatternModel.CompareSellBehavior[] = [
  'gdpYearlyChangeAboveSell',
  'gdpQuarterlyChangeAboveSell',
  'gdpQuarterlyYoYChangeAboveSell',
]

export const EconomyWorsenSellBehaviors: interfaces.traderPatternModel.CompareSellBehavior[] = [
  'gdpYearlyChangeBelowSell',
  'gdpQuarterlyChangeBelowSell',
  'gdpQuarterlyYoYChangeBelowSell',
]

export const MovementSellBehaviors: interfaces.traderPatternModel.MovementSellBehavior[] = [
  ...PriceIncreaseSellBehaviors,
  ...PriceDecreaseSellBehaviors,
  ...FinancialImproveSellBehaviors,
  ...FinancialWorsenSellBehaviors,
  ...IndicatorIncreaseSellBehaviors,
  ...IndicatorDecreaseSellBehaviors,
]

export const CompareSellBehaviors: interfaces.traderPatternModel.CompareSellBehavior[] = [
  ...EconomyImproveSellBehaviors,
  ...EconomyWorsenSellBehaviors,
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
