import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as generateTool from '../tools/generate'

const BEHAVIOR_GROUPS: interfaces.traderPatternModel.Behavior[][] = [
  constants.behavior.buyBehaviors,
  constants.behavior.sellBehaviors,
  ['cashMaxPercent'],
  ['tickerMinPercent'],
  ['tickerMaxPercent'],
  ['holdingBuyPercent'],
  ['holdingSellPercent'],
  ['tradeFrequency'],
  ['rebalanceFrequency'],
  ['buyPreference'],
  ['sellPreference'],
]

interface Behavior {
  type: interfaces.traderPatternModel.Behavior;
  value: number;
}

type MovementKey =
  interfaces.tickerDailyModel.MovementKey |
  interfaces.tickerQuarterlyModel.MovementKey |
  interfaces.tickerYearlyModel.MovementKey |
  interfaces.indicatorYearlyModel.MovementKey |
  interfaces.indicatorMonthlyModel.MovementKey

type CompareKey =
  interfaces.indicatorYearlyModel.CompareKey |
  interfaces.indicatorQuarterlyModel.CompareKey

type TickerInfo = {
  [key in MovementKey | CompareKey]: number | null;
}

export const buildInitialTickerInfo = (
  tickerDaily: interfaces.tickerDailyModel.Record,
  tickerQuarterly: interfaces.tickerQuarterlyModel.Record | null,
  tickerYearly: interfaces.tickerYearlyModel.Record | null,
  indicatorMonthly: interfaces.indicatorMonthlyModel.Record | null,
  indicatorQuarterly: interfaces.indicatorQuarterlyModel.Record | null,
  indicatorYearly: interfaces.indicatorYearlyModel.Record | null,
): TickerInfo => {
  return {
    ...tickerDaily,
    epsQuarterlyBeat: tickerQuarterly ? tickerQuarterly.epsQuarterlyBeat : null,
    epsQuarterlyMiss: tickerQuarterly ? tickerQuarterly.epsQuarterlyMiss : null,
    profitQuarterlyIncrease: tickerQuarterly ? tickerQuarterly.profitQuarterlyIncrease : null,
    profitQuarterlyDecrease: tickerQuarterly ? tickerQuarterly.profitQuarterlyDecrease : null,
    incomeQuarterlyIncrease: tickerQuarterly ? tickerQuarterly.incomeQuarterlyIncrease : null,
    incomeQuarterlyDecrease: tickerQuarterly ? tickerQuarterly.incomeQuarterlyDecrease : null,
    revenueQuarterlyIncrease: tickerQuarterly ? tickerQuarterly.revenueQuarterlyIncrease : null,
    revenueQuarterlyDecrease: tickerQuarterly ? tickerQuarterly.revenueQuarterlyDecrease : null,
    profitYearlyIncrease: tickerYearly ? tickerYearly.profitYearlyIncrease : null,
    profitYearlyDecrease: tickerYearly ? tickerYearly.profitYearlyDecrease : null,
    incomeYearlyIncrease: tickerYearly ? tickerYearly.incomeYearlyIncrease : null,
    incomeYearlyDecrease: tickerYearly ? tickerYearly.incomeYearlyDecrease : null,
    revenueYearlyIncrease: tickerYearly ? tickerYearly.revenueYearlyIncrease : null,
    revenueYearlyDecrease: tickerYearly ? tickerYearly.revenueYearlyDecrease : null,
    inflationYearlyIncrease: indicatorYearly ? indicatorYearly.inflationYearlyIncrease : null,
    inflationYearlyDecrease: indicatorYearly ? indicatorYearly.inflationYearlyDecrease : null,
    gdpYearlyChangePercent: indicatorYearly ? indicatorYearly.gdpYearlyChangePercent : null,
    gdpQuarterlyChangePercent: indicatorQuarterly ? indicatorQuarterly.gdpQuarterlyChangePercent : null,
    gdpQuarterlyYoYChangePercent: indicatorQuarterly ? indicatorQuarterly.gdpQuarterlyYoYChangePercent : null,
    fundsRateMonthlyIncrease: indicatorMonthly ? indicatorMonthly.fundsRateMonthlyIncrease : null,
    fundsRateMonthlyDecrease: indicatorMonthly ? indicatorMonthly.fundsRateMonthlyDecrease : null,
    thirtyYearsTreasuryMonthlyIncrease: indicatorMonthly ? indicatorMonthly.thirtyYearsTreasuryMonthlyIncrease : null,
    thirtyYearsTreasuryMonthlyDecrease: indicatorMonthly ? indicatorMonthly.thirtyYearsTreasuryMonthlyDecrease : null,
    tenYearsTreasuryMonthlyIncrease: indicatorMonthly ? indicatorMonthly.tenYearsTreasuryMonthlyIncrease : null,
    tenYearsTreasuryMonthlyDecrease: indicatorMonthly ? indicatorMonthly.tenYearsTreasuryMonthlyDecrease : null,
    inflationMonthlyIncrease: indicatorMonthly ? indicatorMonthly.inflationMonthlyIncrease : null,
    inflationMonthlyDecrease: indicatorMonthly ? indicatorMonthly.inflationMonthlyDecrease : null,
    cpiMonthlyIncrease: indicatorMonthly ? indicatorMonthly.cpiMonthlyIncrease : null,
    cpiMonthlyDecrease: indicatorMonthly ? indicatorMonthly.cpiMonthlyDecrease : null,
    consumerSentimentMonthlyIncrease: indicatorMonthly ? indicatorMonthly.consumerSentimentMonthlyIncrease : null,
    consumerSentimentMonthlyDecrease: indicatorMonthly ? indicatorMonthly.consumerSentimentMonthlyDecrease : null,
    retailSalesMonthlyIncrease: indicatorMonthly ? indicatorMonthly.retailSalesMonthlyIncrease : null,
    retailSalesMonthlyDecrease: indicatorMonthly ? indicatorMonthly.retailSalesMonthlyDecrease : null,
    durableGoodsMonthlyIncrease: indicatorMonthly ? indicatorMonthly.durableGoodsMonthlyIncrease : null,
    durableGoodsMonthlyDecrease: indicatorMonthly ? indicatorMonthly.durableGoodsMonthlyDecrease : null,
    unemploymentRateMonthlyIncrease: indicatorMonthly ? indicatorMonthly.unemploymentRateMonthlyIncrease : null,
    unemploymentRateMonthlyDecrease: indicatorMonthly ? indicatorMonthly.unemploymentRateMonthlyDecrease : null,
    nonfarmPayrollMonthlyIncrease: indicatorMonthly ? indicatorMonthly.nonfarmPayrollMonthlyIncrease : null,
    nonfarmPayrollMonthlyDecrease: indicatorMonthly ? indicatorMonthly.nonfarmPayrollMonthlyDecrease : null,
  }
}

