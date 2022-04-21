import * as interfaces from '@shared/interfaces'

export const PriceIncreaseBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'priceDailyIncreaseBuy',
  'priceWeeklyIncreaseBuy',
  'priceMonthlyIncreaseBuy',
  'priceQuarterlyIncreaseBuy',
  'priceYearlyIncreaseBuy',
]

export const PriceDecreaseBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'priceDailyDecreaseBuy',
  'priceWeeklyDecreaseBuy',
  'priceMonthlyDecreaseBuy',
  'priceQuarterlyDecreaseBuy',
  'priceYearlyDecreaseBuy',
]

export const FinancialImproveBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'epsQuarterlyBeatBuy',
  'profitQuarterlyIncreaseBuy',
  'incomeQuarterlyIncreaseBuy',
  'revenueQuarterlyIncreaseBuy',
  'profitYearlyIncreaseBuy',
  'incomeYearlyIncreaseBuy',
  'revenueYearlyIncreaseBuy',
]

export const FinancialWorsenBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'epsQuarterlyMissBuy',
  'profitQuarterlyDecreaseBuy',
  'incomeQuarterlyDecreaseBuy',
  'revenueQuarterlyDecreaseBuy',
  'profitYearlyDecreaseBuy',
  'incomeYearlyDecreaseBuy',
  'revenueYearlyDecreaseBuy',
]

export const IndicatorIncreaseBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
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

export const IndicatorDecreaseBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
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

export const EconomyImproveBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'gdpYearlyChangeAboveBuy',
  'gdpQuarterlyChangeAboveBuy',
  'gdpQuarterlyYoYChangeAboveBuy',
]

export const EconomyWorsenBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'gdpYearlyChangeBelowBuy',
  'gdpQuarterlyChangeBelowBuy',
  'gdpQuarterlyYoYChangeBelowBuy',
]

export const BuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  ...PriceIncreaseBuyBehaviors,
  ...PriceDecreaseBuyBehaviors,
  ...FinancialImproveBuyBehaviors,
  ...FinancialWorsenBuyBehaviors,
  ...IndicatorIncreaseBuyBehaviors,
  ...IndicatorDecreaseBuyBehaviors,
  ...EconomyImproveBuyBehaviors,
  ...EconomyWorsenBuyBehaviors,
]

export const PriceIncreaseSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'priceDailyIncreaseSell',
  'priceWeeklyIncreaseSell',
  'priceMonthlyIncreaseSell',
  'priceQuarterlyIncreaseSell',
  'priceYearlyIncreaseSell',
]

export const PriceDecreaseSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'priceDailyDecreaseSell',
  'priceWeeklyDecreaseSell',
  'priceMonthlyDecreaseSell',
  'priceQuarterlyDecreaseSell',
  'priceYearlyDecreaseSell',
]

export const FinancialImproveSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'epsQuarterlyBeatSell',
  'profitQuarterlyIncreaseSell',
  'incomeQuarterlyIncreaseSell',
  'revenueQuarterlyIncreaseSell',
  'profitYearlyIncreaseSell',
  'incomeYearlyIncreaseSell',
  'revenueYearlyIncreaseSell',
]

export const FinancialWorsenSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'epsQuarterlyMissSell',
  'profitQuarterlyDecreaseSell',
  'incomeQuarterlyDecreaseSell',
  'revenueQuarterlyDecreaseSell',
  'profitYearlyDecreaseSell',
  'incomeYearlyDecreaseSell',
  'revenueYearlyDecreaseSell',
]

export const IndicatorIncreaseSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
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

export const IndicatorDecreaseSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
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

export const EconomyImproveSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'gdpYearlyChangeAboveSell',
  'gdpQuarterlyChangeAboveSell',
  'gdpQuarterlyYoYChangeAboveSell',
]

export const EconomyWorsenSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'gdpYearlyChangeBelowSell',
  'gdpQuarterlyChangeBelowSell',
  'gdpQuarterlyYoYChangeBelowSell',
]

export const SellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  ...PriceIncreaseSellBehaviors,
  ...PriceDecreaseSellBehaviors,
  ...FinancialImproveSellBehaviors,
  ...FinancialWorsenSellBehaviors,
  ...IndicatorIncreaseSellBehaviors,
  ...IndicatorDecreaseSellBehaviors,
  ...EconomyImproveSellBehaviors,
  ...EconomyWorsenSellBehaviors,
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
