import * as constants from '@shared/constants'
import * as evaluation from './evaluation'
import * as interfaces from '@shared/interfaces'
import { instance, mock } from 'ts-mockito'

describe('#getTickerPreferValue', () => {
  const dailyMock: interfaces.tickerDailyModel.Record = mock({})
  const tickerDaily1 = { ...dailyMock, closePrice: 100 }
  const tickerDaily2 = { ...dailyMock, closePrice: 10 }

  const quarterlyMock: interfaces.tickerQuarterlyModel.Record = mock({})
  const tickerQuarterly1 = {
    ...quarterlyMock,
    eps: 20000,
    ebitda: 300,
    netIncome: 40000,
    grossProfit: 50,
    totalRevenue: 600,
  }

  const tickerQuarterly2 = {
    ...quarterlyMock,
    eps: 2000,
    ebitda: 30,
    netIncome: 4000,
    grossProfit: 5,
    totalRevenue: 60,
  }

  const yearlyMock: interfaces.tickerYearlyModel.Record = mock({})
  const tickerYearly1 = {
    ...yearlyMock,
    eps: 7000,
    ebitda: 800,
    netIncome: 90,
    grossProfit: 100,
    totalRevenue: 1100,
  }

  const tickerYearly2 = {
    ...yearlyMock,
    eps: 700,
    ebitda: 80,
    netIncome: 9,
    grossProfit: 10,
    totalRevenue: 110,
  }

  test('could get prefer value for price', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherPrice,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(100)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherPrice,
      tickerDaily2,
      tickerQuarterly2,
      null,
    )).toEqual(10)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerPrice,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(100)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerPrice,
      tickerDaily2,
      tickerQuarterly2,
      null,
    )).toEqual(10)
    expect(evaluation.getTickerPreferValue(
      23,
      tickerDaily2,
      tickerQuarterly2,
      null,
    )).toBe(null)
  })

  test('could get prefer value for quarter eps', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterEPS,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(20000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterEPS,
      tickerDaily2,
      tickerQuarterly2,
      null,
    )).toEqual(2000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterEPS,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(20000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterEPS,
      tickerDaily2,
      tickerQuarterly2,
      null,
    )).toEqual(2000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterEPS,
      tickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterEPS,
      tickerDaily1,
      null,
      null,
    )).toEqual(null)
  })

  test('could get prefer value for quarter ebitda', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterEBITDA,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(300)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterEBITDA,
      tickerDaily2,
      tickerQuarterly2,
      null,
    )).toEqual(30)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterEBITDA,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(300)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterEBITDA,
      tickerDaily2,
      tickerQuarterly2,
      null,
    )).toEqual(30)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterEBITDA,
      tickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterEBITDA,
      tickerDaily1,
      null,
      null,
    )).toEqual(null)
  })

  test('could get prefer value for quarter income', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterIncome,
      tickerDaily1,
      tickerQuarterly1,
      null,
    )).toEqual(40000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterIncome,
      tickerDaily2,
      tickerQuarterly2,
      null,
    )).toEqual(4000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterIncome,
      tickerDaily1,
      tickerQuarterly1,
      null,
    )).toEqual(40000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterIncome,
      tickerDaily2,
      tickerQuarterly2,
      null,
    )).toEqual(4000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterIncome,
      tickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterIncome,
      tickerDaily1,
      null,
      tickerYearly1,
    )).toEqual(null)
  })

  test('could get prefer value for quarter grossProfit', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterProfit,
      tickerDaily1,
      tickerQuarterly1,
      null,
    )).toEqual(50)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterProfit,
      tickerDaily2,
      tickerQuarterly2,
      null,
    )).toEqual(5)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterProfit,
      tickerDaily1,
      tickerQuarterly1,
      null,
    )).toEqual(50)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterProfit,
      tickerDaily2,
      tickerQuarterly2,
      null,
    )).toEqual(5)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterProfit,
      tickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterProfit,
      tickerDaily1,
      null,
      tickerYearly1,
    )).toEqual(null)
  })

  test('could get prefer value for quarter totalRevenue', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterRevenue,
      tickerDaily1,
      tickerQuarterly1,
      null,
    )).toEqual(600)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterRevenue,
      tickerDaily2,
      tickerQuarterly2,
      null,
    )).toEqual(60)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterRevenue,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(600)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterRevenue,
      tickerDaily2,
      tickerQuarterly2,
      null,
    )).toEqual(60)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherQuarterRevenue,
      tickerDaily2,
      null,
      tickerYearly1,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerQuarterRevenue,
      tickerDaily1,
      null,
      null,
    )).toEqual(null)
  })

  test('could get prefer value for yearly eps', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearEPS,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(7000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearEPS,
      tickerDaily2,
      tickerQuarterly2,
      tickerYearly2,
    )).toEqual(700)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearEPS,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(7000)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearEPS,
      tickerDaily2,
      tickerQuarterly2,
      tickerYearly2,
    )).toEqual(700)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearEPS,
      tickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearEPS,
      tickerDaily1,
      null,
      null,
    )).toEqual(null)
  })

  test('could get prefer value for yearly ebitda', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearEBITDA,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(800)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearEBITDA,
      tickerDaily2,
      tickerQuarterly2,
      tickerYearly2,
    )).toEqual(80)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearEBITDA,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(800)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearEBITDA,
      tickerDaily2,
      tickerQuarterly2,
      tickerYearly2,
    )).toEqual(80)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearEBITDA,
      tickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearEBITDA,
      tickerDaily1,
      null,
      null,
    )).toEqual(null)
  })

  test('could get prefer value for yearly netIncome', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearIncome,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(90)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearIncome,
      tickerDaily2,
      tickerQuarterly2,
      tickerYearly2,
    )).toEqual(9)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearIncome,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(90)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearIncome,
      tickerDaily2,
      tickerQuarterly2,
      tickerYearly2,
    )).toEqual(9)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearIncome,
      tickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearIncome,
      tickerDaily1,
      null,
      null,
    )).toEqual(null)
  })

  test('could get prefer value for yearly grossProfit', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearProfit,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(100)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearProfit,
      tickerDaily2,
      tickerQuarterly2,
      tickerYearly2,
    )).toEqual(10)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearProfit,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(100)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearProfit,
      tickerDaily2,
      tickerQuarterly2,
      tickerYearly2,
    )).toEqual(10)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearProfit,
      tickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearProfit,
      tickerDaily1,
      null,
      null,
    )).toEqual(null)
  })

  test('could get prefer value for yearly totalRevenue', () => {
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearRevenue,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(1100)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearRevenue,
      tickerDaily2,
      tickerQuarterly2,
      tickerYearly2,
    )).toEqual(110)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearRevenue,
      tickerDaily1,
      tickerQuarterly1,
      tickerYearly1,
    )).toEqual(1100)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearRevenue,
      tickerDaily2,
      tickerQuarterly2,
      tickerYearly2,
    )).toEqual(110)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.HigherYearRevenue,
      tickerDaily2,
      null,
      null,
    )).toEqual(null)
    expect(evaluation.getTickerPreferValue(
      constants.BehaviorValue.Preference.LowerYearRevenue,
      tickerDaily1,
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
  test('has correct total items', () => {
    const total = constants.Behavior.MovementBuyBehaviors.length + constants.Behavior.MovementSellBehaviors.length
    expect(Object.keys(evaluation.MovementTriggers).length).toEqual(total)
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
  test('has correct total items', () => {
    const total = constants.Behavior.CompareBuyBehaviors.length + constants.Behavior.CompareSellBehaviors.length
    expect(Object.keys(evaluation.CompareTriggers).length).toEqual(total)
  })
})

describe('#getTickerMovementWeight', () => {
  test('could get weight when matches', () => {
    const dailyTickersMock: interfaces.dailyTickersModel.TickerInfo = mock({})
    const tickerInfo = {
      ...dailyTickersMock,
      priceDailyIncrease: 2,
      priceDailyDecrease: 3,
      priceWeeklyIncrease: 2,
      priceWeeklyDecrease: 3,
      priceMonthlyIncrease: 5,
    }

    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern = {
      ...patternMock,
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
      tickerInfo, 'priceDailyIncrease', pattern, 'priceDailyIncreaseBuy',
    )).toBe(2)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceDailyIncrease', pattern, 'priceDailyIncreaseSell',
    )).toBe(2)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceDailyDecrease', pattern, 'priceDailyDecreaseBuy',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceDailyDecrease', pattern, 'priceDailyDecreaseSell',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceWeeklyIncrease', pattern, 'priceWeeklyIncreaseBuy',
    )).toBe(3)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceWeeklyIncrease', pattern, 'priceWeeklyIncreaseSell',
    )).toBe(3)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceWeeklyDecrease', pattern, 'priceWeeklyDecreaseBuy',
    )).toBe(4)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceWeeklyDecrease', pattern, 'priceWeeklyDecreaseSell',
    )).toBe(4)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceMonthlyIncrease', pattern, 'priceMonthlyIncreaseBuy',
    )).toBe(5)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceMonthlyIncrease', pattern, 'priceMonthlyIncreaseSell',
    )).toBe(5)
  })

  test('could get weight when there is no matches', () => {
    const dailyTickersMock: interfaces.dailyTickersModel.TickerInfo = mock({})
    const tickerInfo = {
      ...dailyTickersMock,
      priceWeeklyIncrease: 2,
      priceWeeklyDecrease: 3,
    }

    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern = {
      ...patternMock,
      priceDailyIncreaseBuy: 2,
      priceDailyIncreaseSell: 2,
    }

    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceWeeklyIncrease', pattern, 'priceWeeklyIncreaseBuy',
    )).toBe(1)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceWeeklyIncrease', pattern, 'priceWeeklyIncreaseSell',
    )).toBe(1)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceWeeklyDecrease', pattern, 'priceWeeklyDecreaseBuy',
    )).toBe(1)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceWeeklyDecrease', pattern, 'priceWeeklyDecreaseSell',
    )).toBe(1)
  })

  test('could get weight when there is matches with less value', () => {
    const dailyTickersMock: interfaces.dailyTickersModel.TickerInfo = mock({})
    const tickerInfo = {
      ...dailyTickersMock,
      priceWeeklyIncrease: 2,
      priceWeeklyDecrease: 3,
    }

    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern = {
      ...patternMock,
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
      tickerInfo, 'priceDailyIncrease', pattern, 'priceDailyIncreaseBuy',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceDailyIncrease', pattern, 'priceDailyIncreaseSell',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceDailyDecrease', pattern, 'priceDailyDecreaseBuy',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceDailyDecrease', pattern, 'priceDailyDecreaseSell',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceWeeklyIncrease', pattern, 'priceWeeklyIncreaseBuy',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceWeeklyIncrease', pattern, 'priceWeeklyIncreaseSell',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceWeeklyDecrease', pattern, 'priceWeeklyDecreaseBuy',
    )).toBe(0)
    expect(evaluation.getTickerMovementWeight(
      tickerInfo, 'priceWeeklyDecrease', pattern, 'priceWeeklyDecreaseSell',
    )).toBe(0)
  })
})

