import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as pattern from './pattern'

describe('#getPatternHashCode', () => {
  test('could get pattern hash code', () => {
    // @ts-ignore
    const pattern1: interfaces.traderPatternModel.Record = {
      buyPreference: 1,
      sellPreference: 2,
      cashMaxPercent: 20,
      tickerMinPercent: 2,
      tickerMaxPercent: 13,
      holdingBuyPercent: 5,
      holdingSellPercent: 40,
      tradeFrequency: 5,
      rebalanceFrequency: 80,
      priceDailyIncreaseBuy: 3,
      priceDailyDecreaseSell: 3,
    }
    expect(pattern.getPatternHashCode(pattern1))
      .toEqual(
        // eslint-disable-next-line
        'd592341948fd4682fde2031197e221aba127eb3106f051f13dbfff6373c0c912ac194a02b141ee21396be8fa8b8979d276133900db610003baa58e52dcc8c6d7',
      )

    // @ts-ignore
    const pattern2: interfaces.traderPatternModel.Record = {
      buyPreference: 1,
      sellPreference: 2,
      cashMaxPercent: 50,
      tickerMinPercent: 2,
      tickerMaxPercent: 34,
      holdingBuyPercent: 5,
      holdingSellPercent: 40,
      tradeFrequency: 10,
      rebalanceFrequency: 40,
      priceDailyIncreaseSell: 3,
      profitQuarterlyDecreaseBuy: 3,
    }
    expect(pattern.getPatternHashCode(pattern2))
      .toEqual(
        // eslint-disable-next-line
        '518c7e9a04d2e0d6a64f6b997819ab4ad7c2a13f73f70e01e0da78ea764910f95cfaa5ac020da4262bc15da62ff2a99f19602f79915d9d39c7bf0e0bde50ceec',
      )
  })
})

describe('#gatherPatternBehaviorValues', () => {
  // @ts-ignore
  const first: interfaces.traderPatternModel.Record = {
    priceDailyIncreaseBuy: 1,
    priceWeeklyDecreaseSell: 2,
  }
  // @ts-ignore
  const second: interfaces.traderPatternModel.Record = {
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
    expect(pattern.pickBehaviorValues(
      constants.Behavior.SellBehaviors,
      // @ts-ignore
      {},
      // @ts-ignore
      {},
    )).toStrictEqual([])
  })

  test('could pick values based on rules', () => {
    const results = pattern.pickBehaviorValues(
      constants.Behavior.BuyBehaviors,
      // @ts-ignore
      {
        priceDailyDecreaseBuy: 1,
        priceWeeklyDecreaseBuy: 2,
      },
      // @ts-ignore
      {
        priceMonthlyDecreaseBuy: 2,
        priceYearlyIncreaseBuy: 3,
        priceQuarterlyDecreaseBuy: 1,
      },
    )
    expect(results.length).toBeGreaterThanOrEqual(1)
    expect(results.length).toBeLessThanOrEqual(2)
  })

  test('should pick at lest one value', () => {
    expect(pattern.pickBehaviorValues(
      constants.Behavior.BuyBehaviors,
      // @ts-ignore
      { priceDailyDecreaseBuy: 1 },
      // @ts-ignore
      {},
    ).length).toBe(1)

    expect(pattern.pickBehaviorValues(
      constants.Behavior.BuyBehaviors,
      // @ts-ignore
      {},
      // @ts-ignore
      { priceDailyDecreaseBuy: 1 },
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
    const result = pattern.mergeBehaviorValueToPattern(
      // @ts-ignore
      {
        priceDailyDecreaseBuy: 1,
        priceQuarterlyDecreaseBuy: null,
        priceYearlyDecreaseSell: 0,
      },
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
  // @ts-ignore
  const first: interfaces.traderPatternModel.Record = {
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
  // @ts-ignore
  const second: interfaces.traderPatternModel.Record = {
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
