import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'

export const getTickerEqualWeightPreferValue = (
  Preference: number,
  tickerInfo: interfaces.dailyTickersModel.TickerInfo,
): number | null => {
  switch (Preference) {
    case constants.BehaviorValue.Preference.HigherPrice:
    case constants.BehaviorValue.Preference.LowerPrice:
      return tickerInfo.closePrice
    default:
      return null
  }
}

export const TickerMovementTriggers: {
  [key in interfaces.traderPatternModel.TickerMovementBehavior]: interfaces.dailyTickersModel.TickerMovementKey
} = {
  priceDailyIncreaseBuy: 'priceDailyIncrease',
  priceDailyDecreaseBuy: 'priceDailyDecrease',
  priceWeeklyIncreaseBuy: 'priceWeeklyIncrease',
  priceWeeklyDecreaseBuy: 'priceWeeklyDecrease',
  priceMonthlyIncreaseBuy: 'priceMonthlyIncrease',
  priceMonthlyDecreaseBuy: 'priceMonthlyDecrease',
  priceQuarterlyIncreaseBuy: 'priceQuarterlyIncrease',
  priceQuarterlyDecreaseBuy: 'priceQuarterlyDecrease',
  priceYearlyIncreaseBuy: 'priceYearlyIncrease',
  priceYearlyDecreaseBuy: 'priceYearlyDecrease',
  profitQuarterlyIncreaseBuy: 'profitQuarterlyIncrease',
  profitQuarterlyDecreaseBuy: 'profitQuarterlyDecrease',
  incomeQuarterlyIncreaseBuy: 'incomeQuarterlyIncrease',
  incomeQuarterlyDecreaseBuy: 'incomeQuarterlyDecrease',
  revenueQuarterlyIncreaseBuy: 'revenueQuarterlyIncrease',
  revenueQuarterlyDecreaseBuy: 'revenueQuarterlyDecrease',
  profitYearlyIncreaseBuy: 'profitYearlyIncrease',
  profitYearlyDecreaseBuy: 'profitYearlyDecrease',
  incomeYearlyIncreaseBuy: 'incomeYearlyIncrease',
  incomeYearlyDecreaseBuy: 'incomeYearlyDecrease',
  revenueYearlyIncreaseBuy: 'revenueYearlyIncrease',
  revenueYearlyDecreaseBuy: 'revenueYearlyDecrease',
  peQuarterlyIncreaseBuy: 'peQuarterlyIncrease',
  peQuarterlyDecreaseBuy: 'peQuarterlyDecrease',
  pbQuarterlyIncreaseBuy: 'pbQuarterlyIncrease',
  pbQuarterlyDecreaseBuy: 'pbQuarterlyDecrease',
  psQuarterlyIncreaseBuy: 'psQuarterlyIncrease',
  psQuarterlyDecreaseBuy: 'psQuarterlyDecrease',
  epsQuarterlyIncreaseBuy: 'epsQuarterlyIncrease',
  epsQuarterlyDecreaseBuy: 'epsQuarterlyDecrease',
  ebitdaQuarterlyIncreaseBuy: 'ebitdaQuarterlyIncrease',
  ebitdaQuarterlyDecreaseBuy: 'ebitdaQuarterlyDecrease',
  freeCashFlowQuarterlyIncreaseBuy: 'freeCashFlowQuarterlyIncrease',
  freeCashFlowQuarterlyDecreaseBuy: 'freeCashFlowQuarterlyDecrease',
  roaQuarterlyIncreaseBuy: 'roaQuarterlyIncrease',
  roaQuarterlyDecreaseBuy: 'roaQuarterlyDecrease',
  roeQuarterlyIncreaseBuy: 'roeQuarterlyIncrease',
  roeQuarterlyDecreaseBuy: 'roeQuarterlyDecrease',
  grossMarginQuarterlyIncreaseBuy: 'grossMarginQuarterlyIncrease',
  grossMarginQuarterlyDecreaseBuy: 'grossMarginQuarterlyDecrease',
  debtEquityQuarterlyIncreaseBuy: 'debtEquityQuarterlyIncrease',
  debtEquityQuarterlyDecreaseBuy: 'debtEquityQuarterlyDecrease',
  peYearlyIncreaseBuy: 'peYearlyIncrease',
  peYearlyDecreaseBuy: 'peYearlyDecrease',
  pbYearlyIncreaseBuy: 'pbYearlyIncrease',
  pbYearlyDecreaseBuy: 'pbYearlyDecrease',
  psYearlyIncreaseBuy: 'psYearlyIncrease',
  psYearlyDecreaseBuy: 'psYearlyDecrease',
  epsYearlyIncreaseBuy: 'epsYearlyIncrease',
  epsYearlyDecreaseBuy: 'epsYearlyDecrease',
  ebitdaYearlyIncreaseBuy: 'ebitdaYearlyIncrease',
  ebitdaYearlyDecreaseBuy: 'ebitdaYearlyDecrease',
  freeCashFlowYearlyIncreaseBuy: 'freeCashFlowYearlyIncrease',
  freeCashFlowYearlyDecreaseBuy: 'freeCashFlowYearlyDecrease',
  priceDailyIncreaseSell: 'priceDailyIncrease',
  priceDailyDecreaseSell: 'priceDailyDecrease',
  priceWeeklyIncreaseSell: 'priceWeeklyIncrease',
  priceWeeklyDecreaseSell: 'priceWeeklyDecrease',
  priceMonthlyIncreaseSell: 'priceMonthlyIncrease',
  priceMonthlyDecreaseSell: 'priceMonthlyDecrease',
  priceQuarterlyIncreaseSell: 'priceQuarterlyIncrease',
  priceQuarterlyDecreaseSell: 'priceQuarterlyDecrease',
  priceYearlyIncreaseSell: 'priceYearlyIncrease',
  priceYearlyDecreaseSell: 'priceYearlyDecrease',
  profitQuarterlyIncreaseSell: 'profitQuarterlyIncrease',
  profitQuarterlyDecreaseSell: 'profitQuarterlyDecrease',
  incomeQuarterlyIncreaseSell: 'incomeQuarterlyIncrease',
  incomeQuarterlyDecreaseSell: 'incomeQuarterlyDecrease',
  revenueQuarterlyIncreaseSell: 'revenueQuarterlyIncrease',
  revenueQuarterlyDecreaseSell: 'revenueQuarterlyDecrease',
  profitYearlyIncreaseSell: 'profitYearlyIncrease',
  profitYearlyDecreaseSell: 'profitYearlyDecrease',
  incomeYearlyIncreaseSell: 'incomeYearlyIncrease',
  incomeYearlyDecreaseSell: 'incomeYearlyDecrease',
  revenueYearlyIncreaseSell: 'revenueYearlyIncrease',
  revenueYearlyDecreaseSell: 'revenueYearlyDecrease',
  peQuarterlyIncreaseSell: 'peQuarterlyIncrease',
  peQuarterlyDecreaseSell: 'peQuarterlyDecrease',
  pbQuarterlyIncreaseSell: 'pbQuarterlyIncrease',
  pbQuarterlyDecreaseSell: 'pbQuarterlyDecrease',
  psQuarterlyIncreaseSell: 'psQuarterlyIncrease',
  psQuarterlyDecreaseSell: 'psQuarterlyDecrease',
  epsQuarterlyIncreaseSell: 'epsQuarterlyIncrease',
  epsQuarterlyDecreaseSell: 'epsQuarterlyDecrease',
  ebitdaQuarterlyIncreaseSell: 'ebitdaQuarterlyIncrease',
  ebitdaQuarterlyDecreaseSell: 'ebitdaQuarterlyDecrease',
  freeCashFlowQuarterlyIncreaseSell: 'freeCashFlowQuarterlyIncrease',
  freeCashFlowQuarterlyDecreaseSell: 'freeCashFlowQuarterlyDecrease',
  roaQuarterlyIncreaseSell: 'roaQuarterlyIncrease',
  roaQuarterlyDecreaseSell: 'roaQuarterlyDecrease',
  roeQuarterlyIncreaseSell: 'roeQuarterlyIncrease',
  roeQuarterlyDecreaseSell: 'roeQuarterlyDecrease',
  grossMarginQuarterlyIncreaseSell: 'grossMarginQuarterlyIncrease',
  grossMarginQuarterlyDecreaseSell: 'grossMarginQuarterlyDecrease',
  debtEquityQuarterlyIncreaseSell: 'debtEquityQuarterlyIncrease',
  debtEquityQuarterlyDecreaseSell: 'debtEquityQuarterlyDecrease',
  peYearlyIncreaseSell: 'peYearlyIncrease',
  peYearlyDecreaseSell: 'peYearlyDecrease',
  pbYearlyIncreaseSell: 'pbYearlyIncrease',
  pbYearlyDecreaseSell: 'pbYearlyDecrease',
  psYearlyIncreaseSell: 'psYearlyIncrease',
  psYearlyDecreaseSell: 'psYearlyDecrease',
  epsYearlyIncreaseSell: 'epsYearlyIncrease',
  epsYearlyDecreaseSell: 'epsYearlyDecrease',
  ebitdaYearlyIncreaseSell: 'ebitdaYearlyIncrease',
  ebitdaYearlyDecreaseSell: 'ebitdaYearlyDecrease',
  freeCashFlowYearlyIncreaseSell: 'freeCashFlowYearlyIncrease',
  freeCashFlowYearlyDecreaseSell: 'freeCashFlowYearlyDecrease',
}

