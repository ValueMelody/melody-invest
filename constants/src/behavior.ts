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

export const FinancialIncreaseBuyBehaviors: interfaces.traderPatternModel.TickerMovementBuyBehavior[] = [
  'profitQuarterlyIncreaseBuy',
  'incomeQuarterlyIncreaseBuy',
  'revenueQuarterlyIncreaseBuy',
  'peQuarterlyIncreaseBuy',
  'pbQuarterlyIncreaseBuy',
  'psQuarterlyIncreaseBuy',
  'epsQuarterlyIncreaseBuy',
  'ebitdaQuarterlyIncreaseBuy',
  'freeCashFlowQuarterlyIncreaseBuy',
  'roaQuarterlyIncreaseBuy',
  'roeQuarterlyIncreaseBuy',
  'grossMarginQuarterlyIncreaseBuy',
  'debtEquityQuarterlyIncreaseBuy',
  'profitYearlyIncreaseBuy',
  'incomeYearlyIncreaseBuy',
  'revenueYearlyIncreaseBuy',
  'peYearlyIncreaseBuy',
  'pbYearlyIncreaseBuy',
  'psYearlyIncreaseBuy',
  'epsYearlyIncreaseBuy',
  'ebitdaYearlyIncreaseBuy',
  'freeCashFlowYearlyIncreaseBuy',
]

export const FinancialDecreaseBuyBehaviors: interfaces.traderPatternModel.TickerMovementBuyBehavior[] = [
  'profitQuarterlyDecreaseBuy',
  'incomeQuarterlyDecreaseBuy',
  'revenueQuarterlyDecreaseBuy',
  'peQuarterlyDecreaseBuy',
  'pbQuarterlyDecreaseBuy',
  'psQuarterlyDecreaseBuy',
  'epsQuarterlyDecreaseBuy',
  'ebitdaQuarterlyDecreaseBuy',
  'freeCashFlowQuarterlyDecreaseBuy',
  'roaQuarterlyDecreaseBuy',
  'roeQuarterlyDecreaseBuy',
  'grossMarginQuarterlyDecreaseBuy',
  'debtEquityQuarterlyDecreaseBuy',
  'profitYearlyDecreaseBuy',
  'incomeYearlyDecreaseBuy',
  'revenueYearlyDecreaseBuy',
  'peYearlyDecreaseBuy',
  'pbYearlyDecreaseBuy',
  'psYearlyDecreaseBuy',
  'epsYearlyDecreaseBuy',
  'ebitdaYearlyDecreaseBuy',
  'freeCashFlowYearlyDecreaseBuy',
]

export const FinancialImproveBuyBehaviors: interfaces.traderPatternModel.TickerCompareBuyBehavior[] = [
  'peRatioQuarterlyAboveBuy',
  'pbRatioQuarterlyAboveBuy',
  'psRatioQuarterlyAboveBuy',
  'roaQuarterlyAboveBuy',
  'roeQuarterlyAboveBuy',
  'grossMarginQuarterlyAboveBuy',
  'debtEquityQuarterlyAboveBuy',
  'peRatioYearlyAboveBuy',
  'pbRatioYearlyAboveBuy',
  'psRatioYearlyAboveBuy',
]

export const FinancialWorsenBuyBehaviors: interfaces.traderPatternModel.TickerCompareBuyBehavior[] = [
  'peRatioQuarterlyBelowBuy',
  'pbRatioQuarterlyBelowBuy',
  'psRatioQuarterlyBelowBuy',
  'roaQuarterlyBelowBuy',
  'roeQuarterlyBelowBuy',
  'grossMarginQuarterlyBelowBuy',
  'debtEquityQuarterlyBelowBuy',
  'peRatioYearlyBelowBuy',
  'pbRatioYearlyBelowBuy',
  'psRatioYearlyBelowBuy',
]

export const IndicatorIncreaseBuyBehaviors: interfaces.traderPatternModel.IndicatorMovementBuyBehavior[] = [
  'inflationYearlyIncreaseBuy',
  'fundsRateMonthlyIncreaseBuy',
  'thirtyYearsTreasuryMonthlyIncreaseBuy',
  'tenYearsTreasuryMonthlyIncreaseBuy',
  'inflationMonthlyIncreaseBuy',
  'cpiMonthlyIncreaseBuy',
  'consumerSentimentMonthlyIncreaseBuy',
  'unemploymentRateMonthlyIncreaseBuy',
  'nonfarmPayrollMonthlyIncreaseBuy',
  'seasonalGDPQuarterlyIncreaseBuy',
  'gdpYearlyIncreaseBuy',
]

export const IndicatorDecreaseBuyBehaviors: interfaces.traderPatternModel.IndicatorMovementBuyBehavior[] = [
  'inflationYearlyDecreaseBuy',
  'fundsRateMonthlyDecreaseBuy',
  'thirtyYearsTreasuryMonthlyDecreaseBuy',
  'tenYearsTreasuryMonthlyDecreaseBuy',
  'inflationMonthlyDecreaseBuy',
  'cpiMonthlyDecreaseBuy',
  'consumerSentimentMonthlyDecreaseBuy',
  'unemploymentRateMonthlyDecreaseBuy',
  'nonfarmPayrollMonthlyDecreaseBuy',
  'seasonalGDPQuarterlyDecreaseBuy',
  'gdpYearlyDecreaseBuy',
]

