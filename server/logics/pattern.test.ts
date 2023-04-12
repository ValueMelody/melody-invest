import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as pattern from './pattern'
import { instance, mock } from 'ts-mockito'

describe('#gatherPatternBehaviorValues', () => {
  const patternMock: interfaces.traderPatternModel.Record = mock({})
  const first = {
    ...patternMock,
    priceDailyIncreaseBuy: 1,
    priceWeeklyDecreaseSell: 2,
  }

  const second = {
    ...patternMock,
    epsQuarterlyBeatBuy: 1,
    epsQuarterlyMissBuy: 2,
    profitQuarterlyDecreaseSell: 3,
  }

  test('could gather pattern behaviors', () => {
    expect(pattern.gatherPatternBehaviorValues(
      constants.Behavior.BuyBehaviors,
      first,
      second,
    )).toStrictEqual([
      { type: 'priceDailyIncreaseBuy', value: 1 },
      { type: 'epsQuarterlyBeatBuy', value: 1 },
      { type: 'epsQuarterlyMissBuy', value: 2 },
    ])
  })
})

describe('#pickBehaviorValues', () => {
  test('could return empty', () => {
    const patternMock1: interfaces.traderPatternModel.Record = mock({})
    const first = instance(patternMock1)

    const patternMock2: interfaces.traderPatternModel.Record = mock({})
    const second = instance(patternMock2)

    expect(pattern.pickBehaviorValues(
      constants.Behavior.SellBehaviors,
      first,
      second,
    )).toStrictEqual([])
  })

  test('could pick values based on rules', () => {
    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern1 = {
      ...patternMock,
      priceDailyDecreaseBuy: 1,
      priceWeeklyDecreaseBuy: 2,
    }

    const pattern2 = {
      ...patternMock,
      priceMonthlyDecreaseBuy: 2,
      priceYearlyIncreaseBuy: 3,
      priceQuarterlyDecreaseBuy: 1,
    }

    const results = pattern.pickBehaviorValues(
      constants.Behavior.BuyBehaviors,
      pattern1,
      pattern2,
    )
    expect(results.length).toBeGreaterThanOrEqual(1)
    expect(results.length).toBeLessThanOrEqual(2)
  })

  test('should pick at lest one value', () => {
    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern1 = { ...patternMock, priceDailyDecreaseBuy: 1 }

    const pattern2 = instance(patternMock)

    expect(pattern.pickBehaviorValues(
      constants.Behavior.BuyBehaviors,
      pattern1,
      pattern2,
    ).length).toBe(1)

    expect(pattern.pickBehaviorValues(
      constants.Behavior.BuyBehaviors,
      pattern2,
      pattern1,
    ).length).toBe(1)
  })
})

describe('#pickRandomBehaviorValue', () => {
  test('could pick random behavior value', () => {
    const behaviorValue = pattern.pickRandomBehaviorValue()
    expect(constants.BehaviorValue.Options[behaviorValue.type]).toContain(behaviorValue.value)
  })
})

describe('#mergeBehaviorValueToPattern', () => {
  test('could merge behavior value into pattern', () => {
    const patternMock1: interfaces.traderPatternModel.Create = mock({})
    const pattern1 = {
      ...instance(patternMock1),
      priceQuarterlyDecreaseBuy: null,
      priceYearlyDecreaseSell: 0,
      priceDailyDecreaseBuy: 1,
    }

    const result = pattern.mergeBehaviorValueToPattern(
      pattern1,
      [
        { type: 'priceDailyDecreaseBuy', value: 2 },
        { type: 'priceMonthlyDecreaseBuy', value: 3 },
        { type: 'priceMonthlyDecreaseBuy', value: 4 },
        { type: 'priceQuarterlyDecreaseBuy', value: 1 },
      ],
    )
    expect([1, 2]).toContain(result.priceDailyDecreaseBuy)
    expect([3, 4]).toContain(result.priceMonthlyDecreaseBuy)
    expect(result.priceQuarterlyDecreaseBuy).toBe(1)
    expect(result.priceYearlyDecreaseSell).toBe(0)
  })
})

describe('#generatePatternChild', () => {
  const patternMock: interfaces.traderPatternModel.Record = mock({})
  const first = {
    ...patternMock,
    priceDailyIncreaseBuy: 1,
    priceDailyDecreaseBuy: 2,
    priceWeeklyDecreaseSell: 3,
    cashMaxPercent: 10,
    tickerMinPercent: 11,
    tickerMaxPercent: 12,
    holdingBuyPercent: 13,
    holdingSellPercent: 14,
    tradeFrequency: 15,
    rebalanceFrequency: 16,
    buyPreference: 17,
    sellPreference: 18,
  }

  const second = {
    ...patternMock,
    priceDailyIncreaseBuy: 4,
    priceWeeklyDecreaseSell: 5,
    epsQuarterlyBeatSell: 1,
    cashMaxPercent: 20,
    tickerMinPercent: 21,
    tickerMaxPercent: 22,
    holdingBuyPercent: 23,
    holdingSellPercent: 24,
    tradeFrequency: 25,
    rebalanceFrequency: 26,
    buyPreference: 27,
    sellPreference: 28,
  }

  test('could generate pattern child', () => {
    const result1 = pattern.generatePatternChild(
      first,
      second,
    )
    expect([1, 4, null]).toContain(result1.priceDailyIncreaseBuy)
    expect([2, null]).toContain(result1.priceDailyDecreaseBuy)
    expect([3, 5, null]).toContain(result1.priceWeeklyDecreaseSell)
    expect([1, null]).toContain(result1.epsQuarterlyBeatSell)
    expect([10, 20]).toContain(result1.cashMaxPercent)
    expect([11, 21]).toContain(result1.tickerMinPercent)
    expect([12, 22]).toContain(result1.tickerMaxPercent)
    expect([13, 23]).toContain(result1.holdingBuyPercent)
    expect([14, 24]).toContain(result1.holdingSellPercent)
    expect([15, 25]).toContain(result1.tradeFrequency)
    expect([16, 26]).toContain(result1.rebalanceFrequency)
    expect([17, 27]).toContain(result1.buyPreference)
    expect([18, 28]).toContain(result1.sellPreference)

    const buyValues = [result1.priceDailyIncreaseBuy, result1.priceDailyDecreaseBuy]
    const nonNullBuyValues = buyValues.filter((value) => value !== null)
    expect(nonNullBuyValues.length).toBe(1)

    const sellValues = [result1.priceWeeklyDecreaseSell, result1.epsQuarterlyBeatSell]
    const nonNullSellValues = sellValues.filter((value) => value !== null)
    expect(nonNullSellValues.length).toBe(1)

    const result2 = pattern.generatePatternChild(
      first,
      second,
      true,
    )
    const differValues = constants.Behavior.Behaviors.filter((key) => {
      const value = result2[key]
      return value !== null &&
        value !== undefined &&
        value !== first[key] &&
        value !== second[key]
    })
    expect(differValues.length).toBeLessThanOrEqual(1)

    expect(result1.hashCode.length).toBe(128)
    expect(result2.hashCode.length).toBe(128)
  })
})