describe('#getTickerCompareWeight', () => {
  test('could get weight when matches', () => {
    const dailyTickersMock: interfaces.dailyTickersModel.TickerInfo = mock({})
    const tickerInfo = {
      ...dailyTickersMock,
      gdpYearlyChangePercent: 3,
      gdpQuarterlyChangePercent: -2,
    }

    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern = {
      ...patternMock,
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
      tickerInfo, 'gdpYearlyChangePercent', pattern, 'gdpYearlyChangeAboveBuy',
    )).toBe(4)
    expect(evaluation.getTickerCompareWeight(
      tickerInfo, 'gdpYearlyChangePercent', pattern, 'gdpYearlyChangeAboveSell',
    )).toBe(3)
    expect(evaluation.getTickerCompareWeight(
      tickerInfo, 'gdpYearlyChangePercent', pattern, 'gdpYearlyChangeBelowBuy',
    )).toBe(4)
    expect(evaluation.getTickerCompareWeight(
      tickerInfo, 'gdpYearlyChangePercent', pattern, 'gdpYearlyChangeBelowSell',
    )).toBe(3)
    expect(evaluation.getTickerCompareWeight(
      tickerInfo, 'gdpQuarterlyChangePercent', pattern, 'gdpQuarterlyChangeAboveBuy',
    )).toBe(3)
    expect(evaluation.getTickerCompareWeight(
      tickerInfo, 'gdpQuarterlyChangePercent', pattern, 'gdpQuarterlyChangeAboveSell',
    )).toBe(4)
    expect(evaluation.getTickerCompareWeight(
      tickerInfo, 'gdpQuarterlyChangePercent', pattern, 'gdpQuarterlyChangeBelowBuy',
    )).toBe(3)
    expect(evaluation.getTickerCompareWeight(
      tickerInfo, 'gdpQuarterlyChangePercent', pattern, 'gdpQuarterlyChangeBelowSell',
    )).toBe(5)
  })

  test('could get weight when there are no matches', () => {
    const dailyTickersMock: interfaces.dailyTickersModel.TickerInfo = mock({})
    const tickerInfo = { ...dailyTickersMock, gdpQuarterlyChangePercent: -2 }

    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern = {
      ...patternMock,
      gdpYearlyChangeAboveBuy: 1,
      gdpYearlyChangeAboveSell: 2,
      gdpYearlyChangeBelowBuy: 5,
      gdpYearlyChangeBelowSell: 4,
    }

    expect(evaluation.getTickerCompareWeight(
      tickerInfo, 'gdpQuarterlyChangePercent', pattern, 'gdpQuarterlyChangeAboveBuy',
    )).toBe(1)
    expect(evaluation.getTickerCompareWeight(
      tickerInfo, 'gdpQuarterlyChangePercent', pattern, 'gdpQuarterlyChangeAboveSell',
    )).toBe(1)
    expect(evaluation.getTickerCompareWeight(
      tickerInfo, 'gdpQuarterlyChangePercent', pattern, 'gdpQuarterlyChangeBelowBuy',
    )).toBe(1)
    expect(evaluation.getTickerCompareWeight(
      tickerInfo, 'gdpQuarterlyChangePercent', pattern, 'gdpQuarterlyChangeBelowSell',
    )).toBe(1)
  })

  test('could get weight when matches with less value', () => {
    const dailyTickersMock: interfaces.dailyTickersModel.TickerInfo = mock({})
    const tickerInfo = {
      ...dailyTickersMock,
      gdpYearlyChangePercent: 0,
      gdpQuarterlyChangePercent: -2,
    }

    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern = {
      ...patternMock,
      gdpYearlyChangeAboveBuy: 1,
      gdpYearlyChangeAboveSell: 2,
      gdpYearlyChangeBelowBuy: -1,
      gdpYearlyChangeBelowSell: -2,
    }

    expect(evaluation.getTickerCompareWeight(
      tickerInfo, 'gdpYearlyChangePercent', pattern, 'gdpYearlyChangeAboveBuy',
    )).toBe(0)
    expect(evaluation.getTickerCompareWeight(
      tickerInfo, 'gdpYearlyChangePercent', pattern, 'gdpYearlyChangeAboveSell',
    )).toBe(0)
    expect(evaluation.getTickerCompareWeight(
      tickerInfo, 'gdpYearlyChangePercent', pattern, 'gdpYearlyChangeBelowBuy',
    )).toBe(0)
    expect(evaluation.getTickerCompareWeight(
      tickerInfo, 'gdpYearlyChangePercent', pattern, 'gdpYearlyChangeBelowSell',
    )).toBe(0)
  })
})

