import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as evaluation from './evaluation'

describe('#getTickerPreferValue', () => {
  // @ts-ignore
  const TickerDaily1: interfaces.tickerDailyModel.Record = {
    closePrice: 100,
  }
  // @ts-ignore
  const TickerDaily2: interfaces.tickerDailyModel.Record = {
    closePrice: 10,
  }
  // @ts-ignore
  const TickerQuarterly1: interfaces.tickerQuarterlyModel.Record = {
    eps: 20000,
    ebitda: 300,
    netIncome: 40000,
    grossProfit: 50,
    totalRevenue: 600,
  }
  // @ts-ignore
  const TickerQuarterly2: interfaces.tickerQuarterlyModel.Record = {
    eps: 2000,
    ebitda: 30,
    netIncome: 4000,
    grossProfit: 5,
    totalRevenue: 60,
  }
  // @ts-ignore
  const TickerYearly1: interfaces.tickerYearlyModel.Record = {
    eps: 7000,
    ebitda: 800,
    netIncome: 90,
    grossProfit: 100,
    totalRevenue: 1100,
  }
  // @ts-ignore
  const TickerYearly2: interfaces.tickerYearlyModel.Record = {
    eps: 700,
    ebitda: 80,
    netIncome: 9,
    grossProfit: 10,
    totalRevenue: 110,
  }

  test('could get prefer value for price', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherPrice,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(100)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherPrice,
      TickerDaily2,
      TickerQuarterly2,
      null,
    )).toEqual(10)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerPrice,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(100)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerPrice,
      TickerDaily2,
      TickerQuarterly2,
      null,
    )).toEqual(10)
  })

  test('could get prefer value for quarter eps', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterEPS,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(20000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterEPS,
      TickerDaily2,
      TickerQuarterly2,
      null,
    )).toEqual(2000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterEPS,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(20000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterEPS,
      TickerDaily2,
      TickerQuarterly2,
      null,
    )).toEqual(2000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterEPS,
      TickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterEPS,
      TickerDaily1,
      null,
      null,
    )).toEqual(null)
  })

  test('could get prefer value for quarter ebitda', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterEBITDA,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(300)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterEBITDA,
      TickerDaily2,
      TickerQuarterly2,
      null,
    )).toEqual(30)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterEBITDA,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(300)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterEBITDA,
      TickerDaily2,
      TickerQuarterly2,
      null,
    )).toEqual(30)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterEBITDA,
      TickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterEBITDA,
      TickerDaily1,
      null,
      null,
    )).toEqual(null)
  })

  test('could get prefer value for quarter income', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterIncome,
      TickerDaily1,
      TickerQuarterly1,
      null,
    )).toEqual(40000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterIncome,
      TickerDaily2,
      TickerQuarterly2,
      null,
    )).toEqual(4000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterIncome,
      TickerDaily1,
      TickerQuarterly1,
      null,
    )).toEqual(40000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterIncome,
      TickerDaily2,
      TickerQuarterly2,
      null,
    )).toEqual(4000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterIncome,
      TickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterIncome,
      TickerDaily1,
      null,
      TickerYearly1,
    )).toEqual(null)
  })

  test('could get prefer value for quarter grossProfit', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterProfit,
      TickerDaily1,
      TickerQuarterly1,
      null,
    )).toEqual(50)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterProfit,
      TickerDaily2,
      TickerQuarterly2,
      null,
    )).toEqual(5)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterProfit,
      TickerDaily1,
      TickerQuarterly1,
      null,
    )).toEqual(50)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterProfit,
      TickerDaily2,
      TickerQuarterly2,
      null,
    )).toEqual(5)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterProfit,
      TickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterProfit,
      TickerDaily1,
      null,
      TickerYearly1,
    )).toEqual(null)
  })

  test('could get prefer value for quarter totalRevenue', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterRevenue,
      TickerDaily1,
      TickerQuarterly1,
      null,
    )).toEqual(600)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterRevenue,
      TickerDaily2,
      TickerQuarterly2,
      null,
    )).toEqual(60)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterRevenue,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(600)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterRevenue,
      TickerDaily2,
      TickerQuarterly2,
      null,
    )).toEqual(60)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterRevenue,
      TickerDaily2,
      null,
      TickerYearly1,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterRevenue,
      TickerDaily1,
      null,
      null,
    )).toEqual(null)
  })

  test('could get prefer value for yearly eps', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearEPS,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(7000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearEPS,
      TickerDaily2,
      TickerQuarterly2,
      TickerYearly2,
    )).toEqual(700)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearEPS,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(7000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearEPS,
      TickerDaily2,
      TickerQuarterly2,
      TickerYearly2,
    )).toEqual(700)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearEPS,
      TickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearEPS,
      TickerDaily1,
      null,
      null,
    )).toEqual(null)
  })

  test('could get prefer value for yearly ebitda', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearEBITDA,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(800)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearEBITDA,
      TickerDaily2,
      TickerQuarterly2,
      TickerYearly2,
    )).toEqual(80)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearEBITDA,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(800)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearEBITDA,
      TickerDaily2,
      TickerQuarterly2,
      TickerYearly2,
    )).toEqual(80)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearEBITDA,
      TickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearEBITDA,
      TickerDaily1,
      null,
      null,
    )).toEqual(null)
  })

  test('could get prefer value for yearly netIncome', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearIncome,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(90)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearIncome,
      TickerDaily2,
      TickerQuarterly2,
      TickerYearly2,
    )).toEqual(9)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearIncome,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(90)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearIncome,
      TickerDaily2,
      TickerQuarterly2,
      TickerYearly2,
    )).toEqual(9)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearIncome,
      TickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearIncome,
      TickerDaily1,
      null,
      null,
    )).toEqual(null)
  })

  test('could get prefer value for yearly grossProfit', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearProfit,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(100)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearProfit,
      TickerDaily2,
      TickerQuarterly2,
      TickerYearly2,
    )).toEqual(10)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearProfit,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(100)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearProfit,
      TickerDaily2,
      TickerQuarterly2,
      TickerYearly2,
    )).toEqual(10)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearProfit,
      TickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearProfit,
      TickerDaily1,
      null,
      null,
    )).toEqual(null)
  })

  test('could get prefer value for yearly totalRevenue', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearRevenue,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(1100)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearRevenue,
      TickerDaily2,
      TickerQuarterly2,
      TickerYearly2,
    )).toEqual(110)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearRevenue,
      TickerDaily1,
      TickerQuarterly1,
      TickerYearly1,
    )).toEqual(1100)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearRevenue,
      TickerDaily2,
      TickerQuarterly2,
      TickerYearly2,
    )).toEqual(110)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearRevenue,
      TickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearRevenue,
      TickerDaily1,
      null,
      null,
    )).toEqual(null)
  })
})