export const TickerCompareTriggers: {
  [key in interfaces.traderPatternModel.TickerCompareBehavior]: interfaces.dailyTickersModel.TickerCompareKey
} = {
  peRatioQuarterlyAboveBuy: 'peRatio',
  peRatioQuarterlyBelowBuy: 'peRatio',
  pbRatioQuarterlyAboveBuy: 'pbRatio',
  pbRatioQuarterlyBelowBuy: 'pbRatio',
  psRatioQuarterlyAboveBuy: 'psRatio',
  psRatioQuarterlyBelowBuy: 'psRatio',
  roaQuarterlyAboveBuy: 'roa',
  roaQuarterlyBelowBuy: 'roa',
  roeQuarterlyAboveBuy: 'roe',
  roeQuarterlyBelowBuy: 'roe',
  grossMarginQuarterlyAboveBuy: 'grossMargin',
  grossMarginQuarterlyBelowBuy: 'grossMargin',
  debtEquityQuarterlyAboveBuy: 'debtEquity',
  debtEquityQuarterlyBelowBuy: 'debtEquity',
  peRatioYearlyAboveBuy: 'annualPeRatio',
  peRatioYearlyBelowBuy: 'annualPeRatio',
  pbRatioYearlyAboveBuy: 'annualPbRatio',
  pbRatioYearlyBelowBuy: 'annualPbRatio',
  psRatioYearlyAboveBuy: 'annualPsRatio',
  psRatioYearlyBelowBuy: 'annualPsRatio',
  peRatioQuarterlyAboveSell: 'peRatio',
  peRatioQuarterlyBelowSell: 'peRatio',
  pbRatioQuarterlyAboveSell: 'pbRatio',
  pbRatioQuarterlyBelowSell: 'pbRatio',
  psRatioQuarterlyAboveSell: 'psRatio',
  psRatioQuarterlyBelowSell: 'psRatio',
  roaQuarterlyAboveSell: 'roa',
  roaQuarterlyBelowSell: 'roa',
  roeQuarterlyAboveSell: 'roe',
  roeQuarterlyBelowSell: 'roe',
  grossMarginQuarterlyAboveSell: 'grossMargin',
  grossMarginQuarterlyBelowSell: 'grossMargin',
  debtEquityQuarterlyAboveSell: 'debtEquity',
  debtEquityQuarterlyBelowSell: 'debtEquity',
  peRatioYearlyAboveSell: 'annualPeRatio',
  peRatioYearlyBelowSell: 'annualPeRatio',
  pbRatioYearlyAboveSell: 'annualPbRatio',
  pbRatioYearlyBelowSell: 'annualPbRatio',
  psRatioYearlyAboveSell: 'annualPsRatio',
  psRatioYearlyBelowSell: 'annualPsRatio',
}

