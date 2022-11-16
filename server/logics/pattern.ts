
import * as constants from '@shared/constants'
import * as generateTool from 'tools/generate'
import * as interfaces from '@shared/interfaces'

const BehaviorGroups: interfaces.traderPatternModel.Behavior[][] = [
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

interface BehaviorValue {
  type: interfaces.traderPatternModel.Behavior;
  value: number;
}

export const getPatternHashCode = (
  pattern: interfaces.traderPatternModel.Record | interfaces.traderPatternModel.Create,
): string => {
  const template = BehaviorGroups.map((group) => group.map((behavior) => {
    return pattern[behavior] === undefined ? null : pattern[behavior]
  }))
  return generateTool.toSHA512(JSON.stringify(template))
}

export const gatherPatternBehaviorValues = (
  behaviors: interfaces.traderPatternModel.Behavior[],
  firstPattern: interfaces.traderPatternModel.Record,
  secondPattern: interfaces.traderPatternModel.Record,
): BehaviorValue[] => {
  return behaviors.reduce((
    allBehaviors: BehaviorValue[], type: interfaces.traderPatternModel.Behavior,
  ) => {
    const combinedBehaviors = [...allBehaviors]
    if (firstPattern[type] !== null && firstPattern[type] !== undefined) {
      combinedBehaviors.push({ type, value: firstPattern[type]! })
    }
    if (secondPattern[type] !== null && secondPattern[type] !== undefined) {
      combinedBehaviors.push({ type, value: secondPattern[type]! })
    }
    return combinedBehaviors
  }, [])
}

export const pickBehaviorValues = (
  behaviors: interfaces.traderPatternModel.Behavior[],
  first: interfaces.traderPatternModel.Record,
  second: interfaces.traderPatternModel.Record,
): BehaviorValue[] => {
  const allValues = gatherPatternBehaviorValues(behaviors, first, second)
  if (!allValues.length) return []

  const expectedTotal = Math.floor(allValues.length / 2) || 1
  const chanceOfStay = (expectedTotal / allValues.length) * 100
  const subValues = allValues.reduce((values: BehaviorValue[], value: BehaviorValue) => {
    const shouldStay = generateTool.pickNumberInRange(1, 100) <= chanceOfStay
    const hasRoom = values.length < expectedTotal
    if (shouldStay && hasRoom) return [...values, value]
    return values
  }, [])

  if (!subValues.length) {
    const index = generateTool.pickNumberInRange(0, allValues.length - 1)
    subValues.push(allValues[index])
  }

  return subValues
}

export const mergeBehaviorValueToPattern = (
  pattern: interfaces.traderPatternModel.Create,
  behaviorValues: BehaviorValue[],
): interfaces.traderPatternModel.Create => {
  behaviorValues.forEach((behaviorValue) => {
    const existingValue = pattern[behaviorValue.type]
    const hasExistingValue = existingValue !== null && existingValue !== undefined
    pattern[behaviorValue.type] = hasExistingValue
      ? generateTool.pickOneNumber(behaviorValue.value, existingValue)
      : behaviorValue.value
  })
  return pattern
}

export const pickRandomBehaviorValue = (): BehaviorValue => {
  const potentialKeys = Object.keys(constants.BehaviorValue.Options) as Array<
    keyof typeof constants.BehaviorValue.Options
  >
  const keyIndex = generateTool.pickNumberInRange(0, potentialKeys.length - 1)
  const behaviorKey = potentialKeys[keyIndex]
  const potentialValues = constants.BehaviorValue.Options[behaviorKey]
  const valueIndex = generateTool.pickNumberInRange(0, potentialValues.length - 1)
  const behaviorValue = potentialValues[valueIndex]
  return { type: behaviorKey, value: behaviorValue }
}

export const generatePatternChild = (
  first: interfaces.traderPatternModel.Record,
  second: interfaces.traderPatternModel.Record,
  shouldMutate: boolean = false,
): interfaces.traderPatternModel.Create => {
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

  const buyBehaviorKeys = BehaviorGroups[0]
  const childBuyBehaviors = pickBehaviorValues(buyBehaviorKeys, first, second)
  const childWithBuy = mergeBehaviorValueToPattern(newChild, childBuyBehaviors)

  const sellBehaviorKeys = BehaviorGroups[1]
  const childSellBehaviors = pickBehaviorValues(sellBehaviorKeys, first, second)
  const updatedChild = mergeBehaviorValueToPattern(childWithBuy, childSellBehaviors)

  if (shouldMutate) {
    const mutatedBehaviorValue = pickRandomBehaviorValue()
    updatedChild[mutatedBehaviorValue.type] = mutatedBehaviorValue.value
  }

  updatedChild.hashCode = getPatternHashCode(newChild)

  return updatedChild
}
