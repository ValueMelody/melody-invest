import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as generateTool from '../tools/generate'

const BEHAVIOR_GROUPS: interfaces.traderPatternModel.Behavior[][] = [
  constants.Behavior.BuyBehaviors,
  constants.Behavior.SellBehaviors,
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
    const potentialKeys = Object.keys(constants.BehaviorValue.Options) as Array<
      keyof typeof constants.BehaviorValue.Options
    >
    const keyIndex = generateTool.pickNumberInRange(0, potentialKeys.length - 1)
    const behaviorKey = potentialKeys[keyIndex]
    const potentialValues = constants.BehaviorValue.Options[behaviorKey]
    const valueIndex = generateTool.pickNumberInRange(0, potentialValues.length - 1)
    const behaviorValue = potentialValues[valueIndex]
    newChild[behaviorKey] = behaviorValue
  }

  newChild.hashCode = getPatternHashCode(newChild)

  return newChild
}
