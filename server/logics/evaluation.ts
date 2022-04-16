import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'

export const getTickerPreferValue = (
  preference: number,
  tickerDaily: interfaces.tickerDailyModel.Record,
  tickerQuarterly: interfaces.tickerQuarterlyModel.Record | null,
  tickerYearly: interfaces.tickerYearlyModel.Record | null,
): number | null => {
  switch (preference) {
    case constants.behaviorValue.preference.HIGHER_PRICE:
    case constants.behaviorValue.preference.LOWER_PRICE:
      return tickerDaily.closePrice
    case constants.behaviorValue.preference.HIGHER_QUARTER_EPS:
    case constants.behaviorValue.preference.LOWER_QUARTER_EPS:
      return tickerQuarterly ? tickerQuarterly.eps : null
    case constants.behaviorValue.preference.HIGHER_QUARTER_EBITDA:
    case constants.behaviorValue.preference.LOWER_QUARTER_EBITDA:
      return tickerQuarterly ? tickerQuarterly.ebitda : null
    case constants.behaviorValue.preference.HIGHER_QUARTER_INCOME:
    case constants.behaviorValue.preference.LOWER_QUARTER_INCOME:
      return tickerQuarterly ? tickerQuarterly.netIncome : null
    case constants.behaviorValue.preference.HIGHER_QUARTER_PROFIT:
    case constants.behaviorValue.preference.LOWER_QUARTER_PROFIT:
      return tickerQuarterly ? tickerQuarterly.grossProfit : null
    case constants.behaviorValue.preference.HIGHER_QUARTER_REVENUE:
    case constants.behaviorValue.preference.LOWER_QUARTER_REVENUE:
      return tickerQuarterly ? tickerQuarterly.totalRevenue : null
    case constants.behaviorValue.preference.HIGHER_YEAR_EPS:
    case constants.behaviorValue.preference.LOWER_YEAR_EPS:
      return tickerYearly ? tickerYearly.eps : null
    case constants.behaviorValue.preference.HIGHER_YEAR_EBITDA:
    case constants.behaviorValue.preference.LOWER_YEAR_EBITDA:
      return tickerYearly ? tickerYearly.ebitda : null
    case constants.behaviorValue.preference.HIGHER_YEAR_INCOME:
    case constants.behaviorValue.preference.LOWER_YEAR_INCOME:
      return tickerYearly ? tickerYearly.netIncome : null
    case constants.behaviorValue.preference.HIGHER_YEAR_PROFIT:
    case constants.behaviorValue.preference.LOWER_YEAR_PROFIT:
      return tickerYearly ? tickerYearly.grossProfit : null
    case constants.behaviorValue.preference.HIGHER_YEAR_REVENUE:
    case constants.behaviorValue.preference.LOWER_YEAR_REVENUE:
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

interface TickerWithEvaluation {
  tickerId: number;
  preferValue: number;
  weight: number;
}

const getTickersWithEvaluation = (
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

const getOrderedTickerEvaluations = (
  evaluations: TickerWithEvaluation[],
) => {
  return evaluations.sort((first, second) => {
    if (first.weight > second.weight) return -1
    if (first.weight < second.weight) return 1
    return first.preferValue >= second.preferValue ? -1 : 1
  })
}

export const getTickersSellOrdering = (
  tickerIds: number[],
  pattern: interfaces.traderPatternModel.Record,
  dailyTickers: interfaces.dailyTickersModel.DailyTickers,
): number[] => {
  const emptyEvaluations: TickerWithEvaluation[] = []
  const tickerEvaluations = tickerIds.reduce((evaluations, tickerId) => {
    const evaluation = getTickersWithEvaluation(
      tickerId, pattern, dailyTickers[tickerId],
    )
    if (!evaluation) return evaluations
    return [...evaluations, evaluation]
  }, emptyEvaluations)
  const orderedEvaluations = getOrderedTickerEvaluations(tickerEvaluations)
  return orderedEvaluations.map((evaluation) => evaluation.tickerId)
}