export const IndicatorImproveBuyBehaviors: interfaces.traderPatternModel.IndicatorCompareBuyBehavior[] = [
  'gdpYearlyChangeAboveBuy',
  'seasonalGDPQoQAboveBuy',
  'seasonalGDPYoYAboveBuy',
  'fundsRateMonthlyAboveBuy',
  'tenYearsTreasuryMonthlyAboveBuy',
  'thirtyYearsTreasuryMonthlyAboveBuy',
  'inflationMonthlyAboveBuy',
  'consumerSentimentMonthlyAboveBuy',
  'nonfarmPayrollMonthlyAboveBuy',
  'inflationYearlyAboveBuy',
]

export const IndicatorWorsenBuyBehaviors: interfaces.traderPatternModel.IndicatorCompareBuyBehavior[] = [
  'gdpYearlyChangeBelowBuy',
  'seasonalGDPQoQBelowBuy',
  'seasonalGDPYoYBelowBuy',
  'fundsRateMonthlyBelowBuy',
  'tenYearsTreasuryMonthlyBelowBuy',
  'thirtyYearsTreasuryMonthlyBelowBuy',
  'inflationMonthlyBelowBuy',
  'consumerSentimentMonthlyBelowBuy',
  'nonfarmPayrollMonthlyBelowBuy',
  'inflationYearlyBelowBuy',
]

export const TickerMovementBuyBehaviors: interfaces.traderPatternModel.TickerMovementBuyBehavior[] = [
  ...PriceIncreaseBuyBehaviors,
  ...PriceDecreaseBuyBehaviors,
  ...FinancialIncreaseBuyBehaviors,
  ...FinancialDecreaseBuyBehaviors,
]

export const IndicatorMovementBuyBehaviors: interfaces.traderPatternModel.IndicatorMovementBuyBehavior[] = [
  ...IndicatorIncreaseBuyBehaviors,
  ...IndicatorDecreaseBuyBehaviors,
]

export const MovementBuyBehaviors: interfaces.traderPatternModel.MovementBuyBehavior[] = [
  ...TickerMovementBuyBehaviors,
  ...IndicatorMovementBuyBehaviors,
]

export const TickerCompareBuyBehaviors: interfaces.traderPatternModel.TickerCompareBuyBehavior[] = [
  ...FinancialImproveBuyBehaviors,
  ...FinancialWorsenBuyBehaviors,
]

export const IndicatorCompareBuyBehaviors: interfaces.traderPatternModel.IndicatorCompareBuyBehavior[] = [
  ...IndicatorImproveBuyBehaviors,
  ...IndicatorWorsenBuyBehaviors,
]