export const IndicatorMovementTriggers: {
  [key in interfaces.traderPatternModel.IndicatorMovementBehavior]: interfaces.dailyIndicatorsModel.IndicatorMovementKey
} = {
  inflationYearlyIncreaseBuy: 'inflationYearlyIncrease',
  inflationYearlyDecreaseBuy: 'inflationYearlyDecrease',
  fundsRateMonthlyIncreaseBuy: 'fundsRateMonthlyIncrease',
  fundsRateMonthlyDecreaseBuy: 'fundsRateMonthlyDecrease',
  thirtyYearsTreasuryMonthlyIncreaseBuy: 'thirtyYearsTreasuryMonthlyIncrease',
  thirtyYearsTreasuryMonthlyDecreaseBuy: 'thirtyYearsTreasuryMonthlyDecrease',
  tenYearsTreasuryMonthlyIncreaseBuy: 'tenYearsTreasuryMonthlyIncrease',
  tenYearsTreasuryMonthlyDecreaseBuy: 'tenYearsTreasuryMonthlyDecrease',
  inflationMonthlyIncreaseBuy: 'inflationMonthlyIncrease',
  inflationMonthlyDecreaseBuy: 'inflationMonthlyDecrease',
  cpiMonthlyIncreaseBuy: 'cpiMonthlyIncrease',
  cpiMonthlyDecreaseBuy: 'cpiMonthlyDecrease',
  consumerSentimentMonthlyIncreaseBuy: 'consumerSentimentMonthlyIncrease',
  consumerSentimentMonthlyDecreaseBuy: 'consumerSentimentMonthlyDecrease',
  unemploymentRateMonthlyIncreaseBuy: 'unemploymentRateMonthlyIncrease',
  unemploymentRateMonthlyDecreaseBuy: 'unemploymentRateMonthlyDecrease',
  nonfarmPayrollMonthlyIncreaseBuy: 'nonfarmPayrollMonthlyIncrease',
  nonfarmPayrollMonthlyDecreaseBuy: 'nonfarmPayrollMonthlyDecrease',
  seasonalGDPQuarterlyIncreaseBuy: 'seasonalGDPQuarterlyIncrease',
  seasonalGDPQuarterlyDecreaseBuy: 'seasonalGDPQuarterlyDecrease',
  gdpYearlyIncreaseBuy: 'gdpYearlyIncrease',
  gdpYearlyDecreaseBuy: 'gdpYearlyDecrease',
  inflationYearlyIncreaseSell: 'inflationYearlyIncrease',
  inflationYearlyDecreaseSell: 'inflationYearlyDecrease',
  fundsRateMonthlyIncreaseSell: 'fundsRateMonthlyIncrease',
  fundsRateMonthlyDecreaseSell: 'fundsRateMonthlyDecrease',
  thirtyYearsTreasuryMonthlyIncreaseSell: 'thirtyYearsTreasuryMonthlyIncrease',
  thirtyYearsTreasuryMonthlyDecreaseSell: 'thirtyYearsTreasuryMonthlyDecrease',
  tenYearsTreasuryMonthlyIncreaseSell: 'tenYearsTreasuryMonthlyIncrease',
  tenYearsTreasuryMonthlyDecreaseSell: 'tenYearsTreasuryMonthlyDecrease',
  inflationMonthlyIncreaseSell: 'inflationMonthlyIncrease',
  inflationMonthlyDecreaseSell: 'inflationMonthlyDecrease',
  cpiMonthlyIncreaseSell: 'cpiMonthlyIncrease',
  cpiMonthlyDecreaseSell: 'cpiMonthlyDecrease',
  consumerSentimentMonthlyIncreaseSell: 'consumerSentimentMonthlyIncrease',
  consumerSentimentMonthlyDecreaseSell: 'consumerSentimentMonthlyDecrease',
  unemploymentRateMonthlyIncreaseSell: 'unemploymentRateMonthlyIncrease',
  unemploymentRateMonthlyDecreaseSell: 'unemploymentRateMonthlyDecrease',
  nonfarmPayrollMonthlyIncreaseSell: 'nonfarmPayrollMonthlyIncrease',
  nonfarmPayrollMonthlyDecreaseSell: 'nonfarmPayrollMonthlyDecrease',
  seasonalGDPQuarterlyIncreaseSell: 'seasonalGDPQuarterlyIncrease',
  seasonalGDPQuarterlyDecreaseSell: 'seasonalGDPQuarterlyDecrease',
  gdpYearlyIncreaseSell: 'gdpYearlyIncrease',
  gdpYearlyDecreaseSell: 'gdpYearlyDecrease',
}

