import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'

export const getTickerPreferValue = (
  Preference: number,
  tickerDaily: interfaces.tickerDailyModel.Record,
  tickerQuarterly: interfaces.tickerQuarterlyModel.Record | null,
  tickerYearly: interfaces.tickerYearlyModel.Record | null,
): number | null => {
  switch (Preference) {
    case constants.BehaviorValue.Preference.HigherPrice:
    case constants.BehaviorValue.Preference.LowerPrice:
      return tickerDaily.closePrice
    case constants.BehaviorValue.Preference.HigherQuarterEPS:
    case constants.BehaviorValue.Preference.LowerQuarterEPS:
      return tickerQuarterly ? tickerQuarterly.eps : null
    case constants.BehaviorValue.Preference.HigherQuarterEBITDA:
    case constants.BehaviorValue.Preference.LowerQuarterEBITDA:
      return tickerQuarterly ? tickerQuarterly.ebitda : null
    case constants.BehaviorValue.Preference.HigherQuarterIncome:
    case constants.BehaviorValue.Preference.LowerQuarterIncome:
      return tickerQuarterly ? tickerQuarterly.netIncome : null
    case constants.BehaviorValue.Preference.HigherQuarterProfit:
    case constants.BehaviorValue.Preference.LowerQuarterProfit:
      return tickerQuarterly ? tickerQuarterly.grossProfit : null
    case constants.BehaviorValue.Preference.HigherQuarterRevenue:
    case constants.BehaviorValue.Preference.LowerQuarterRevenue:
      return tickerQuarterly ? tickerQuarterly.totalRevenue : null
    case constants.BehaviorValue.Preference.HigherYearEPS:
    case constants.BehaviorValue.Preference.LowerYearEPS:
      return tickerYearly ? tickerYearly.eps : null
    case constants.BehaviorValue.Preference.HigherYearEBITDA:
    case constants.BehaviorValue.Preference.LowerYearEBITDA:
      return tickerYearly ? tickerYearly.ebitda : null
    case constants.BehaviorValue.Preference.HigherYearIncome:
    case constants.BehaviorValue.Preference.LowerYearIncome:
      return tickerYearly ? tickerYearly.netIncome : null
    case constants.BehaviorValue.Preference.HigherYearProfit:
    case constants.BehaviorValue.Preference.LowerYearProfit:
      return tickerYearly ? tickerYearly.grossProfit : null
    case constants.BehaviorValue.Preference.HigherYearRevenue:
    case constants.BehaviorValue.Preference.LowerYearRevenue:
      return tickerYearly ? tickerYearly.totalRevenue : null
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
}

export const IndicatorMovementTriggers: {
  [key in interfaces.traderPatternModel.IndicatorMovementBehavior]: interfaces.dailyTickersModel.IndicatorMovementKey
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
}

export const IndicatorCompareTriggers: {
  [key in interfaces.traderPatternModel.indicatorCompareBehavior]: interfaces.dailyTickersModel.IndicatorCompareKey
} = {
  gdpYearlyChangeAboveBuy: 'gdpYearlyChangePercent',
  gdpYearlyChangeBelowBuy: 'gdpYearlyChangePercent',
  gdpQuarterlyChangeAboveBuy: 'seasonalGDPQoQ',
  gdpQuarterlyChangeBelowBuy: 'seasonalGDPQoQ',
  gdpQuarterlyYoYChangeAboveBuy: 'seasonalGDPYoY',
  gdpQuarterlyYoYChangeBelowBuy: 'seasonalGDPYoY',
  gdpYearlyChangeAboveSell: 'gdpYearlyChangePercent',
  gdpYearlyChangeBelowSell: 'gdpYearlyChangePercent',
  gdpQuarterlyChangeAboveSell: 'seasonalGDPQoQ',
  gdpQuarterlyChangeBelowSell: 'seasonalGDPQoQ',
  gdpQuarterlyYoYChangeAboveSell: 'seasonalGDPYoY',
  gdpQuarterlyYoYChangeBelowSell: 'seasonalGDPYoY',
}

export const getTickerMovementWeight = (
  tickerInfo: interfaces.dailyTickersModel.TickerInfo,
  tickerKey: interfaces.dailyTickersModel.TickerMovementKey,
  pattern: interfaces.traderPatternModel.Record,
  behavior: interfaces.traderPatternModel.MovementBehavior,
): number => {
  const tickerValue = tickerInfo[tickerKey]
  const patternValue = pattern[behavior]

  if (patternValue === null) return 1
  if (tickerValue === null || tickerValue === undefined || tickerValue < patternValue) return 0
  return tickerValue - patternValue + 2
}

export const getIndicatorMovementMatch = (
  indicatorInfo: interfaces.dailyTickersModel.IndicatorInfo,
  indicatorKey: interfaces.dailyTickersModel.IndicatorMovementKey,
  pattern: interfaces.traderPatternModel.Record,
  behavior: interfaces.traderPatternModel.MovementBehavior,
): boolean => {
  const indicatorValue = indicatorInfo[indicatorKey]
  const patternValue = pattern[behavior]

  if (patternValue === null) return true
  return indicatorValue !== null && indicatorValue >= patternValue
}

export const getIndicatorCompareMatch = (
  indicatorInfo: interfaces.dailyTickersModel.IndicatorInfo,
  compareKey: interfaces.dailyTickersModel.IndicatorCompareKey,
  pattern: interfaces.traderPatternModel.Record,
  behavior: interfaces.traderPatternModel.CompareBehavior,
): boolean => {
  const indicatorValue = indicatorInfo[compareKey]
  const patternValue = pattern[behavior]

  if (patternValue === null) return true
  if (indicatorValue === null) return false

  if (behavior.includes('Above') && indicatorValue > patternValue) {
    return true
  }

  if (behavior.includes('Below') && indicatorValue < patternValue) {
    return true
  }

  return false
}

export const getTickerMovementWeights = (
  pattern: interfaces.traderPatternModel.Record,
  tickerInfo: interfaces.dailyTickersModel.TickerInfo,
  movementBehaviors: interfaces.traderPatternModel.TickerMovementBehavior[],
) => {
  const movementWeights = movementBehaviors.reduce((
    weights: number, behavior,
  ): number => {
    if (!weights) return 0
    const tickerKey = TickerMovementTriggers[behavior]
    const currentWeight = getTickerMovementWeight(
      tickerInfo, tickerKey, pattern, behavior,
    )
    return weights * currentWeight
  }, 1)

  return movementWeights
}

export const getIndicatorMovementAndCompareMatches = (
  pattern: interfaces.traderPatternModel.Record,
  indicatorInfo: interfaces.dailyTickersModel.IndicatorInfo,
  movementBehaviors: interfaces.traderPatternModel.IndicatorMovementBehavior[],
  compareTriggers: interfaces.traderPatternModel.indicatorCompareBehavior[],
): boolean => {
  const movementMatches = movementBehaviors.every((behavior) => {
    const indicatorKey = IndicatorMovementTriggers[behavior]
    const isMatch = getIndicatorMovementMatch(
      indicatorInfo, indicatorKey, pattern, behavior,
    )
    return isMatch
  })

  if (!movementMatches) return false

  const compareMatches = compareTriggers.every((trigger) => {
    const indicatorKey = IndicatorCompareTriggers[trigger]
    const isMatch = getIndicatorCompareMatch(
      indicatorInfo, indicatorKey, pattern, trigger,
    )
    return isMatch
  })

  return compareMatches
}

interface TickerWithEvaluation {
  tickerId: number;
  preferValue: number;
  weight: number;
}

export const getTickerWithSellEvaluation = (
  tickerId: number,
  pattern: interfaces.traderPatternModel.Record,
  dailyTicker: interfaces.dailyTickersModel.DailyTicker | null,
): TickerWithEvaluation | null => {
  if (!dailyTicker) return null

  const preferValue = getTickerPreferValue(
    pattern.sellPreference, dailyTicker.daily, dailyTicker.quarterly, dailyTicker.yearly,
  )
  if (!preferValue && preferValue !== 0) return null

  const weight = getTickerMovementWeights(
    pattern,
    dailyTicker.info,
    constants.Behavior.TickerMovementSellBehaviors,
  )
  if (!weight) return null

  return {
    tickerId, preferValue, weight,
  }
}

export const getTickerWithBuyEvaluation = (
  tickerId: number,
  pattern: interfaces.traderPatternModel.Record,
  dailyTicker: interfaces.dailyTickersModel.DailyTicker | null,
): TickerWithEvaluation | null => {
  if (!dailyTicker) return null

  const preferValue = getTickerPreferValue(
    pattern.buyPreference, dailyTicker.daily, dailyTicker.quarterly, dailyTicker.yearly,
  )
  if (!preferValue && preferValue !== 0) return null

  const weight = getTickerMovementWeights(
    pattern,
    dailyTicker.info,
    constants.Behavior.TickerMovementBuyBehaviors,
  )

  if (!weight) return null

  return {
    tickerId, preferValue, weight,
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

export const getTickerBuyEaluations = (
  tickerIds: number[],
  pattern: interfaces.traderPatternModel.Record,
  dailyTickers: interfaces.dailyTickersModel.DailyTickers,
) => {
  const emptyEvaluations: TickerWithEvaluation[] = []
  const tickerEvaluations = tickerIds.reduce((evaluations, tickerId) => {
    const evaluation = getTickerWithBuyEvaluation(
      tickerId, pattern, dailyTickers[tickerId],
    )
    if (evaluation) evaluations.push(evaluation)
    return evaluations
  }, emptyEvaluations)
  const orderedEvaluations = getOrderedTickerEvaluations(tickerEvaluations, pattern.buyPreference)
  return orderedEvaluations
}

export const getIndicatorBuyMatches = (
  pattern: interfaces.traderPatternModel.Record,
  indicatorInfo: interfaces.dailyTickersModel.IndicatorInfo,
): boolean => {
  const shouldBuy = getIndicatorMovementAndCompareMatches(
    pattern,
    indicatorInfo,
    constants.Behavior.IndicatorMovementBuyBehaviors,
    constants.Behavior.IndicatorCompareBuyBehaviors,
  )
  return shouldBuy
}

export const getIndicatorSellMatches = (
  pattern: interfaces.traderPatternModel.Record,
  indicatorInfo: interfaces.dailyTickersModel.IndicatorInfo,
): boolean => {
  const shouldSell = getIndicatorMovementAndCompareMatches(
    pattern,
    indicatorInfo,
    constants.Behavior.IndicatorMovementSellBehaviors,
    constants.Behavior.IndicatorCompareSellBehaviors,
  )
  return shouldSell
}

export const getTickerSellEaluations = (
  tickerIds: number[],
  pattern: interfaces.traderPatternModel.Record,
  dailyTickers: interfaces.dailyTickersModel.DailyTickers,
): TickerWithEvaluation[] => {
  const emptyEvaluations: TickerWithEvaluation[] = []
  const tickerEvaluations = tickerIds.reduce((evaluations, tickerId) => {
    const evaluation = getTickerWithSellEvaluation(
      tickerId, pattern, dailyTickers[tickerId],
    )
    if (evaluation) evaluations.push(evaluation)
    return evaluations
  }, emptyEvaluations)
  const orderedEvaluations = getOrderedTickerEvaluations(tickerEvaluations, pattern.sellPreference)
  return orderedEvaluations
}