describe('#MovementTriggers', () => {
  const entries = Object.entries(evaluation.MovementTriggers)
  test('key mapping is correct', () => {
    entries.forEach((entry) => {
      expect(entry[0].includes('Buy') || entry[0].includes('Sell')).toBeTruthy()
      if (entry[0].includes('Buy')) expect(entry[0]).toEqual(`${entry[1]}Buy`)
      if (entry[0].includes('Sell')) expect(entry[0]).toEqual(`${entry[1]}Sell`)
    })
  })
})

describe('#CompareTriggers', () => {
  const entries = Object.entries(evaluation.CompareTriggers)
  test('key mapping is correct', () => {
    entries.forEach((entry) => {
      expect(
        entry[0].includes('AboveBuy') || entry[0].includes('AboveSell') ||
entry[0].includes('BelowBuy') || entry[0].includes('BelowSell'),
      ).toBeTruthy()
      const base = entry[0].replace('AboveBuy', '')
        .replace('AboveSell', '')
        .replace('BelowBuy', '')
        .replace('BelowSell', '')
      expect(`${base}Percent`).toBe(entry[1])
    })
  })
})

describe('#getTickerMovementWeight', () => {
  test('could get weight when matches', () => {
    // @ts-ignore
    const TickerInfo: interfaces.dailyTickersModel.TickerInfo = {
      priceDailyIncrease: 2,
      priceDailyDecrease: 3,
      priceWeeklyIncrease: 2,
      priceWeeklyDecrease: 3,
      priceMonthlyIncrease: 5,
    }
    // @ts-ignore
    const Pattern: interfaces.traderPatternModel.Record = {
      priceDailyIncreaseBuy: 2,
      priceDailyIncreaseSell: 2,
      priceDailyDecreaseBuy: 4,
      priceDailyDecreaseSell: 4,
      priceWeeklyIncreaseBuy: 1,
      priceWeeklyIncreaseSell: 1,
      priceWeeklyDecreaseBuy: 1,
      priceWeeklyDecreaseSell: 1,
      priceMonthlyIncreaseBuy: 2,
      priceMonthlyIncreaseSell: 2,
    }
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceDailyIncrease', Pattern, 'priceDailyIncreaseBuy',
    )).toBe(2)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceDailyIncrease', Pattern, 'priceDailyIncreaseSell',
    )).toBe(2)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceDailyDecrease', Pattern, 'priceDailyDecreaseBuy',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceDailyDecrease', Pattern, 'priceDailyDecreaseSell',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceWeeklyIncrease', Pattern, 'priceWeeklyIncreaseBuy',
    )).toBe(3)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceWeeklyIncrease', Pattern, 'priceWeeklyIncreaseSell',
    )).toBe(3)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceWeeklyDecrease', Pattern, 'priceWeeklyDecreaseBuy',
    )).toBe(4)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceWeeklyDecrease', Pattern, 'priceWeeklyDecreaseSell',
    )).toBe(4)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceMonthlyIncrease', Pattern, 'priceMonthlyIncreaseBuy',
    )).toBe(5)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceMonthlyIncrease', Pattern, 'priceMonthlyIncreaseSell',
    )).toBe(5)
  })

  test('could get weight when there is no matches', () => {
    // @ts-ignore
    const TickerInfo: interfaces.dailyTickersModel.TickerInfo = {
      priceWeeklyIncrease: 2,
      priceWeeklyDecrease: 3,
    }
    // @ts-ignore
    const Pattern: interfaces.traderPatternModel.Record = {
      priceDailyIncreaseBuy: 2,
      priceDailyIncreaseSell: 2,
    }
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceWeeklyIncrease', Pattern, 'priceWeeklyIncreaseBuy',
    )).toBe(1)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceWeeklyIncrease', Pattern, 'priceWeeklyIncreaseSell',
    )).toBe(1)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceWeeklyDecrease', Pattern, 'priceWeeklyDecreaseBuy',
    )).toBe(1)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceWeeklyDecrease', Pattern, 'priceWeeklyDecreaseSell',
    )).toBe(1)
  })

  test('could get weight when there is matches with less value', () => {
    // @ts-ignore
    const TickerInfo: interfaces.dailyTickersModel.TickerInfo = {
      priceWeeklyIncrease: 2,
      priceWeeklyDecrease: 3,
    }
    // @ts-ignore
    const Pattern: interfaces.traderPatternModel.Record = {
      priceWeeklyIncreaseBuy: 4,
      priceWeeklyIncreaseSell: 4,
      priceWeeklyDecreaseBuy: 4,
      priceWeeklyDecreaseSell: 4,
      priceDailyIncreaseBuy: 2,
      priceDailyIncreaseSell: 2,
      priceDailyDecreaseBuy: 2,
      priceDailyDecreaseSell: 2,
    }
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceDailyIncrease', Pattern, 'priceDailyIncreaseBuy',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceDailyIncrease', Pattern, 'priceDailyIncreaseSell',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceDailyDecrease', Pattern, 'priceDailyDecreaseBuy',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceDailyDecrease', Pattern, 'priceDailyDecreaseSell',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceWeeklyIncrease', Pattern, 'priceWeeklyIncreaseBuy',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceWeeklyIncrease', Pattern, 'priceWeeklyIncreaseSell',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceWeeklyDecrease', Pattern, 'priceWeeklyDecreaseBuy',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      TickerInfo, 'priceWeeklyDecrease', Pattern, 'priceWeeklyDecreaseSell',
    )).toBe(0)
  })
})