export const IndicatorCompareTriggers: {
  [key in interfaces.traderPatternModel.indicatorCompareBehavior]: interfaces.dailyIndicatorsModel.IndicatorCompareKey
} = {
  gdpYearlyChangeAboveBuy: 'gdpYearlyChangePercent',
  gdpYearlyChangeBelowBuy: 'gdpYearlyChangePercent',
  seasonalGDPQoQAboveBuy: 'seasonalGDPQoQ',
  seasonalGDPQoQBelowBuy: 'seasonalGDPQoQ',
  seasonalGDPYoYAboveBuy: 'seasonalGDPYoY',
  seasonalGDPYoYBelowBuy: 'seasonalGDPYoY',
  fundsRateMonthlyAboveBuy: 'fundsRate',
  fundsRateMonthlyBelowBuy: 'fundsRate',
  tenYearsTreasuryMonthlyAboveBuy: 'tenYearsTreasury',
  tenYearsTreasuryMonthlyBelowBuy: 'tenYearsTreasury',
  thirtyYearsTreasuryMonthlyAboveBuy: 'thirtyYearsTreasury',
  thirtyYearsTreasuryMonthlyBelowBuy: 'thirtyYearsTreasury',
  inflationMonthlyAboveBuy: 'inflation',
  inflationMonthlyBelowBuy: 'inflation',
  consumerSentimentMonthlyAboveBuy: 'consumerSentiment',
  consumerSentimentMonthlyBelowBuy: 'consumerSentiment',
  nonfarmPayrollMonthlyAboveBuy: 'nonfarmPayroll',
  nonfarmPayrollMonthlyBelowBuy: 'nonfarmPayroll',
  inflationYearlyAboveBuy: 'annualInflation',
  inflationYearlyBelowBuy: 'annualInflation',
  gdpYearlyChangeAboveSell: 'gdpYearlyChangePercent',
  gdpYearlyChangeBelowSell: 'gdpYearlyChangePercent',
  seasonalGDPQoQAboveSell: 'seasonalGDPQoQ',
  seasonalGDPQoQBelowSell: 'seasonalGDPQoQ',
  seasonalGDPYoYAboveSell: 'seasonalGDPYoY',
  seasonalGDPYoYBelowSell: 'seasonalGDPYoY',
  fundsRateMonthlyAboveSell: 'fundsRate',
  fundsRateMonthlyBelowSell: 'fundsRate',
  tenYearsTreasuryMonthlyAboveSell: 'tenYearsTreasury',
  tenYearsTreasuryMonthlyBelowSell: 'tenYearsTreasury',
  thirtyYearsTreasuryMonthlyAboveSell: 'thirtyYearsTreasury',
  thirtyYearsTreasuryMonthlyBelowSell: 'thirtyYearsTreasury',
  inflationMonthlyAboveSell: 'inflation',
  inflationMonthlyBelowSell: 'inflation',
  consumerSentimentMonthlyAboveSell: 'consumerSentiment',
  consumerSentimentMonthlyBelowSell: 'consumerSentiment',
  nonfarmPayrollMonthlyAboveSell: 'nonfarmPayroll',
  nonfarmPayrollMonthlyBelowSell: 'nonfarmPayroll',
  inflationYearlyAboveSell: 'annualInflation',
  inflationYearlyBelowSell: 'annualInflation',
}

