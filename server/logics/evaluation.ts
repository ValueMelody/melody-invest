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

// table.smallint('peRatioQuarterlyAboveBuy')
//       table.smallint('peRatioQuarterlyAboveSell')
//       table.smallint('peRatioQuarterlyBelowBuy')
//       table.smallint('peRatioQuarterlyBelowSell')
//       table.smallint('pbRatioQuarterlyAboveBuy')
//       table.smallint('pbRatioQuarterlyAboveSell')
//       table.smallint('pbRatioQuarterlyBelowBuy')
//       table.smallint('pbRatioQuarterlyBelowSell')
//       table.smallint('psRatioQuarterlyAboveBuy')
//       table.smallint('psRatioQuarterlyAboveSell')
//       table.smallint('psRatioQuarterlyBelowBuy')
//       table.smallint('psRatioQuarterlyBelowSell')
//       table.smallint('roaQuarterlyAboveBuy')
//       table.smallint('roaQuarterlyAboveSell')
//       table.smallint('roaQuarterlyBelowBuy')
//       table.smallint('roaQuarterlyBelowSell')
//       table.smallint('roeQuarterlyAboveBuy')
//       table.smallint('roeQuarterlyAboveSell')
//       table.smallint('roeQuarterlyBelowBuy')
//       table.smallint('roeQuarterlyBelowSell')
//       table.smallint('grossMarginQuarterlyAboveBuy')
//       table.smallint('grossMarginQuarterlyAboveSell')
//       table.smallint('grossMarginQuarterlyBelowBuy')
//       table.smallint('grossMarginQuarterlyBelowSell')
//       table.smallint('debtEquityQuarterlyAboveBuy')
//       table.smallint('debtEquityQuarterlyAboveSell')
//       table.smallint('debtEquityQuarterlyBelowBuy')
//       table.smallint('debtEquityQuarterlyBelowSell')
// table.smallint('peRatioYearlyAboveBuy')
//       table.smallint('peRatioYearlyAboveSell')
//       table.smallint('peRatioYearlyBelowBuy')
//       table.smallint('peRatioYearlyBelowSell')
//       table.smallint('pbRatioYearlyAboveBuy')
//       table.smallint('pbRatioYearlyAboveSell')
//       table.smallint('pbRatioYearlyBelowBuy')
//       table.smallint('pbRatioYearlyBelowSell')
//       table.smallint('psRatioYearlyAboveBuy')
//       table.smallint('psRatioYearlyAboveSell')
//       table.smallint('psRatioYearlyBelowBuy')
//       table.smallint('psRatioYearlyBelowSell')

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

export const getTickerMovementWeight = (
  tickerInfo: interfaces.dailyTickersModel.TickerInfo,
  tickerKey: interfaces.dailyTickersModel.TickerMovementKey,
  pattern: interfaces.traderPatternModel.Record,
  behavior: interfaces.traderPatternModel.MovementBehavior,
): number => {
  const tickerValue = Number(tickerInfo[tickerKey])
  const patternValue = pattern[behavior]

  if (patternValue === null || patternValue === undefined) return 1
  if (tickerValue === null || tickerValue === undefined || tickerValue < patternValue) return 0
  return tickerValue - patternValue + 2
}

export const getIndicatorMovementMatch = (
  indicatorInfo: interfaces.dailyIndicatorsModel.IndicatorInfo,
  indicatorKey: interfaces.dailyIndicatorsModel.IndicatorMovementKey,
  pattern: interfaces.traderPatternModel.Record,
  behavior: interfaces.traderPatternModel.MovementBehavior,
): boolean => {
  const indicatorValue = Number(indicatorInfo[indicatorKey])
  const patternValue = pattern[behavior]

  if (patternValue === null || patternValue === undefined) return true
  return indicatorValue !== null && indicatorValue >= patternValue
}

export const getIndicatorCompareMatch = (
  indicatorInfo: interfaces.dailyIndicatorsModel.IndicatorInfo,
  compareKey: interfaces.dailyIndicatorsModel.IndicatorCompareKey,
  pattern: interfaces.traderPatternModel.Record,
  behavior: interfaces.traderPatternModel.CompareBehavior,
): boolean => {
  const indicatorValue = Number(indicatorInfo[compareKey])
  const patternValue = pattern[behavior]

  if (patternValue === null || patternValue === undefined) return true
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
  indicatorInfo: interfaces.dailyIndicatorsModel.IndicatorInfo,
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
  dailyTicker: interfaces.dailyTickersModel.TickerInfo | null,
): TickerWithEvaluation | null => {
  if (!dailyTicker) return null

  return null
  // const preferValue = getTickerPreferValue(
  //   pattern.sellPreference, dailyTicker.daily, dailyTicker.quarterly, dailyTicker.yearly,
  // )
  // if (!preferValue && preferValue !== 0) return null

  // const weight = getTickerMovementWeights(
  //   pattern,
  //   dailyTicker.info,
  //   constants.Behavior.TickerMovementSellBehaviors,
  // )
  // if (!weight) return null

  // return {
  //   tickerId, preferValue, weight,
  // }
}

export const getTickerWithBuyEvaluation = (
  tickerId: number,
  pattern: interfaces.traderPatternModel.Record,
  dailyTicker: interfaces.dailyTickersModel.TickerInfo | null,
): TickerWithEvaluation | null => {
  if (!dailyTicker) return null
  return null

  // const preferValue = getTickerPreferValue(
  //   pattern.buyPreference, dailyTicker.daily, dailyTicker.quarterly, dailyTicker.yearly,
  // )
  // if (!preferValue && preferValue !== 0) return null

  // const weight = getTickerMovementWeights(
  //   pattern,
  //   dailyTicker.info,
  //   constants.Behavior.TickerMovementBuyBehaviors,
  // )

  // if (!weight) return null

  // return {
  //   tickerId, preferValue, weight,
  // }
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
  dailyTickers: interfaces.dailyTickersModel.TickerInfos,
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
  indicatorInfo: interfaces.dailyIndicatorsModel.IndicatorInfo,
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
  indicatorInfo: interfaces.dailyIndicatorsModel.IndicatorInfo,
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
  dailyTickers: interfaces.dailyTickersModel.TickerInfos,
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