describe('#getTickerCompareWeight', () => {
  test('could get weight when matches', () => {
    // @ts-ignore
    const TickerInfo: interfaces.dailyTickersModel.TickerInfo = {
      gdpYearlyChangePercent: 3,
      gdpQuarterlyChangePercent: -2,
    }
    // @ts-ignore
    const Pattern: interfaces.traderPatternModel.Record = {
      gdpYearlyChangeAboveBuy: 1,
      gdpYearlyChangeAboveSell: 2,
      gdpYearlyChangeBelowBuy: 5,
      gdpYearlyChangeBelowSell: 4,
      gdpQuarterlyChangeAboveBuy: -3,
      gdpQuarterlyChangeAboveSell: -4,
      gdpQuarterlyChangeBelowBuy: -1,
      gdpQuarterlyChangeBelowSell: 1,
    }
    expect(evaluation.getTickerCompareWeight(
      TickerInfo, 'gdpYearlyChangePercent', Pattern, 'gdpYearlyChangeAboveBuy',
    )).toBe(4)
    expect(evaluation.getTickerCompareWeight(
      TickerInfo, 'gdpYearlyChangePercent', Pattern, 'gdpYearlyChangeAboveSell',
    )).toBe(3)
    expect(evaluation.getTickerCompareWeight(
      TickerInfo, 'gdpYearlyChangePercent', Pattern, 'gdpYearlyChangeBelowBuy',
    )).toBe(4)
    expect(evaluation.getTickerCompareWeight(
      TickerInfo, 'gdpYearlyChangePercent', Pattern, 'gdpYearlyChangeBelowSell',
    )).toBe(3)
    expect(evaluation.getTickerCompareWeight(
      TickerInfo, 'gdpQuarterlyChangePercent', Pattern, 'gdpQuarterlyChangeAboveBuy',
    )).toBe(3)
    expect(evaluation.getTickerCompareWeight(
      TickerInfo, 'gdpQuarterlyChangePercent', Pattern, 'gdpQuarterlyChangeAboveSell',
    )).toBe(4)
    expect(evaluation.getTickerCompareWeight(
      TickerInfo, 'gdpQuarterlyChangePercent', Pattern, 'gdpQuarterlyChangeBelowBuy',
    )).toBe(3)
    expect(evaluation.getTickerCompareWeight(
      TickerInfo, 'gdpQuarterlyChangePercent', Pattern, 'gdpQuarterlyChangeBelowSell',
    )).toBe(5)
  })

  test('could get weight when there are no matches', () => {
    // @ts-ignore
    const TickerInfo: interfaces.dailyTickersModel.TickerInfo = {
      gdpQuarterlyChangePercent: -2,
    }
    // @ts-ignore
    const Pattern: interfaces.traderPatternModel.Record = {
      gdpYearlyChangeAboveBuy: 1,
      gdpYearlyChangeAboveSell: 2,
      gdpYearlyChangeBelowBuy: 5,
      gdpYearlyChangeBelowSell: 4,
    }
    expect(evaluation.getTickerCompareWeight(
      TickerInfo, 'gdpQuarterlyChangePercent', Pattern, 'gdpQuarterlyChangeAboveBuy',
    )).toBe(1)
    expect(evaluation.getTickerCompareWeight(
      TickerInfo, 'gdpQuarterlyChangePercent', Pattern, 'gdpQuarterlyChangeAboveSell',
    )).toBe(1)
    expect(evaluation.getTickerCompareWeight(
      TickerInfo, 'gdpQuarterlyChangePercent', Pattern, 'gdpQuarterlyChangeBelowBuy',
    )).toBe(1)
    expect(evaluation.getTickerCompareWeight(
      TickerInfo, 'gdpQuarterlyChangePercent', Pattern, 'gdpQuarterlyChangeBelowSell',
    )).toBe(1)
  })

  test('could get weight when matches with less value', () => {
    // @ts-ignore
    const TickerInfo: interfaces.dailyTickersModel.TickerInfo = {
      gdpYearlyChangePercent: 0,
      gdpQuarterlyChangePercent: -2,
    }
    // @ts-ignore
    const Pattern: interfaces.traderPatternModel.Record = {
      gdpYearlyChangeAboveBuy: 1,
      gdpYearlyChangeAboveSell: 2,
      gdpYearlyChangeBelowBuy: -1,
      gdpYearlyChangeBelowSell: -2,
    }
    expect(evaluation.getTickerCompareWeight(
      TickerInfo, 'gdpYearlyChangePercent', Pattern, 'gdpYearlyChangeAboveBuy',
    )).toBe(0)
    expect(evaluation.getTickerCompareWeight(
      TickerInfo, 'gdpYearlyChangePercent', Pattern, 'gdpYearlyChangeAboveSell',
    )).toBe(0)
    expect(evaluation.getTickerCompareWeight(
      TickerInfo, 'gdpYearlyChangePercent', Pattern, 'gdpYearlyChangeBelowBuy',
    )).toBe(0)
    expect(evaluation.getTickerCompareWeight(
      TickerInfo, 'gdpYearlyChangePercent', Pattern, 'gdpYearlyChangeBelowSell',
    )).toBe(0)
  })
})