export const isIndicatorMovementBehaviorFitPattern = (
  indicatorInfo: interfaces.dailyIndicatorsModel.IndicatorInfo,
  indicatorKey: interfaces.dailyIndicatorsModel.IndicatorMovementKey,
  pattern: interfaces.traderPatternModel.Record,
  behavior: interfaces.traderPatternModel.MovementBehavior,
): boolean => {
  const indicatorValue = indicatorInfo[indicatorKey]
  const patternValue = pattern[behavior]

  // If pattern do not care about this indicator, then treat as fit
  if (patternValue === null || patternValue === undefined) return true
  // If indicator do not contain a value for this behavior, then treat as no fit
  if (indicatorValue === null || indicatorValue === undefined) return false
  return indicatorValue >= patternValue
}

export const isIndicatorCompareBehaviorFitPattern = (
  indicatorInfo: interfaces.dailyIndicatorsModel.IndicatorInfo,
  compareKey: interfaces.dailyIndicatorsModel.IndicatorCompareKey,
  pattern: interfaces.traderPatternModel.Record,
  behavior: interfaces.traderPatternModel.CompareBehavior,
): boolean => {
  const indicatorValue = indicatorInfo[compareKey]
  const patternValue = pattern[behavior]

  // If pattern do not care about this indicator, then treat as fit
  if (patternValue === null || patternValue === undefined) return true
  // If indicator do not contain a value for this behavior, then treat as no fit
  if (indicatorValue === null || indicatorValue === undefined) return false

  if (behavior.includes('Above') && indicatorValue > patternValue) return true
  if (behavior.includes('Below') && indicatorValue < patternValue) return true
  return false
}

