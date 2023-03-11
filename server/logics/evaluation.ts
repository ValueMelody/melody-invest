
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

export const MovementTriggers: {
  [key in interfaces.traderPatternModel.MovementBehavior]: interfaces.dailyTickersModel.MovementKey
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
  epsQuarterlyBeatBuy: 'epsQuarterlyBeat',
  epsQuarterlyMissBuy: 'epsQuarterlyMiss',
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
  retailSalesMonthlyIncreaseBuy: 'retailSalesMonthlyIncrease',
  retailSalesMonthlyDecreaseBuy: 'retailSalesMonthlyDecrease',
  durableGoodsMonthlyIncreaseBuy: 'durableGoodsMonthlyIncrease',
  durableGoodsMonthlyDecreaseBuy: 'durableGoodsMonthlyDecrease',
  unemploymentRateMonthlyIncreaseBuy: 'unemploymentRateMonthlyIncrease',
  unemploymentRateMonthlyDecreaseBuy: 'unemploymentRateMonthlyDecrease',
  nonfarmPayrollMonthlyIncreaseBuy: 'nonfarmPayrollMonthlyIncrease',
  nonfarmPayrollMonthlyDecreaseBuy: 'nonfarmPayrollMonthlyDecrease',
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
  epsQuarterlyBeatSell: 'epsQuarterlyBeat',
  epsQuarterlyMissSell: 'epsQuarterlyMiss',
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
  retailSalesMonthlyIncreaseSell: 'retailSalesMonthlyIncrease',
  retailSalesMonthlyDecreaseSell: 'retailSalesMonthlyDecrease',
  durableGoodsMonthlyIncreaseSell: 'durableGoodsMonthlyIncrease',
  durableGoodsMonthlyDecreaseSell: 'durableGoodsMonthlyDecrease',
  unemploymentRateMonthlyIncreaseSell: 'unemploymentRateMonthlyIncrease',
  unemploymentRateMonthlyDecreaseSell: 'unemploymentRateMonthlyDecrease',
  nonfarmPayrollMonthlyIncreaseSell: 'nonfarmPayrollMonthlyIncrease',
  nonfarmPayrollMonthlyDecreaseSell: 'nonfarmPayrollMonthlyDecrease',
}

export const CompareTriggers: {
  [key in interfaces.traderPatternModel.CompareBehavior]: interfaces.dailyTickersModel.CompareKey
} = {
  gdpYearlyChangeAboveBuy: 'gdpYearlyChangePercent',
  gdpYearlyChangeBelowBuy: 'gdpYearlyChangePercent',
  gdpQuarterlyChangeAboveBuy: 'gdpQuarterlyChangePercent',
  gdpQuarterlyChangeBelowBuy: 'gdpQuarterlyChangePercent',
  gdpQuarterlyYoYChangeAboveBuy: 'gdpQuarterlyYoYChangePercent',
  gdpQuarterlyYoYChangeBelowBuy: 'gdpQuarterlyYoYChangePercent',
  gdpYearlyChangeAboveSell: 'gdpYearlyChangePercent',
  gdpYearlyChangeBelowSell: 'gdpYearlyChangePercent',
  gdpQuarterlyChangeAboveSell: 'gdpQuarterlyChangePercent',
  gdpQuarterlyChangeBelowSell: 'gdpQuarterlyChangePercent',
  gdpQuarterlyYoYChangeAboveSell: 'gdpQuarterlyYoYChangePercent',
  gdpQuarterlyYoYChangeBelowSell: 'gdpQuarterlyYoYChangePercent',
}

export const getTickerMovementWeight = (
  tickerInfo: interfaces.dailyTickersModel.TickerInfo,
  tickerKey: interfaces.dailyTickersModel.MovementKey,
  pattern: interfaces.traderPatternModel.Record,
  behavior: interfaces.traderPatternModel.MovementBehavior,
): number => {
  const tickerValue = tickerInfo[tickerKey]
  const patternValue = pattern[behavior]

  if (!patternValue) return 1
  if (!tickerValue || tickerValue < patternValue) return 0
  return tickerValue - patternValue + 2
}

export const getTickerCompareWeight = (
  tickerInfo: interfaces.dailyTickersModel.TickerInfo,
  tickerKey: interfaces.dailyTickersModel.CompareKey,
  pattern: interfaces.traderPatternModel.Record,
  behavior: interfaces.traderPatternModel.CompareBehavior,
): number => {
  const tickerValue = tickerInfo[tickerKey]
  const patternValue = pattern[behavior]

  if (!patternValue && patternValue !== 0) return 1
  if (behavior.includes('Above') && tickerValue && tickerValue > patternValue) {
    return Math.abs(tickerValue - patternValue) + 2
  }

  if (behavior.includes('Below') && tickerValue && tickerValue < patternValue) {
    return Math.abs(patternValue - tickerValue) + 2
  }

  return 0
}

export const getMovementAndCompareWeights = (
  pattern: interfaces.traderPatternModel.Record,
  tickerInfo: interfaces.dailyTickersModel.TickerInfo,
  movementBehaviors: interfaces.traderPatternModel.MovementBehavior[],
  compareTriggers: interfaces.traderPatternModel.CompareBehavior[],
) => {
  const movementWeights = movementBehaviors.reduce((
    weights: number, behavior,
  ): number => {
    const tickerKey = MovementTriggers[behavior]
    const currentWeight = getTickerMovementWeight(
      tickerInfo, tickerKey, pattern, behavior,
    )
    return weights * currentWeight
  }, 1)

  const compareWeights = compareTriggers.reduce((
    weights: number, behavior,
  ): number => {
    const tickerKey = CompareTriggers[behavior]
    const currentWeight = getTickerCompareWeight(
      tickerInfo, tickerKey, pattern, behavior,
    )
    return weights * currentWeight
  }, 1)

  if (!movementWeights || !compareWeights) return 0

  return movementWeights * compareWeights
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

  const weight = getMovementAndCompareWeights(
    pattern,
    dailyTicker.info,
    constants.Behavior.MovementSellBehaviors,
    constants.Behavior.CompareSellBehaviors,
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

  const weight = getMovementAndCompareWeights(
    pattern,
    dailyTicker.info,
    constants.Behavior.MovementBuyBehaviors,
    constants.Behavior.CompareBuyBehaviors,
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
