import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'

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

const SELL_MOVEMENT_TRIGGERS: {
  [key in interfaces.traderPatternModel.MovementSellBehavior]: interfaces.dailyTickersModel.MovementKey
} = {
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

const SELL_COMPARE_TRIGGERS: {
  [key in interfaces.traderPatternModel.CompareSellBehavior]: interfaces.dailyTickersModel.CompareKey
} = {
  gdpYearlyChangeAboveSell: 'gdpYearlyChangePercent',
  gdpYearlyChangeBelowSell: 'gdpYearlyChangePercent',
  gdpQuarterlyChangeAboveSell: 'gdpQuarterlyChangePercent',
  gdpQuarterlyChangeBelowSell: 'gdpQuarterlyChangePercent',
  gdpQuarterlyYoYChangeAboveSell: 'gdpQuarterlyYoYChangePercent',
  gdpQuarterlyYoYChangeBelowSell: 'gdpQuarterlyYoYChangePercent',
}

export const getTickerSellWeight = (
  pattern: interfaces.traderPatternModel.Record,
  tickerInfo: interfaces.dailyTickersModel.TickerInfo,
): number => {
  const movementTriggers = Object.keys(SELL_MOVEMENT_TRIGGERS) as Array<keyof typeof SELL_MOVEMENT_TRIGGERS>
  const compareTriggers = Object.keys(SELL_COMPARE_TRIGGERS) as Array<keyof typeof SELL_COMPARE_TRIGGERS>

  const movementWeights = movementTriggers.reduce((
    weights: number, behavior,
  ): number => {
    const tickerKey = SELL_MOVEMENT_TRIGGERS[behavior]
    const tickerValue = tickerInfo[tickerKey]
    const patternValue = pattern[behavior]

    if (!patternValue) return weights
    if (!tickerValue || tickerValue < patternValue) return 0
    return weights * (tickerValue - patternValue + 2)
  }, 1)

  const compareWeights = compareTriggers.reduce((
    weights: number, behavior,
  ): number => {
    const tickerKey = SELL_COMPARE_TRIGGERS[behavior]
    const tickerValue = tickerInfo[tickerKey]
    const patternValue = pattern[behavior]

    if (patternValue === null) return weights
    if (behavior.includes('Above') && tickerValue && tickerValue > patternValue) {
      return weights * (tickerValue - patternValue + 2)
    }

    if (behavior.includes('Below') && tickerValue && tickerValue < patternValue) {
      return weights * (tickerValue - patternValue + 2)
    }

    return 0
  }, 1)

  if (!movementWeights || !compareWeights) return 0

  return movementWeights * compareWeights
}

const BUY_MOVEMENT_TRIGGERS: {
  [key in interfaces.traderPatternModel.MovementBuyBehavior]: interfaces.dailyTickersModel.MovementKey
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
  inflationYearlyIncreaseBuy: 'inflationMonthlyIncrease',
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
}

const BUY_COMPARE_TRIGGERS: {
  [key in interfaces.traderPatternModel.CompareBuyBehavior]: interfaces.dailyTickersModel.CompareKey
} = {
  gdpYearlyChangeAboveBuy: 'gdpYearlyChangePercent',
  gdpYearlyChangeBelowBuy: 'gdpYearlyChangePercent',
  gdpQuarterlyChangeAboveBuy: 'gdpQuarterlyChangePercent',
  gdpQuarterlyChangeBelowBuy: 'gdpQuarterlyChangePercent',
  gdpQuarterlyYoYChangeAboveBuy: 'gdpQuarterlyChangePercent',
  gdpQuarterlyYoYChangeBelowBuy: 'gdpQuarterlyChangePercent',
}

export const getTickerBuyWeight = (
  pattern: interfaces.traderPatternModel.Record,
  tickerInfo: interfaces.dailyTickersModel.TickerInfo,
): number => {
  const movementTriggers = Object.keys(BUY_MOVEMENT_TRIGGERS) as Array<keyof typeof BUY_MOVEMENT_TRIGGERS>
  const compareTriggers = Object.keys(BUY_COMPARE_TRIGGERS) as Array<keyof typeof BUY_COMPARE_TRIGGERS>

  const movementWeights = movementTriggers.reduce((
    weights: number, behavior,
  ): number => {
    const tickerKey = BUY_MOVEMENT_TRIGGERS[behavior]
    const tickerValue = tickerInfo[tickerKey]
    const patternValue = pattern[behavior]

    if (!patternValue) return weights
    if (!tickerValue || tickerValue < patternValue) return 0
    return weights * (tickerValue - patternValue + 2)
  }, 1)

  const compareWeights = compareTriggers.reduce((
    weights: number, behavior,
  ): number => {
    const tickerKey = BUY_COMPARE_TRIGGERS[behavior]
    const tickerValue = tickerInfo[tickerKey]
    const patternValue = pattern[behavior]

    if (patternValue === null) return weights
    if (behavior.includes('Above') && tickerValue && tickerValue > patternValue) {
      return weights * (tickerValue - patternValue + 2)
    }

    if (behavior.includes('Below') && tickerValue && tickerValue < patternValue) {
      return weights * (tickerValue - patternValue + 2)
    }

    return 0
  }, 1)

  if (!movementWeights || !compareWeights) return 0

  return movementWeights * compareWeights
}

interface TickerWithEvaluation {
  tickerId: number;
  preferValue: number;
  weight: number;
}

const getTickersWithSellEvaluation = (
  tickerId: number,
  pattern: interfaces.traderPatternModel.Record,
  dailyTicker: interfaces.dailyTickersModel.DailyTicker,
): TickerWithEvaluation | null => {
  if (!dailyTicker) return null

  const preferValue = getTickerPreferValue(
    pattern.sellPreference, dailyTicker.daily, dailyTicker.quarterly, dailyTicker.yearly,
  )
  if (preferValue === null) return null

  const weight = getTickerSellWeight(pattern, dailyTicker.info)
  if (!weight) return null

  return {
    tickerId, preferValue, weight,
  }
}

const getTickersWithBuyEvaluation = (
  tickerId: number,
  pattern: interfaces.traderPatternModel.Record,
  dailyTicker: interfaces.dailyTickersModel.DailyTicker,
): TickerWithEvaluation | null => {
  if (!dailyTicker) return null

  const preferValue = getTickerPreferValue(
    pattern.buyPreference, dailyTicker.daily, dailyTicker.quarterly, dailyTicker.yearly,
  )
  if (preferValue === null) return null

  const weight = getTickerBuyWeight(pattern, dailyTicker.info)
  if (!weight) return null

  return {
    tickerId, preferValue, weight,
  }
}

const getOrderedTickerEvaluations = (
  evaluations: TickerWithEvaluation[],
) => {
  return evaluations.sort((first, second) => {
    if (first.weight > second.weight) return -1
    if (first.weight < second.weight) return 1
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
    const evaluation = getTickersWithBuyEvaluation(
      tickerId, pattern, dailyTickers[tickerId],
    )
    if (!evaluation) return evaluations
    return [...evaluations, evaluation]
  }, emptyEvaluations)
  const orderedEvaluations = getOrderedTickerEvaluations(tickerEvaluations)
  return orderedEvaluations
}

export const getTickerSellEaluations = (
  tickerIds: number[],
  pattern: interfaces.traderPatternModel.Record,
  dailyTickers: interfaces.dailyTickersModel.DailyTickers,
): TickerWithEvaluation[] => {
  const emptyEvaluations: TickerWithEvaluation[] = []
  const tickerEvaluations = tickerIds.reduce((evaluations, tickerId) => {
    const evaluation = getTickersWithSellEvaluation(
      tickerId, pattern, dailyTickers[tickerId],
    )
    if (!evaluation) return evaluations
    return [...evaluations, evaluation]
  }, emptyEvaluations)
  const orderedEvaluations = getOrderedTickerEvaluations(tickerEvaluations)
  return orderedEvaluations
}