export const isIndicatorFitPatternBehaviors = (
  pattern: interfaces.traderPatternModel.Record,
  indicatorInfo: interfaces.dailyIndicatorsModel.IndicatorInfo,
  movementBehaviors: interfaces.traderPatternModel.IndicatorMovementBehavior[],
  compareBehaviors: interfaces.traderPatternModel.indicatorCompareBehavior[],
): boolean => {
  if (!indicatorInfo) return false

  // Make sure every movement behaviors in one trader pattern fit current indicator
  const movementFit = movementBehaviors.every((behavior) => {
    const indicatorKey = IndicatorMovementTriggers[behavior]
    return isIndicatorMovementBehaviorFitPattern(
      indicatorInfo, indicatorKey, pattern, behavior,
    )
  })
  if (!movementFit) return false

  // make sure every compare behaviors in one trader pattern fit current indicator
  const compareFit = compareBehaviors.every((trigger) => {
    const indicatorKey = IndicatorCompareTriggers[trigger]
    return isIndicatorCompareBehaviorFitPattern(
      indicatorInfo, indicatorKey, pattern, trigger,
    )
  })
  return compareFit
}

export const getTickerMovementWeight = (
  tickerInfo: interfaces.dailyTickersModel.TickerInfo,
  tickerKey: interfaces.dailyTickersModel.TickerMovementKey,
  pattern: interfaces.traderPatternModel.Record,
  behavior: interfaces.traderPatternModel.MovementBehavior,
): number => {
  const tickerValue = tickerInfo[tickerKey]
  const patternValue = pattern[behavior]

  // If pattern has no value one on one behavior, weight 1
  if (patternValue === null || patternValue === undefined) return 1

  const tickerNumValue = Number(tickerValue)
  // If ticker has no value on one behavior or less than expected pattern value, treat as no weight
  if (tickerValue === null || tickerValue === undefined || tickerNumValue < patternValue) return 0

  // weight start from 2 if ticker value is larger than or equal to pattern value
  return tickerNumValue - patternValue + 2
}

export const getTickerCompareWeight = (
  tickerInfo: interfaces.dailyTickersModel.TickerInfo,
  tickerKey: interfaces.dailyTickersModel.TickerCompareKey,
  pattern: interfaces.traderPatternModel.Record,
  behavior: interfaces.traderPatternModel.CompareBehavior,
): number => {
  const tickerValue = tickerInfo[tickerKey]
  const patternValue = pattern[behavior]

  // If pattern has no value one on one behavior, weight 1
  if (patternValue === null || patternValue === undefined) return 1

  const tickerNumValue = Number(tickerValue)
  // If ticker has no value on one behavior or equal to expected pattern value, treat as no weight
  if (tickerValue === null || tickerValue === undefined || patternValue === tickerNumValue) return 0

  if (behavior.includes('Above') && tickerNumValue > patternValue) return 2
  if (behavior.includes('Below') && tickerNumValue < patternValue) return 2
  return 0
}

export const getTickerWeights = (
  pattern: interfaces.traderPatternModel.Record,
  tickerInfo: interfaces.dailyTickersModel.TickerInfo,
  movementBehaviors: interfaces.traderPatternModel.TickerMovementBehavior[],
  compareBehaviors: interfaces.traderPatternModel.TickerCompareBehavior[],
) => {
  let weights = 1

  // Aggregate ticker movement weights
  movementBehaviors.some((behavior) => {
    const tickerKey = TickerMovementTriggers[behavior]
    const movementWeight = getTickerMovementWeight(
      tickerInfo, tickerKey, pattern, behavior,
    )
    // Multple weight for each behaviors as the final weight
    weights = weights * movementWeight

    // If weigth equals to 0, exist loop
    return !movementWeight
  })

  if (!weights) return weights

  // Aggregate ticker compare weights
  compareBehaviors.some((behavior) => {
    const tickerKey = TickerCompareTriggers[behavior]
    const compareWeight = getTickerCompareWeight(
      tickerInfo, tickerKey, pattern, behavior,
    )
    // Multple weight for each behaviors as the final weight
    weights = weights * compareWeight

    // If weigth equals to 0, exist loop
    return !compareWeight
  })

  return weights
}