export const getPriceMovementBuyWeights = (
  pattern: interfaces.traderPatternModel.Record,
  tickerInfo: TickerInfo,
): number => {
  const MOVEMENT_TRIGGERS: {
    [key in interfaces.traderPatternModel.MovementBuyBehavior]: MovementKey
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

  const COMPARE_TRIGGERS: {
    [key in interfaces.traderPatternModel.CompareBuyBehavior]: CompareKey
  } = {
    gdpYearlyChangeAboveBuy: 'gdpYearlyChangePercent',
    gdpYearlyChangeBelowBuy: 'gdpYearlyChangePercent',
    gdpQuarterlyChangeAboveBuy: 'gdpQuarterlyChangePercent',
    gdpQuarterlyChangeBelowBuy: 'gdpQuarterlyChangePercent',
    gdpQuarterlyYoYChangeAboveBuy: 'gdpQuarterlyChangePercent',
    gdpQuarterlyYoYChangeBelowBuy: 'gdpQuarterlyChangePercent',
  }

  const movementTriggers = Object.keys(MOVEMENT_TRIGGERS) as Array<keyof typeof MOVEMENT_TRIGGERS>
  const compareTriggers = Object.keys(COMPARE_TRIGGERS) as Array<keyof typeof COMPARE_TRIGGERS>

  const movementWeights = movementTriggers.reduce((
    weights: number, behavior,
  ): number => {
    const tickerKey = MOVEMENT_TRIGGERS[behavior]
    const tickerValue = tickerInfo[tickerKey]
    const patternValue = pattern[behavior]

    if (!patternValue) return weights
    if (!tickerValue || tickerValue < patternValue) return 0
    return weights * (tickerValue - patternValue + 2)
  }, 1)

  const compareWeights = compareTriggers.reduce((
    weights: number, behavior,
  ): number => {
    const tickerKey = COMPARE_TRIGGERS[behavior]
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

export const getPriceMovementSellWeights = (
  pattern: interfaces.traderPatternModel.Record,
  tickerInfo: TickerInfo,
): number => {
  const MOVEMENT_TRIGGERS: {
    [key in interfaces.traderPatternModel.MovementSellBehavior]: MovementKey
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

  const COMPARE_TRIGGERS: {
    [key in interfaces.traderPatternModel.CompareSellBehavior]: CompareKey
  } = {
    gdpYearlyChangeAboveSell: 'gdpYearlyChangePercent',
    gdpYearlyChangeBelowSell: 'gdpYearlyChangePercent',
    gdpQuarterlyChangeAboveSell: 'gdpQuarterlyChangePercent',
    gdpQuarterlyChangeBelowSell: 'gdpQuarterlyChangePercent',
    gdpQuarterlyYoYChangeAboveSell: 'gdpQuarterlyYoYChangePercent',
    gdpQuarterlyYoYChangeBelowSell: 'gdpQuarterlyYoYChangePercent',
  }

  const movementTriggers = Object.keys(MOVEMENT_TRIGGERS) as Array<keyof typeof MOVEMENT_TRIGGERS>
  const compareTriggers = Object.keys(COMPARE_TRIGGERS) as Array<keyof typeof COMPARE_TRIGGERS>

  const movementWeights = movementTriggers.reduce((
    weights: number, behavior,
  ): number => {
    const tickerKey = MOVEMENT_TRIGGERS[behavior]
    const tickerValue = tickerInfo[tickerKey]
    const patternValue = pattern[behavior]

    if (!patternValue) return weights
    if (!tickerValue || tickerValue < patternValue) return 0
    return weights * (tickerValue - patternValue + 2)
  }, 1)

  const compareWeights = compareTriggers.reduce((
    weights: number, behavior,
  ): number => {
    const tickerKey = COMPARE_TRIGGERS[behavior]
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

export const getPatternHashCode = (
  pattern: interfaces.traderPatternModel.Record | interfaces.traderPatternModel.Create,
): string => {
  const template = BEHAVIOR_GROUPS.map((group) => group.map((behavior) => pattern[behavior]))
  return generateTool.toSHA512(JSON.stringify(template))
}

export const groupPatternCouples = (
  traders: interfaces.traderModel.Record[],
): interfaces.traderModel.Record[][] => {
  return traders.reduce((couples: interfaces.traderModel.Record[][], trader, index) => {
    if (index % 2 === 0) {
      return [...couples, [trader]]
    }

    const lastCouple = [...couples[couples.length - 1], trader]
    return couples.map((couple, i) => i === couples.length - 1 ? lastCouple : couple)
  }, [])
}

const pickTradingPatterns = (
  behaviorTypes: interfaces.traderPatternModel.Behavior[],
  first: interfaces.traderPatternModel.Record,
  second: interfaces.traderPatternModel.Record,
): Behavior[] => {
  const allValues = behaviorTypes.reduce((
    values: Behavior[], type: interfaces.traderPatternModel.Behavior,
  ): Behavior[] => {
    if (first[type]) return [...values, { type, value: first[type]! }]
    if (second[type]) return [...values, { type, value: second[type]! }]
    return values
  }, [])
  const remainingTotal = Math.floor(allValues.length / 2) || 1
  const chanceOfStay = remainingTotal * 100 / allValues.length
  const subValues = allValues.reduce((values: Behavior[], value: Behavior) => {
    const shouldStay = generateTool.pickNumberInRange(1, 100) <= chanceOfStay
    const hasRoom = values.length < remainingTotal
    if (shouldStay && hasRoom) return [...values, value]
    return values
  }, [])

  if (!subValues.length) {
    const index = generateTool.pickNumberInRange(0, allValues.length - 1)
    subValues.push(allValues[index])
  }

  return subValues
}

export const generatePatternChild = (
  first: interfaces.traderPatternModel.Record,
  second: interfaces.traderPatternModel.Record,
  shouldMutate: boolean = false,
) => {
  const newChild: interfaces.traderPatternModel.Create = {
    hashCode: '',
    priceDailyIncreaseBuy: null,
    priceDailyIncreaseSell: null,
    priceDailyDecreaseBuy: null,
    priceDailyDecreaseSell: null,
    priceWeeklyIncreaseBuy: null,
    priceWeeklyIncreaseSell: null,
    priceWeeklyDecreaseBuy: null,
    priceWeeklyDecreaseSell: null,
    priceMonthlyIncreaseBuy: null,
    priceMonthlyIncreaseSell: null,
    priceMonthlyDecreaseBuy: null,
    priceMonthlyDecreaseSell: null,
    priceQuarterlyIncreaseBuy: null,
    priceQuarterlyIncreaseSell: null,
    priceQuarterlyDecreaseBuy: null,
    priceQuarterlyDecreaseSell: null,
    priceYearlyIncreaseBuy: null,
    priceYearlyIncreaseSell: null,
    priceYearlyDecreaseBuy: null,
    priceYearlyDecreaseSell: null,
    epsQuarterlyBeatBuy: null,
    epsQuarterlyMissBuy: null,
    epsQuarterlyBeatSell: null,
    epsQuarterlyMissSell: null,
    profitQuarterlyIncreaseBuy: null,
    profitQuarterlyDecreaseBuy: null,
    incomeQuarterlyIncreaseBuy: null,
    incomeQuarterlyDecreaseBuy: null,
    revenueQuarterlyIncreaseBuy: null,
    revenueQuarterlyDecreaseBuy: null,
    profitQuarterlyIncreaseSell: null,
    profitQuarterlyDecreaseSell: null,
    incomeQuarterlyIncreaseSell: null,
    incomeQuarterlyDecreaseSell: null,
    revenueQuarterlyIncreaseSell: null,
    revenueQuarterlyDecreaseSell: null,
    profitYearlyIncreaseBuy: null,
    profitYearlyDecreaseBuy: null,
    incomeYearlyIncreaseBuy: null,
    incomeYearlyDecreaseBuy: null,
    revenueYearlyIncreaseBuy: null,
    revenueYearlyDecreaseBuy: null,
    profitYearlyIncreaseSell: null,
    profitYearlyDecreaseSell: null,
    incomeYearlyIncreaseSell: null,
    incomeYearlyDecreaseSell: null,
    revenueYearlyIncreaseSell: null,
    revenueYearlyDecreaseSell: null,
    inflationYearlyIncreaseBuy: null,
    inflationYearlyDecreaseBuy: null,
    inflationYearlyIncreaseSell: null,
    inflationYearlyDecreaseSell: null,
    fundsRateMonthlyIncreaseBuy: null,
    fundsRateMonthlyDecreaseBuy: null,
    fundsRateMonthlyIncreaseSell: null,
    fundsRateMonthlyDecreaseSell: null,
    thirtyYearsTreasuryMonthlyIncreaseBuy: null,
    thirtyYearsTreasuryMonthlyDecreaseBuy: null,
    thirtyYearsTreasuryMonthlyIncreaseSell: null,
    thirtyYearsTreasuryMonthlyDecreaseSell: null,
    tenYearsTreasuryMonthlyIncreaseBuy: null,
    tenYearsTreasuryMonthlyDecreaseBuy: null,
    tenYearsTreasuryMonthlyIncreaseSell: null,
    tenYearsTreasuryMonthlyDecreaseSell: null,
    inflationMonthlyIncreaseBuy: null,
    inflationMonthlyDecreaseBuy: null,
    inflationMonthlyIncreaseSell: null,
    inflationMonthlyDecreaseSell: null,
    cpiMonthlyIncreaseBuy: null,
    cpiMonthlyDecreaseBuy: null,
    cpiMonthlyIncreaseSell: null,
    cpiMonthlyDecreaseSell: null,
    consumerSentimentMonthlyIncreaseBuy: null,
    consumerSentimentMonthlyDecreaseBuy: null,
    consumerSentimentMonthlyIncreaseSell: null,
    consumerSentimentMonthlyDecreaseSell: null,
    retailSalesMonthlyIncreaseBuy: null,
    retailSalesMonthlyDecreaseBuy: null,
    retailSalesMonthlyIncreaseSell: null,
    retailSalesMonthlyDecreaseSell: null,
    durableGoodsMonthlyIncreaseBuy: null,
    durableGoodsMonthlyDecreaseBuy: null,
    durableGoodsMonthlyIncreaseSell: null,
    durableGoodsMonthlyDecreaseSell: null,
    unemploymentRateMonthlyIncreaseBuy: null,
    unemploymentRateMonthlyDecreaseBuy: null,
    unemploymentRateMonthlyIncreaseSell: null,
    unemploymentRateMonthlyDecreaseSell: null,
    nonfarmPayrollMonthlyIncreaseBuy: null,
    nonfarmPayrollMonthlyDecreaseBuy: null,
    nonfarmPayrollMonthlyIncreaseSell: null,
    nonfarmPayrollMonthlyDecreaseSell: null,
    gdpYearlyChangeAboveBuy: null,
    gdpYearlyChangeAboveSell: null,
    gdpYearlyChangeBelowBuy: null,
    gdpYearlyChangeBelowSell: null,
    gdpQuarterlyChangeAboveBuy: null,
    gdpQuarterlyChangeAboveSell: null,
    gdpQuarterlyChangeBelowBuy: null,
    gdpQuarterlyChangeBelowSell: null,
    gdpQuarterlyYoYChangeAboveBuy: null,
    gdpQuarterlyYoYChangeAboveSell: null,
    gdpQuarterlyYoYChangeBelowBuy: null,
    gdpQuarterlyYoYChangeBelowSell: null,
    cashMaxPercent: generateTool.pickOneNumber(first.cashMaxPercent, second.cashMaxPercent),
    tickerMinPercent: generateTool.pickOneNumber(first.tickerMinPercent, second.tickerMinPercent),
    tickerMaxPercent: generateTool.pickOneNumber(first.tickerMaxPercent, second.tickerMaxPercent),
    holdingBuyPercent: generateTool.pickOneNumber(first.holdingBuyPercent, second.holdingBuyPercent),
    holdingSellPercent: generateTool.pickOneNumber(first.holdingSellPercent, second.holdingSellPercent),
    tradeFrequency: generateTool.pickOneNumber(first.tradeFrequency, second.tradeFrequency),
    rebalanceFrequency: generateTool.pickOneNumber(first.rebalanceFrequency, second.rebalanceFrequency),
    buyPreference: generateTool.pickOneNumber(first.buyPreference, second.buyPreference),
    sellPreference: generateTool.pickOneNumber(first.sellPreference, second.sellPreference),
  }

  const buyBehaviorKeys = BEHAVIOR_GROUPS[0]
  const childBuyBehaviors = pickTradingPatterns(buyBehaviorKeys, first, second)
  childBuyBehaviors.forEach((behavior) => {
    newChild[behavior.type] = newChild[behavior.type]
      ? generateTool.pickOneNumber(behavior.value, newChild[behavior.type]!)
      : behavior.value
  })

  const sellBehaviorKeys = BEHAVIOR_GROUPS[1]
  const childSellBehaviors = pickTradingPatterns(sellBehaviorKeys, first, second)
  childSellBehaviors.forEach((behavior) => {
    newChild[behavior.type] = newChild[behavior.type]
      ? generateTool.pickOneNumber(behavior.value, newChild[behavior.type]!)
      : behavior.value
  })

  if (shouldMutate) {
    const potentialKeys = Object.keys(constants.behaviorValue.options) as Array<
      keyof typeof constants.behaviorValue.options
    >
    const keyIndex = generateTool.pickNumberInRange(0, potentialKeys.length - 1)
    const behaviorKey = potentialKeys[keyIndex]
    const potentialValues = constants.behaviorValue.options[behaviorKey]
    const valueIndex = generateTool.pickNumberInRange(0, potentialValues.length - 1)
    const behaviorValue = potentialValues[valueIndex]
    newChild[behaviorKey] = behaviorValue
  }

  newChild.hashCode = getPatternHashCode(newChild)

  return newChild
}
