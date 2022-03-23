import * as interfaces from '@shared/interfaces'

const priceIncreaseBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'priceDailyIncreaseBuy',
  'priceWeeklyIncreaseBuy',
  'priceMonthlyIncreaseBuy',
  'priceQuarterlyIncreaseBuy',
  'priceYearlyIncreaseBuy',
]

const priceDecreaseBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'priceDailyDecreaseBuy',
  'priceWeeklyDecreaseBuy',
  'priceMonthlyDecreaseBuy',
  'priceQuarterlyDecreaseBuy',
  'priceYearlyDecreaseBuy',
]

const financialImproveBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'epsQuarterlyBeatsBuy',
  'profitQuarterlyIncreaseBuy',
  'incomeQuarterlyIncreaseBuy',
  'revenueQuarterlyIncreaseBuy',
  'profitYearlyIncreaseBuy',
  'incomeYearlyIncreaseBuy',
  'revenueYearlyIncreaseBuy',
]

const financialSetbackBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'epsQuarterlyMissBuy',
  'profitQuarterlyDecreaseBuy',
  'incomeQuarterlyDecreaseBuy',
  'revenueQuarterlyDecreaseBuy',
  'profitYearlyDecreaseBuy',
  'incomeYearlyDecreaseBuy',
  'revenueYearlyDecreaseBuy',
]

const indicatorIncreaseBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
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

const indicatorDecreaseBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
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

const economyImproveBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'gdpYearlyChangeAboveBuy',
  'gdpQuarterlyChangeAboveBuy',
  'gdpQuarterlyYoYChangeAboveBuy',
]

const economySetbackBuyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  'gdpYearlyChangeBelowBuy',
  'gdpQuarterlyChangeBelowBuy',
  'gdpQuarterlyYoYChangeBelowBuy',
]

export const buyBehaviors: interfaces.traderPatternModel.BuyBehavior[] = [
  ...priceIncreaseBuyBehaviors,
  ...priceDecreaseBuyBehaviors,
  ...financialImproveBuyBehaviors,
  ...financialSetbackBuyBehaviors,
  ...indicatorIncreaseBuyBehaviors,
  ...indicatorDecreaseBuyBehaviors,
  ...economyImproveBuyBehaviors,
  ...economySetbackBuyBehaviors,
]

const priceIncreaseSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'priceDailyIncreaseSell',
  'priceWeeklyIncreaseSell',
  'priceMonthlyIncreaseSell',
  'priceQuarterlyIncreaseSell',
  'priceYearlyIncreaseSell',
]

const priceDecreaseSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'priceDailyDecreaseSell',
  'priceWeeklyDecreaseSell',
  'priceMonthlyDecreaseSell',
  'priceQuarterlyDecreaseSell',
  'priceYearlyDecreaseSell',
]

const financialImproveSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'epsQuarterlyBeatsSell',
  'profitQuarterlyIncreaseSell',
  'incomeQuarterlyIncreaseSell',
  'revenueQuarterlyIncreaseSell',
  'profitYearlyIncreaseSell',
  'incomeYearlyIncreaseSell',
  'revenueYearlyIncreaseSell',
]

const financialSetbackSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'epsQuarterlyMissSell',
  'profitQuarterlyDecreaseSell',
  'incomeQuarterlyDecreaseSell',
  'revenueQuarterlyDecreaseSell',
  'profitYearlyDecreaseSell',
  'incomeYearlyDecreaseSell',
  'revenueYearlyDecreaseSell',
]

const indicatorIncreaseSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
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

const indicatorDecreaseSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
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

const economyImproveSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'gdpYearlyChangeAboveSell',
  'gdpQuarterlyChangeAboveSell',
  'gdpQuarterlyYoYChangeAboveSell',
]

const economySetbackSellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  'gdpYearlyChangeBelowSell',
  'gdpQuarterlyChangeBelowSell',
  'gdpQuarterlyYoYChangeBelowSell',
]

export const sellBehaviors: interfaces.traderPatternModel.SellBehavior[] = [
  ...priceIncreaseSellBehaviors,
  ...priceDecreaseSellBehaviors,
  ...financialImproveSellBehaviors,
  ...financialSetbackSellBehaviors,
  ...indicatorIncreaseSellBehaviors,
  ...indicatorDecreaseSellBehaviors,
  ...economyImproveSellBehaviors,
  ...economySetbackSellBehaviors,
]