interface TickerWithEvaluation {
  tickerId: number;
  preferValue: number;
  weight: number;
}

export const getTickerWithSellEvaluation = (
  tickerId: number,
  pattern: interfaces.traderPatternModel.Record,
  tickerInfo: interfaces.dailyTickersModel.TickerInfo | null,
): TickerWithEvaluation | null => {
  // When no available info for this tickerId, then do not sell
  if (!tickerInfo) return null

  // Check current patterns sell preference if tickers are equal weight
  const preferValue = getTickerEqualWeightPreferValue(
    pattern.sellPreference, tickerInfo,
  )
  if (preferValue === null) return null

  // Get current tickers sell weight
  const weight = getTickerWeights(
    pattern,
    tickerInfo,
    constants.Behavior.TickerMovementSellBehaviors,
    constants.Behavior.TickerCompareSellBehaviors,
  )

  if (!weight) return null

  return {
    tickerId,
    preferValue,
    weight,
  }
}

export const getTickerWithBuyEvaluation = (
  tickerId: number,
  pattern: interfaces.traderPatternModel.Record,
  tickerInfo: interfaces.dailyTickersModel.TickerInfo | null,
): TickerWithEvaluation | null => {
  // When no available info for this tickerId, then do not buy
  if (!tickerInfo) return null

  // Check current patterns buy preference if tickers are equal weight
  const preferValue = getTickerEqualWeightPreferValue(
    pattern.buyPreference, tickerInfo,
  )
  if (preferValue === null) return null

  // Get current tickers buy weight
  const weight = getTickerWeights(
    pattern,
    tickerInfo,
    constants.Behavior.TickerMovementBuyBehaviors,
    constants.Behavior.TickerCompareBuyBehaviors,
  )

  if (!weight) return null

  return {
    tickerId,
    preferValue,
    weight,
  }
}

export const getOrderedTickerEvaluations = (
  evaluations: TickerWithEvaluation[],
  preference: number,
) => {
  const preferenceEntry = Object.entries(constants.BehaviorValue.Preference).find((entry) => entry[1] === preference)
  if (!preferenceEntry) throw new Error('Wrong preference provided')

  const key = preferenceEntry[0]
  return evaluations.sort((first, second) => {
    if (first.weight > second.weight) return -1
    if (first.weight < second.weight) return 1
    if (key.includes('Lower')) return first.preferValue <= second.preferValue ? -1 : 1
    return first.preferValue >= second.preferValue ? -1 : 1
  })
}

export const getTickerBuyEvaluations = (
  tickerIds: number[],
  pattern: interfaces.traderPatternModel.Record,
  tickerInfos: interfaces.dailyTickersModel.TickerInfos,
) => {
  const tickerEvaluations = tickerIds.reduce((evaluations, tickerId) => {
    const evaluation = getTickerWithBuyEvaluation(
      tickerId, pattern, tickerInfos[tickerId],
    )
    if (evaluation) evaluations.push(evaluation)
    return evaluations
  }, [] as TickerWithEvaluation[])
  // Order tickerEvaluations by weight and prefer value
  const orderedEvaluations = getOrderedTickerEvaluations(tickerEvaluations, pattern.buyPreference)
  return orderedEvaluations
}

export const getTickerSellEvaluations = (
  tickerIds: number[],
  pattern: interfaces.traderPatternModel.Record,
  tickerInfos: interfaces.dailyTickersModel.TickerInfos,
): TickerWithEvaluation[] => {
  // Get sell evaluation of each ticker that should be sold
  const tickerEvaluations = tickerIds.reduce((evaluations, tickerId) => {
    const evaluation = getTickerWithSellEvaluation(
      tickerId, pattern, tickerInfos[tickerId],
    )
    if (evaluation) evaluations.push(evaluation)
    return evaluations
  }, [] as TickerWithEvaluation[])
  // Order tickerEvaluations by weight and prefer value
  const orderedEvaluations = getOrderedTickerEvaluations(tickerEvaluations, pattern.sellPreference)
  return orderedEvaluations
}