describe('#getMovementAndCompareWeights', () => {
  const dailyTickersMock: interfaces.dailyTickersModel.TickerInfo = mock({})
  const tickerInfo1 = {
    ...dailyTickersMock,
    priceDailyIncrease: 3,
    gdpYearlyChangePercent: 2,
  }

  const tickerInfo2 = {
    ...dailyTickersMock,
    priceDailyIncrease: 3,
    priceWeeklyDecrease: 2,
    gdpYearlyChangePercent: 2,
  }

  const tickerInfo3 = {
    ...dailyTickersMock,
    priceDailyIncrease: 3,
    gdpYearlyChangePercent: 2,
    gdpQuarterlyChangePercent: -1,
  }

  const patternMock: interfaces.traderPatternModel.Record = mock({})
  const pattern1 = {
    ...patternMock,
    priceDailyIncreaseBuy: 1,
    gdpYearlyChangeAboveBuy: 1,
  }

  const pattern2 = {
    ...patternMock,
    priceDailyIncreaseBuy: 2,
    gdpYearlyChangeAboveBuy: 1,
  }

  const pattern3 = {
    ...patternMock,
    priceDailyIncreaseBuy: 2,
    priceWeeklyDecreaseBuy: 1,
    gdpYearlyChangeAboveBuy: 1,
  }

  const pattern4 = {
    ...patternMock,
    priceDailyIncreaseBuy: 2,
    gdpYearlyChangeAboveBuy: 1,
    gdpQuarterlyChangeAboveBuy: -3,
  }

  const pattern5 = {
    ...patternMock,
    priceDailyIncreaseSell: 1,
    gdpYearlyChangeAboveSell: 1,
  }

  const pattern6 = {
    ...patternMock,
    priceDailyIncreaseSell: 2,
    gdpYearlyChangeAboveSell: 1,
  }

  const pattern7 = {
    ...patternMock,
    priceDailyIncreaseSell: 2,
    priceWeeklyDecreaseSell: 1,
    gdpYearlyChangeAboveSell: 1,
  }

  const pattern8 = {
    ...patternMock,
    priceDailyIncreaseSell: 2,
    gdpYearlyChangeAboveSell: 1,
    gdpQuarterlyChangeAboveSell: -3,
  }

  test('could get correct weights for buy', () => {
    expect(evaluation.getMovementAndCompareWeights(
      pattern1, tickerInfo1, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(12)
    expect(evaluation.getMovementAndCompareWeights(
      pattern1, tickerInfo1, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(1)

    expect(evaluation.getMovementAndCompareWeights(
      pattern2, tickerInfo1, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(9)
    expect(evaluation.getMovementAndCompareWeights(
      pattern2, tickerInfo1, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(1)

    expect(evaluation.getMovementAndCompareWeights(
      pattern3, tickerInfo2, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(27)
    expect(evaluation.getMovementAndCompareWeights(
      pattern3, tickerInfo2, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(1)

    expect(evaluation.getMovementAndCompareWeights(
      pattern4, tickerInfo3, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(36)
    expect(evaluation.getMovementAndCompareWeights(
      pattern4, tickerInfo3, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(1)
  })

  test('could get correct weights for sell', () => {
    expect(evaluation.getMovementAndCompareWeights(
      pattern5, tickerInfo1, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(12)
    expect(evaluation.getMovementAndCompareWeights(
      pattern5, tickerInfo1, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(1)

    expect(evaluation.getMovementAndCompareWeights(
      pattern6, tickerInfo1, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(9)
    expect(evaluation.getMovementAndCompareWeights(
      pattern6, tickerInfo1, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(1)

    expect(evaluation.getMovementAndCompareWeights(
      pattern7, tickerInfo2, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(27)
    expect(evaluation.getMovementAndCompareWeights(
      pattern7, tickerInfo2, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(1)

    expect(evaluation.getMovementAndCompareWeights(
      pattern8, tickerInfo3, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(36)
    expect(evaluation.getMovementAndCompareWeights(
      pattern8, tickerInfo3, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(1)
  })

  test('if there is no weight for buy', () => {
    const tickerInfoMock: interfaces.dailyTickersModel.TickerInfo = mock({})
    const tickerInfo1 = { ...tickerInfoMock, priceDailyIncrease: 3 }
    const tickerInfo2 = { ...tickerInfoMock, gdpYearlyChangePercent: 2 }
    const tickerInfo3 = instance(tickerInfoMock)

    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern = {
      ...patternMock,
      priceDailyIncreaseBuy: 1,
      gdpYearlyChangeAboveBuy: 1,
    }

    expect(evaluation.getMovementAndCompareWeights(
      pattern, tickerInfo1, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(0)
    expect(evaluation.getMovementAndCompareWeights(
      pattern, tickerInfo2, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(0)
    expect(evaluation.getMovementAndCompareWeights(
      pattern, tickerInfo3, constants.Behavior.MovementBuyBehaviors, constants.Behavior.CompareBuyBehaviors,
    )).toBe(0)
  })

  test('if there is no weight for sell', () => {
    const tickerInfoMock: interfaces.dailyTickersModel.TickerInfo = mock({})
    const tickerInfo1 = { ...tickerInfoMock, priceDailyIncrease: 3 }
    const tickerInfo2 = { ...tickerInfoMock, gdpYearlyChangePercent: 2 }
    const tickerInfo3 = instance(tickerInfoMock)

    const pattern = {
      ...patternMock,
      priceDailyIncreaseSell: 1,
      gdpYearlyChangeAboveSell: 1,
    }

    expect(evaluation.getMovementAndCompareWeights(
      pattern, tickerInfo1, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(0)
    expect(evaluation.getMovementAndCompareWeights(
      pattern, tickerInfo2, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(0)
    expect(evaluation.getMovementAndCompareWeights(
      pattern, tickerInfo3, constants.Behavior.MovementSellBehaviors, constants.Behavior.CompareSellBehaviors,
    )).toBe(0)
  })
})

describe('#getTickersWithSellEvaluation', () => {
  test('could get result', () => {
    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern = {
      ...patternMock,
      priceDailyDecreaseSell: 1,
      sellPreference: constants.BehaviorValue.Preference.HigherPrice,
    }

    const dailyMock: interfaces.tickerDailyModel.Record = mock({})
    const daily = { ...dailyMock, closePrice: 100 }

    const infoMock: interfaces.dailyTickersModel.TickerInfo = mock({})
    const info = { ...infoMock, priceDailyDecrease: 2 }

    const dailyTickerMock: interfaces.dailyTickersModel.DailyTicker = mock({})
    const dailyTicker = { ...dailyTickerMock, daily, info }

    expect(evaluation.getTickersWithSellEvaluation(1, pattern, dailyTicker)).toStrictEqual({
      tickerId: 1, preferValue: 100, weight: 3,
    })
    expect(evaluation.getTickersWithSellEvaluation(2, pattern, dailyTicker)).toStrictEqual({
      tickerId: 2, preferValue: 100, weight: 3,
    })
  })

  test('if there is no daily ticker', () => {
    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern = {
      ...patternMock,
      priceDailyDecreaseSell: 1,
      sellPreference: constants.BehaviorValue.Preference.HigherPrice,
    }

    expect(evaluation.getTickersWithSellEvaluation(1, pattern, null)).toBe(null)
  })

  test('if there is no prefer value', () => {
    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern = {
      ...patternMock,
      priceDailyDecreaseSell: 1,
      sellPreference: constants.BehaviorValue.Preference.HigherPrice,
    }

    const dailyMock: interfaces.tickerDailyModel.Record = mock({})
    const daily = instance(dailyMock)

    const infoMock: interfaces.dailyTickersModel.TickerInfo = mock({})
    const info = {
      ...infoMock,
      priceDailyDecrease: 2,
    }

    const dailyTickerMock: interfaces.dailyTickersModel.DailyTicker = mock({})
    const dailyTicker = { ...dailyTickerMock, daily, info }

    expect(evaluation.getTickersWithSellEvaluation(1, pattern, dailyTicker)).toBe(null)
  })

  test('if there is no weight', () => {
    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern = {
      ...patternMock,
      priceDailyDecreaseSell: 1,
      sellPreference: constants.BehaviorValue.Preference.HigherPrice,
    }

    const dailyMock: interfaces.tickerDailyModel.Record = mock({})
    const daily = { ...dailyMock, closePrice: 100 }

    const infoMock: interfaces.dailyTickersModel.TickerInfo = mock({})
    const info = { ...infoMock, priceDailyDecrease: 0 }

    const dailyTickerMock: interfaces.dailyTickersModel.DailyTicker = mock({})
    const dailyTicker = { ...dailyTickerMock, daily, info }

    expect(evaluation.getTickersWithSellEvaluation(1, pattern, dailyTicker)).toBe(null)
  })
})

describe('#getTickersWithBuyEvaluation', () => {
  test('could get result', () => {
    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern = {
      ...patternMock,
      priceDailyDecreaseBuy: 1,
      buyPreference: constants.BehaviorValue.Preference.HigherPrice,
    }

    const dailyMock: interfaces.tickerDailyModel.Record = mock({})
    const daily = { ...dailyMock, closePrice: 100 }

    const infoMock: interfaces.dailyTickersModel.TickerInfo = mock({})
    const info = { ...infoMock, priceDailyDecrease: 2 }

    const dailyTickerMock: interfaces.dailyTickersModel.DailyTicker = mock({})
    const dailyTicker = { ...dailyTickerMock, daily, info }

    expect(evaluation.getTickersWithBuyEvaluation(1, pattern, dailyTicker)).toStrictEqual({
      tickerId: 1, preferValue: 100, weight: 3,
    })
    expect(evaluation.getTickersWithBuyEvaluation(2, pattern, dailyTicker)).toStrictEqual({
      tickerId: 2, preferValue: 100, weight: 3,
    })
  })

  test('if there is no daily ticker', () => {
    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern = {
      ...patternMock,
      priceDailyDecreaseBuy: 1,
      buyPreference: constants.BehaviorValue.Preference.HigherPrice,
    }

    expect(evaluation.getTickersWithBuyEvaluation(1, pattern, null)).toBe(null)
  })

  test('if there is no prefer value', () => {
    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern = {
      ...patternMock,
      priceDailyDecreaseBuy: 1,
      buyPreference: constants.BehaviorValue.Preference.HigherPrice,
    }

    const dailyMock: interfaces.tickerDailyModel.Record = mock({})
    const daily = instance(dailyMock)

    const infoMock: interfaces.dailyTickersModel.TickerInfo = mock({})
    const info = { ...infoMock, priceDailyDecrease: 2 }

    const dailyTickerMock: interfaces.dailyTickersModel.DailyTicker = mock({})
    const dailyTicker = {
      ...dailyTickerMock, daily, info,
    }

    expect(evaluation.getTickersWithBuyEvaluation(1, pattern, dailyTicker)).toBe(null)
  })

  test('if there is no weight', () => {
    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern = {
      ...patternMock,
      priceDailyDecreaseBuy: 1,
      buyPreference: constants.BehaviorValue.Preference.HigherPrice,
    }

    const dailyMock: interfaces.tickerDailyModel.Record = mock({})
    const daily = { ...dailyMock, closePrice: 100 }

    const infoMock: interfaces.dailyTickersModel.TickerInfo = mock({})
    const info = { ...infoMock, priceDailyDecrease: 0 }

    const dailyTickerMock: interfaces.dailyTickersModel.DailyTicker = mock({})
    const dailyTicker = {
      ...dailyTickerMock, daily, info,
    }

    expect(evaluation.getTickersWithBuyEvaluation(1, pattern, dailyTicker)).toBe(null)
  })
})

describe('#getOrderedTickerEvaluations', () => {
  test('could sort correctly', () => {
    expect(evaluation.getOrderedTickerEvaluations([
      { tickerId: 1, preferValue: 100, weight: 3 },
      { tickerId: 1, preferValue: 50, weight: 4 },
      { tickerId: 1, preferValue: 100, weight: 5 },
      { tickerId: 1, preferValue: 200, weight: 3 },
      { tickerId: 1, preferValue: 20, weight: 4 },
    ], 1)).toStrictEqual([
      { tickerId: 1, preferValue: 100, weight: 5 },
      { tickerId: 1, preferValue: 50, weight: 4 },
      { tickerId: 1, preferValue: 20, weight: 4 },
      { tickerId: 1, preferValue: 200, weight: 3 },
      { tickerId: 1, preferValue: 100, weight: 3 },
    ])
    expect(evaluation.getOrderedTickerEvaluations([
      { tickerId: 1, preferValue: 100, weight: 3 },
      { tickerId: 1, preferValue: 50, weight: 4 },
      { tickerId: 1, preferValue: 100, weight: 5 },
      { tickerId: 1, preferValue: 200, weight: 3 },
      { tickerId: 1, preferValue: 20, weight: 4 },
    ], 2)).toStrictEqual([
      { tickerId: 1, preferValue: 100, weight: 5 },
      { tickerId: 1, preferValue: 20, weight: 4 },
      { tickerId: 1, preferValue: 50, weight: 4 },
      { tickerId: 1, preferValue: 100, weight: 3 },
      { tickerId: 1, preferValue: 200, weight: 3 },
    ])
    expect(() => evaluation.getOrderedTickerEvaluations([
      { tickerId: 1, preferValue: 100, weight: 3 },
      { tickerId: 1, preferValue: 20, weight: 4 },
    ], 23)).toThrowError()
  })
})

const dailyMock: interfaces.tickerDailyModel.Record = mock({})
const daily1 = { ...dailyMock, closePrice: 30 }
const daily2 = { ...dailyMock, closePrice: 50 }

const infoMock: interfaces.dailyTickersModel.TickerInfo = mock({})
const info1 = { ...infoMock, priceDailyIncrease: 2 }
const info2 = { ...infoMock, priceDailyIncrease: 3 }

const dailyTickerMock: interfaces.dailyTickersModel.DailyTicker = mock({})

const dailyTicker1 = {
  ...dailyTickerMock,
  daily: daily1,
  info: info1,
}

const dailyTicker2 = {
  ...dailyTickerMock,
  daily: daily2,
  info: info2,
}

const dailyTicker3 = {
  ...dailyTickerMock,
  daily: daily2,
  info: info1,
}

const dailyTickers: interfaces.dailyTickersModel.DailyTickers = {
  1: dailyTicker1,
  3: dailyTicker2,
  4: dailyTicker3,
}

describe('#getTickerBuyEaluations', () => {
  const patternMock: interfaces.traderPatternModel.Record = mock({})
  const pattern = {
    ...patternMock,
    priceDailyIncreaseBuy: 1,
    buyPreference: constants.BehaviorValue.Preference.HigherPrice,
  }

  test('could get evaluation correctly', () => {
    expect(evaluation.getTickerBuyEaluations([1, 2, 3, 4], pattern, dailyTickers))
      .toStrictEqual([
        { tickerId: 3, preferValue: 50, weight: 4 },
        { tickerId: 4, preferValue: 50, weight: 3 },
        { tickerId: 1, preferValue: 30, weight: 3 },
      ])
  })
})

describe('#getTickerSellEaluations', () => {
  const patternMock: interfaces.traderPatternModel.Record = mock({})
  const pattern = {
    ...patternMock,
    priceDailyIncreaseSell: 1,
    sellPreference: constants.BehaviorValue.Preference.LowerPrice,
  }

  test('could get evaluation correctly', () => {
    expect(evaluation.getTickerSellEaluations([1, 2, 3, 4], pattern, dailyTickers))
      .toStrictEqual([
        { tickerId: 3, preferValue: 50, weight: 4 },
        { tickerId: 1, preferValue: 30, weight: 3 },
        { tickerId: 4, preferValue: 50, weight: 3 },
      ])
  })
})
