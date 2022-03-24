import * as interfaces from '@shared/interfaces'

export const priceIncreaseBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'priceDailyIncreaseBuy',
  'priceWeeklyIncreaseBuy',
  'priceMonthlyIncreaseBuy',
  'priceQuarterlyIncreaseBuy',
  'priceYearlyIncreaseBuy',
]

export const priceDecreaseBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'priceDailyDecreaseBuy',
  'priceWeeklyDecreaseBuy',
  'priceMonthlyDecreaseBuy',
  'priceQuarterlyDecreaseBuy',
  'priceYearlyDecreaseBuy',
]

export const financialImproveBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'epsQuarterlyBeatsBuy',
  'profitQuarterlyIncreaseBuy',
  'incomeQuarterlyIncreaseBuy',
  'revenueQuarterlyIncreaseBuy',
  'profitYearlyIncreaseBuy',
  'incomeYearlyIncreaseBuy',
  'revenueYearlyIncreaseBuy',
]

export const financialWorsenBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'epsQuarterlyMissBuy',
  'profitQuarterlyDecreaseBuy',
  'incomeQuarterlyDecreaseBuy',
  'revenueQuarterlyDecreaseBuy',
  'profitYearlyDecreaseBuy',
  'incomeYearlyDecreaseBuy',
  'revenueYearlyDecreaseBuy',
]

export const indicatorIncreaseBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
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

export const indicatorDecreaseBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
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

export const economyImproveBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'gdpYearlyChangeAboveBuy',
  'gdpQuarterlyChangeAboveBuy',
  'gdpQuarterlyYoYChangeAboveBuy',
]

export const economyWorsenBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'gdpYearlyChangeBelowBuy',
  'gdpQuarterlyChangeBelowBuy',
  'gdpQuarterlyYoYChangeBelowBuy',
]

export const buyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  ...priceIncreaseBuyBehaviors,
  ...priceDecreaseBuyBehaviors,
  ...financialImproveBuyBehaviors,
  ...financialWorsenBuyBehaviors,
  ...indicatorIncreaseBuyBehaviors,
  ...indicatorDecreaseBuyBehaviors,
  ...economyImproveBuyBehaviors,
  ...economyWorsenBuyBehaviors,
]

export const priceIncreaseSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'priceDailyIncreaseSell',
  'priceWeeklyIncreaseSell',
  'priceMonthlyIncreaseSell',
  'priceQuarterlyIncreaseSell',
  'priceYearlyIncreaseSell',
]

export const priceDecreaseSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'priceDailyDecreaseSell',
  'priceWeeklyDecreaseSell',
  'priceMonthlyDecreaseSell',
  'priceQuarterlyDecreaseSell',
  'priceYearlyDecreaseSell',
]

export const financialImproveSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'epsQuarterlyBeatsSell',
  'profitQuarterlyIncreaseSell',
  'incomeQuarterlyIncreaseSell',
  'revenueQuarterlyIncreaseSell',
  'profitYearlyIncreaseSell',
  'incomeYearlyIncreaseSell',
  'revenueYearlyIncreaseSell',
]

export const financialWorsenSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'epsQuarterlyMissSell',
  'profitQuarterlyDecreaseSell',
  'incomeQuarterlyDecreaseSell',
  'revenueQuarterlyDecreaseSell',
  'profitYearlyDecreaseSell',
  'incomeYearlyDecreaseSell',
  'revenueYearlyDecreaseSell',
]

export const indicatorIncreaseSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
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

export const indicatorDecreaseSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
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

export const economyImproveSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'gdpYearlyChangeAboveSell',
  'gdpQuarterlyChangeAboveSell',
  'gdpQuarterlyYoYChangeAboveSell',
]

export const economyWorsenSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'gdpYearlyChangeBelowSell',
  'gdpQuarterlyChangeBelowSell',
  'gdpQuarterlyYoYChangeBelowSell',
]

export const sellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  ...priceIncreaseSellBehaviors,
  ...priceDecreaseSellBehaviors,
  ...financialImproveSellBehaviors,
  ...financialWorsenSellBehaviors,
  ...indicatorIncreaseSellBehaviors,
  ...indicatorDecreaseSellBehaviors,
  ...economyImproveSellBehaviors,
  ...economyWorsenSellBehaviors,
]

export const allocateBehavior: interfaces.traderPatternModel.allocateBehavior[] = [
  'cashMaxPercent', 'tickerMinPercent', 'tickerMaxPercent', 'holdingBuyPercent', 'holdingSellPercent',
]

export const frequencyBehavior: interfaces.traderPatternModel.frequencyBehavior[] = [
  'tradeFrequency', 'rebalanceFrequency',
]

export const preferenceBehaviors: interfaces.traderPatternModel.preferenceBehavior[] = [
  'buyPreference', 'sellPreference',
]