export const CompareBuyBehaviors: interfaces.traderPatternModel.CompareBuyBehavior[] = [
  ...TickerCompareBuyBehaviors,
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

export const FinancialIncreaseSellBehaviors: interfaces.traderPatternModel.TickerMovementSellBehavior[] = [
  'profitQuarterlyIncreaseSell',
  'incomeQuarterlyIncreaseSell',
  'revenueQuarterlyIncreaseSell',
  'peQuarterlyIncreaseSell',
  'pbQuarterlyIncreaseSell',
  'psQuarterlyIncreaseSell',
  'epsQuarterlyIncreaseSell',
  'ebitdaQuarterlyIncreaseSell',
  'freeCashFlowQuarterlyIncreaseSell',
  'roaQuarterlyIncreaseSell',
  'roeQuarterlyIncreaseSell',
  'grossMarginQuarterlyIncreaseSell',
  'debtEquityQuarterlyIncreaseSell',
  'profitYearlyIncreaseSell',
  'incomeYearlyIncreaseSell',
  'revenueYearlyIncreaseSell',
  'peYearlyIncreaseSell',
  'pbYearlyIncreaseSell',
  'psYearlyIncreaseSell',
  'epsYearlyIncreaseSell',
  'ebitdaYearlyIncreaseSell',
  'freeCashFlowYearlyIncreaseSell',
]

export const FinancialDecreaseSellBehaviors: interfaces.traderPatternModel.TickerMovementSellBehavior[] = [
  'profitQuarterlyDecreaseSell',
  'incomeQuarterlyDecreaseSell',
  'revenueQuarterlyDecreaseSell',
  'peQuarterlyDecreaseSell',
  'pbQuarterlyDecreaseSell',
  'psQuarterlyDecreaseSell',
  'epsQuarterlyDecreaseSell',
  'ebitdaQuarterlyDecreaseSell',
  'freeCashFlowQuarterlyDecreaseSell',
  'roaQuarterlyDecreaseSell',
  'roeQuarterlyDecreaseSell',
  'grossMarginQuarterlyDecreaseSell',
  'debtEquityQuarterlyDecreaseSell',
  'profitYearlyDecreaseSell',
  'incomeYearlyDecreaseSell',
  'revenueYearlyDecreaseSell',
  'peYearlyDecreaseSell',
  'pbYearlyDecreaseSell',
  'psYearlyDecreaseSell',
  'epsYearlyDecreaseSell',
  'ebitdaYearlyDecreaseSell',
  'freeCashFlowYearlyDecreaseSell',
]

export const FinancialImproveSellBehaviors: interfaces.traderPatternModel.TickerCompareSellBehavior[] = [
  'peRatioQuarterlyAboveSell',
  'pbRatioQuarterlyAboveSell',
  'psRatioQuarterlyAboveSell',
  'roaQuarterlyAboveSell',
  'roeQuarterlyAboveSell',
  'grossMarginQuarterlyAboveSell',
  'debtEquityQuarterlyAboveSell',
  'peRatioYearlyAboveSell',
  'pbRatioYearlyAboveSell',
  'psRatioYearlyAboveSell',
]

export const FinancialWorsenSellBehaviors: interfaces.traderPatternModel.TickerCompareSellBehavior[] = [
  'peRatioQuarterlyBelowSell',
  'pbRatioQuarterlyBelowSell',
  'psRatioQuarterlyBelowSell',
  'roaQuarterlyBelowSell',
  'roeQuarterlyBelowSell',
  'grossMarginQuarterlyBelowSell',
  'debtEquityQuarterlyBelowSell',
  'peRatioYearlyBelowSell',
  'pbRatioYearlyBelowSell',
  'psRatioYearlyBelowSell',
]

export const TickerCompareSellBehaviors: interfaces.traderPatternModel.TickerCompareSellBehavior[] = [
  ...FinancialImproveSellBehaviors,
  ...FinancialWorsenSellBehaviors,
]

export const IndicatorIncreaseSellBehaviors: interfaces.traderPatternModel.IndicatorMovementSellBehavior[] = [
  'inflationYearlyIncreaseSell',
  'fundsRateMonthlyIncreaseSell',
  'thirtyYearsTreasuryMonthlyIncreaseSell',
  'tenYearsTreasuryMonthlyIncreaseSell',
  'inflationMonthlyIncreaseSell',
  'cpiMonthlyIncreaseSell',
  'consumerSentimentMonthlyIncreaseSell',
  'unemploymentRateMonthlyIncreaseSell',
  'nonfarmPayrollMonthlyIncreaseSell',
  'seasonalGDPQuarterlyIncreaseSell',
  'gdpYearlyIncreaseSell',
]

export const IndicatorDecreaseSellBehaviors: interfaces.traderPatternModel.IndicatorMovementSellBehavior[] = [
  'inflationYearlyDecreaseSell',
  'fundsRateMonthlyDecreaseSell',
  'thirtyYearsTreasuryMonthlyDecreaseSell',
  'tenYearsTreasuryMonthlyDecreaseSell',
  'inflationMonthlyDecreaseSell',
  'cpiMonthlyDecreaseSell',
  'consumerSentimentMonthlyDecreaseSell',
  'unemploymentRateMonthlyDecreaseSell',
  'nonfarmPayrollMonthlyDecreaseSell',
  'seasonalGDPQuarterlyDecreaseSell',
  'gdpYearlyDecreaseSell',
]

export const IndicatorImproveSellBehaviors: interfaces.traderPatternModel.IndicatorCompareSellBehavior[] = [
  'gdpYearlyChangeAboveSell',
  'seasonalGDPQoQAboveSell',
  'seasonalGDPYoYAboveSell',
  'fundsRateMonthlyAboveSell',
  'tenYearsTreasuryMonthlyAboveSell',
  'thirtyYearsTreasuryMonthlyAboveSell',
  'inflationMonthlyAboveSell',
  'consumerSentimentMonthlyAboveSell',
  'nonfarmPayrollMonthlyAboveSell',
  'inflationYearlyAboveSell',
]

export const IndicatorWorsenSellBehaviors: interfaces.traderPatternModel.IndicatorCompareSellBehavior[] = [
  'gdpYearlyChangeBelowSell',
  'seasonalGDPQoQBelowSell',
  'seasonalGDPYoYBelowSell',
  'fundsRateMonthlyBelowSell',
  'tenYearsTreasuryMonthlyBelowSell',
  'thirtyYearsTreasuryMonthlyBelowSell',
  'inflationMonthlyBelowSell',
  'consumerSentimentMonthlyBelowSell',
  'nonfarmPayrollMonthlyBelowSell',
  'inflationYearlyBelowSell',
]

export const TickerMovementSellBehaviors: interfaces.traderPatternModel.TickerMovementSellBehavior[] = [
  ...PriceIncreaseSellBehaviors,
  ...PriceDecreaseSellBehaviors,
  ...FinancialIncreaseSellBehaviors,
  ...FinancialDecreaseSellBehaviors,
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
  ...IndicatorImproveSellBehaviors,
  ...IndicatorWorsenSellBehaviors,
]

export const CompareSellBehaviors: interfaces.traderPatternModel.CompareSellBehavior[] = [
  ...TickerCompareSellBehaviors,
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