describe('#getMovementAndCompareWeights', () => {
  // @ts-ignore
  const TickerInfo1: interfaces.dailyTickersModel.TickerInfo = {
    priceDailyIncrease: 3,
    gdpYearlyChangePercent: 2,
  }
  // @ts-ignore
  const TickerInfo2: interfaces.dailyTickersModel.TickerInfo = {
    priceDailyIncrease: 3,
    priceWeeklyDecrease: 2,
    gdpYearlyChangePercent: 2,
  }
  // @ts-ignore
  const TickerInfo3: interfaces.dailyTickersModel.TickerInfo = {
    priceDailyIncrease: 3,
    gdpYearlyChangePercent: 2,
    gdpQuarterlyChangePercent: -1,
  }
  // @ts-ignore
  const Pattern1: interfaces.traderPatternModel.Record = {
    priceDailyIncreaseBuy: 1,
    gdpYearlyChangeAboveBuy: 1,
  }
  // @ts-ignore
  const Pattern2: interfaces.traderPatternModel.Record = {
    priceDailyIncreaseBuy: 2,
    gdpYearlyChangeAboveBuy: 1,
  }
  // @ts-ignore
  const Pattern3: interfaces.traderPatternModel.Record = {
    priceDailyIncreaseBuy: 2,
    priceWeeklyDecreaseBuy: 1,
    gdpYearlyChangeAboveBuy: 1,
  }
  // @ts-ignore
  const Pattern4: interfaces.traderPatternModel.Record = {
    priceDailyIncreaseBuy: 2,
    gdpYearlyChangeAboveBuy: 1,
    gdpQuarterlyChangeAboveBuy: -3,
  }
  // @ts-ignore
  const Pattern5: interfaces.traderPatternModel.Record = {
    priceDailyIncreaseSell: 1,
    gdpYearlyChangeAboveSell: 1,
  }
  // @ts-ignore
  const Pattern6: interfaces.traderPatternModel.Record = {
    priceDailyIncreaseSell: 2,
    gdpYearlyChangeAboveSell: 1,
  }
  // @ts-ignore
  const Pattern7: interfaces.traderPatternModel.Record = {
    priceDailyIncreaseSell: 2,
    priceWeeklyDecreaseSell: 1,
    gdpYearlyChangeAboveSell: 1,
  }
  // @ts-ignore
  const Pattern8: interfaces.traderPatternModel.Record = {
    priceDailyIncreaseSell: 2,
    gdpYearlyChangeAboveSell: 1,
    gdpQuarterlyChangeAboveSell: -3,
  }

  test('could get correct weights for buy', () => {
    expect(evaluation.getMovementAndCompareWeights(
      Pattern1, TickerInfo1, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(12)
    expect(evaluation.getMovementAndCompareWeights(
      Pattern1, TickerInfo1, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(1)

    expect(evaluation.getMovementAndCompareWeights(
      Pattern2, TickerInfo1, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(9)
    expect(evaluation.getMovementAndCompareWeights(
      Pattern2, TickerInfo1, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(1)

    expect(evaluation.getMovementAndCompareWeights(
      Pattern3, TickerInfo2, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(27)
    expect(evaluation.getMovementAndCompareWeights(
      Pattern3, TickerInfo2, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(1)

    expect(evaluation.getMovementAndCompareWeights(
      Pattern4, TickerInfo3, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(36)
    expect(evaluation.getMovementAndCompareWeights(
      Pattern4, TickerInfo3, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(1)
  })

  test('could get correct weights for sell', () => {
    expect(evaluation.getMovementAndCompareWeights(
      Pattern5, TickerInfo1, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(12)
    expect(evaluation.getMovementAndCompareWeights(
      Pattern5, TickerInfo1, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(1)

    expect(evaluation.getMovementAndCompareWeights(
      Pattern6, TickerInfo1, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(9)
    expect(evaluation.getMovementAndCompareWeights(
      Pattern6, TickerInfo1, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(1)

    expect(evaluation.getMovementAndCompareWeights(
      Pattern7, TickerInfo2, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(27)
    expect(evaluation.getMovementAndCompareWeights(
      Pattern7, TickerInfo2, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(1)

    expect(evaluation.getMovementAndCompareWeights(
      Pattern8, TickerInfo3, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(36)
    expect(evaluation.getMovementAndCompareWeights(
      Pattern8, TickerInfo3, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(1)
  })

  test('if there is no weight for buy', () => {
    // @ts-ignore
    const TickerInfo1: interfaces.dailyTickersModel.TickerInfo = {
      priceDailyIncrease: 3,
    }
    // @ts-ignore
    const TickerInfo2: interfaces.dailyTickersModel.TickerInfo = {
      gdpYearlyChangePercent: 2,
    }
    // @ts-ignore
    const TickerInfo3: interfaces.dailyTickersModel.TickerInfo = {}
    // @ts-ignore
    const Pattern: interfaces.traderPatternModel.Record = {
      priceDailyIncreaseBuy: 1,
      gdpYearlyChangeAboveBuy: 1,
    }
    expect(evaluation.getMovementAndCompareWeights(
      Pattern, TickerInfo1, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(0)
    expect(evaluation.getMovementAndCompareWeights(
      Pattern, TickerInfo2, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(0)
    expect(evaluation.getMovementAndCompareWeights(
      Pattern, TickerInfo3, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(0)
  })

  test('if there is no weight for sell', () => {
    // @ts-ignore
    const TickerInfo1: interfaces.dailyTickersModel.TickerInfo = {
      priceDailyIncrease: 3,
    }
    // @ts-ignore
    const TickerInfo2: interfaces.dailyTickersModel.TickerInfo = {
      gdpYearlyChangePercent: 2,
    }
    // @ts-ignore
    const TickerInfo3: interfaces.dailyTickersModel.TickerInfo = {}
    // @ts-ignore
    const Pattern: interfaces.traderPatternModel.Record = {
      priceDailyIncreaseSell: 1,
      gdpYearlyChangeAboveSell: 1,
    }
    expect(evaluation.getMovementAndCompareWeights(
      Pattern, TickerInfo1, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(0)
    expect(evaluation.getMovementAndCompareWeights(
      Pattern, TickerInfo2, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(0)
    expect(evaluation.getMovementAndCompareWeights(
      Pattern, TickerInfo3, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(0)
  })
})

describe('#getTickersWithSellEvaluation', () => {
  test('could get result', () => {
    // @ts-ignore
    const Pattern: interfaces.traderPatternModel.Record = {
      priceDailyDecreaseSell: 1,
      sellPreference: constants.BehaviorValue.Preference.HigherPrice,
    }
    // @ts-ignore
    const DailyTicker: interfaces.dailyTickersModel.DailyTicker = {
      // @ts-ignore
      daily: { closePrice: 100 },
      // @ts-ignore
      info: { priceDailyDecrease: 2 },
    }
    expect(evaluation.getTickersWithSellEvaluation(1, Pattern, DailyTicker)).toStrictEqual({
      tickerId: 1, preferValue: 100, weight: 3,
    })
    expect(evaluation.getTickersWithSellEvaluation(2, Pattern, DailyTicker)).toStrictEqual({
      tickerId: 2, preferValue: 100, weight: 3,
    })
  })

  test('if there is no daily ticker', () => {
    // @ts-ignore
    const Pattern: interfaces.traderPatternModel.Record = {
      priceDailyDecreaseSell: 1,
      sellPreference: constants.BehaviorValue.Preference.HigherPrice,
    }
    expect(evaluation.getTickersWithSellEvaluation(1, Pattern, null)).toBe(null)
  })

  test('if there is no prefer value', () => {
    // @ts-ignore
    const Pattern: interfaces.traderPatternModel.Record = {
      priceDailyDecreaseSell: 1,
      sellPreference: constants.BehaviorValue.Preference.HigherPrice,
    }
    // @ts-ignore
    const DailyTicker: interfaces.dailyTickersModel.DailyTicker = {
      // @ts-ignore
      daily: {},
      // @ts-ignore
      info: { priceDailyDecrease: 2 },
    }
    expect(evaluation.getTickersWithSellEvaluation(1, Pattern, DailyTicker)).toBe(null)
  })

  test('if there is no weight', () => {
    // @ts-ignore
    const Pattern: interfaces.traderPatternModel.Record = {
      priceDailyDecreaseSell: 1,
      sellPreference: constants.BehaviorValue.Preference.HigherPrice,
    }
    // @ts-ignore
    const DailyTicker: interfaces.dailyTickersModel.DailyTicker = {
      // @ts-ignore
      daily: { closePrice: 100 },
      // @ts-ignore
      info: { priceDailyDecrease: 0 },
    }
    expect(evaluation.getTickersWithSellEvaluation(1, Pattern, DailyTicker)).toBe(null)
  })
})

describe('#getTickersWithBuyEvaluation', () => {
  test('could get result', () => {
    // @ts-ignore
    const Pattern: interfaces.traderPatternModel.Record = {
      priceDailyDecreaseBuy: 1,
      buyPreference: constants.BehaviorValue.Preference.HigherPrice,
    }
    // @ts-ignore
    const DailyTicker: interfaces.dailyTickersModel.DailyTicker = {
      // @ts-ignore
      daily: { closePrice: 100 },
      // @ts-ignore
      info: { priceDailyDecrease: 2 },
    }
    expect(evaluation.getTickersWithBuyEvaluation(1, Pattern, DailyTicker)).toStrictEqual({
      tickerId: 1, preferValue: 100, weight: 3,
    })
    expect(evaluation.getTickersWithBuyEvaluation(2, Pattern, DailyTicker)).toStrictEqual({
      tickerId: 2, preferValue: 100, weight: 3,
    })
  })

  test('if there is no daily ticker', () => {
    // @ts-ignore
    const Pattern: interfaces.traderPatternModel.Record = {
      priceDailyDecreaseBuy: 1,
      buyPreference: constants.BehaviorValue.Preference.HigherPrice,
    }
    expect(evaluation.getTickersWithBuyEvaluation(1, Pattern, null)).toBe(null)
  })

  test('if there is no prefer value', () => {
    // @ts-ignore
    const Pattern: interfaces.traderPatternModel.Record = {
      priceDailyDecreaseBuy: 1,
      buyPreference: constants.BehaviorValue.Preference.HigherPrice,
    }
    // @ts-ignore
    const DailyTicker: interfaces.dailyTickersModel.DailyTicker = {
      // @ts-ignore
      daily: {}, info: { priceDailyDecrease: 2 },
    }
    expect(evaluation.getTickersWithBuyEvaluation(1, Pattern, DailyTicker)).toBe(null)
  })

  test('if there is no weight', () => {
    // @ts-ignore
    const Pattern: interfaces.traderPatternModel.Record = {
      priceDailyDecreaseBuy: 1,
      buyPreference: constants.BehaviorValue.Preference.HigherPrice,
    }
    // @ts-ignore
    const DailyTicker: interfaces.dailyTickersModel.DailyTicker = {
      // @ts-ignore
      daily: { closePrice: 100 }, info: { priceDailyDecrease: 0 },
    }
    expect(evaluation.getTickersWithBuyEvaluation(1, Pattern, DailyTicker)).toBe(null)
  })
})

describe('#getOrderedTickerEvaluations', () => {
  test('could sort correctly', () => {
    expect(evaluation.getOrderedTickerEvaluations([
      { tickerId: 1, preferValue: 100, weight: 3 },
      { tickerId: 1, preferValue: 20, weight: 4 },
      { tickerId: 1, preferValue: 100, weight: 5 },
      { tickerId: 1, preferValue: 200, weight: 3 },
      { tickerId: 1, preferValue: 50, weight: 4 },
    ], 1)).toStrictEqual([
      { tickerId: 1, preferValue: 100, weight: 5 },
      { tickerId: 1, preferValue: 50, weight: 4 },
      { tickerId: 1, preferValue: 20, weight: 4 },
      { tickerId: 1, preferValue: 200, weight: 3 },
      { tickerId: 1, preferValue: 100, weight: 3 },
    ])
    expect(evaluation.getOrderedTickerEvaluations([
      { tickerId: 1, preferValue: 100, weight: 3 },
      { tickerId: 1, preferValue: 20, weight: 4 },
      { tickerId: 1, preferValue: 100, weight: 5 },
      { tickerId: 1, preferValue: 200, weight: 3 },
      { tickerId: 1, preferValue: 50, weight: 4 },
    ], 2)).toStrictEqual([
      { tickerId: 1, preferValue: 100, weight: 5 },
      { tickerId: 1, preferValue: 20, weight: 4 },
      { tickerId: 1, preferValue: 50, weight: 4 },
      { tickerId: 1, preferValue: 100, weight: 3 },
      { tickerId: 1, preferValue: 200, weight: 3 },
    ])
  })
})

describe('#getTickerBuyEaluations', () => {
  // @ts-ignore
  const Pattern: interfaces.traderPatternModel.Record = {
    priceDailyIncreaseBuy: 1,
    buyPreference: constants.BehaviorValue.Preference.HigherPrice,
  }
  // @ts-ignore
  const DailyTickers: interfaces.dailyTickersModel.DailyTickers = {
    // @ts-ignore
    1: { daily: { closePrice: 30 }, info: { priceDailyIncrease: 2 } },
    // @ts-ignore
    3: { daily: { closePrice: 50 }, info: { priceDailyIncrease: 3 } },
    // @ts-ignore
    4: { daily: { closePrice: 50 }, info: { priceDailyIncrease: 2 } },
  }
  test('could get evaluation correctly', () => {
    expect(evaluation.getTickerBuyEaluations([1, 2, 3, 4], Pattern, DailyTickers))
      .toStrictEqual([
        { tickerId: 3, preferValue: 50, weight: 4 },
        { tickerId: 4, preferValue: 50, weight: 3 },
        { tickerId: 1, preferValue: 30, weight: 3 },
      ])
  })
})

describe('#getTickerSellEaluations', () => {
  // @ts-ignore
  const Pattern: interfaces.traderPatternModel.Record = {
    priceDailyIncreaseSell: 1,
    sellPreference: constants.BehaviorValue.Preference.LowerPrice,
  }
  // @ts-ignore
  const DailyTickers: interfaces.dailyTickersModel.DailyTickers = {
    // @ts-ignore
    1: { daily: { closePrice: 30 }, info: { priceDailyIncrease: 2 } },
    // @ts-ignore
    3: { daily: { closePrice: 50 }, info: { priceDailyIncrease: 3 } },
    // @ts-ignore
    4: { daily: { closePrice: 50 }, info: { priceDailyIncrease: 2 } },
  }
  test('could get evaluation correctly', () => {
    expect(evaluation.getTickerSellEaluations([1, 2, 3, 4], Pattern, DailyTickers))
      .toStrictEqual([
        { tickerId: 3, preferValue: 50, weight: 4 },
        { tickerId: 1, preferValue: 30, weight: 3 },
        { tickerId: 4, preferValue: 50, weight: 3 },
      ])
  })
})
