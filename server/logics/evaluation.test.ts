import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as evaluation from './evaluation'

// @ts-ignore
const TICKER_DAILY_1: interfaces.tickerDailyModel.Record = {
  closePrice: 100,
}
// @ts-ignore
const TICKER_QUARTERLY_1: interfaces.tickerQuarterlyModel.Record = {
  eps: 20000,
  ebitda: 300,
  netIncome: 40000,
  grossProfit: 50,
  totalRevenue: 600,
}
// @ts-ignore
const TICKER_YEARLY_1: interfaces.tickerYearlyModel.Record = {
  eps: 7000,
  ebitda: 800,
  netIncome: 90,
  grossProfit: 100,
  totalRevenue: 1100,
}

// @ts-ignore
const TICKER_DAILY_2: interfaces.tickerDailyModel.Record = {
  closePrice: 10,
}
// @ts-ignore
const TICKER_QUARTERLY_2: interfaces.tickerQuarterlyModel.Record = {
  eps: 2000,
  ebitda: 30,
  netIncome: 4000,
  grossProfit: 5,
  totalRevenue: 60,
}
// @ts-ignore
const TICKER_YEARLY_2: interfaces.tickerYearlyModel.Record = {
  eps: 700,
  ebitda: 80,
  netIncome: 9,
  grossProfit: 10,
  totalRevenue: 110,
}

test('could get ticker prefer value for price', () => {
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherPrice,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(100)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherPrice,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    null,
  )).toEqual(10)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerPrice,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(100)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerPrice,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    null,
  )).toEqual(10)
})

test('could get ticker prefer value for quarter eps', () => {
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherQuarterEPS,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(20000)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherQuarterEPS,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    null,
  )).toEqual(2000)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerQuarterEPS,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(20000)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerQuarterEPS,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    null,
  )).toEqual(2000)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherQuarterEPS,
    TICKER_DAILY_2,
    null,
    null,
  )).toEqual(null)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerQuarterEPS,
    TICKER_DAILY_1,
    null,
    null,
  )).toEqual(null)
})

test('could get ticker prefer value for quarter ebitda', () => {
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherQuarterEBITDA,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(300)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherQuarterEBITDA,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    null,
  )).toEqual(30)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerQuarterEBITDA,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(300)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerQuarterEBITDA,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    null,
  )).toEqual(30)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherQuarterEBITDA,
    TICKER_DAILY_2,
    null,
    null,
  )).toEqual(null)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerQuarterEBITDA,
    TICKER_DAILY_1,
    null,
    null,
  )).toEqual(null)
})

test('could get ticker prefer value for quarter income', () => {
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherQuarterIncome,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    null,
  )).toEqual(40000)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherQuarterIncome,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    null,
  )).toEqual(4000)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerQuarterIncome,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    null,
  )).toEqual(40000)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerQuarterIncome,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    null,
  )).toEqual(4000)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherQuarterIncome,
    TICKER_DAILY_2,
    null,
    null,
  )).toEqual(null)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerQuarterIncome,
    TICKER_DAILY_1,
    null,
    TICKER_YEARLY_1,
  )).toEqual(null)
})

test('could get ticker prefer value for quarter grossProfit', () => {
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherQuarterProfit,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    null,
  )).toEqual(50)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherQuarterProfit,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    null,
  )).toEqual(5)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerQuarterProfit,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    null,
  )).toEqual(50)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerQuarterProfit,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    null,
  )).toEqual(5)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherQuarterProfit,
    TICKER_DAILY_2,
    null,
    null,
  )).toEqual(null)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerQuarterProfit,
    TICKER_DAILY_1,
    null,
    TICKER_YEARLY_1,
  )).toEqual(null)
})

test('could get ticker prefer value for quarter totalRevenue', () => {
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherQuarterRevenue,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    null,
  )).toEqual(600)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherQuarterRevenue,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    null,
  )).toEqual(60)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerQuarterRevenue,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(600)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerQuarterRevenue,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    null,
  )).toEqual(60)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherQuarterRevenue,
    TICKER_DAILY_2,
    null,
    TICKER_YEARLY_1,
  )).toEqual(null)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerQuarterRevenue,
    TICKER_DAILY_1,
    null,
    null,
  )).toEqual(null)
})

test('could get ticker prefer value for yearly eps', () => {
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherYearEPS,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(7000)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherYearEPS,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    TICKER_YEARLY_2,
  )).toEqual(700)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerYearEPS,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(7000)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerYearEPS,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    TICKER_YEARLY_2,
  )).toEqual(700)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherYearEPS,
    TICKER_DAILY_2,
    null,
    null,
  )).toEqual(null)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerYearEPS,
    TICKER_DAILY_1,
    null,
    null,
  )).toEqual(null)
})

test('could get ticker prefer value for yearly ebitda', () => {
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherYearEBITDA,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(800)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherYearEBITDA,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    TICKER_YEARLY_2,
  )).toEqual(80)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerYearEBITDA,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(800)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerYearEBITDA,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    TICKER_YEARLY_2,
  )).toEqual(80)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherYearEBITDA,
    TICKER_DAILY_2,
    null,
    null,
  )).toEqual(null)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerYearEBITDA,
    TICKER_DAILY_1,
    null,
    null,
  )).toEqual(null)
})

test('could get ticker prefer value for yearly netIncome', () => {
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherYearIncome,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(90)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherYearIncome,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    TICKER_YEARLY_2,
  )).toEqual(9)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerYearIncome,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(90)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerYearIncome,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    TICKER_YEARLY_2,
  )).toEqual(9)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherYearIncome,
    TICKER_DAILY_2,
    null,
    null,
  )).toEqual(null)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerYearIncome,
    TICKER_DAILY_1,
    null,
    null,
  )).toEqual(null)
})

test('could get ticker prefer value for yearly grossProfit', () => {
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherYearProfit,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(100)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherYearProfit,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    TICKER_YEARLY_2,
  )).toEqual(10)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerYearProfit,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(100)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerYearProfit,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    TICKER_YEARLY_2,
  )).toEqual(10)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherYearProfit,
    TICKER_DAILY_2,
    null,
    null,
  )).toEqual(null)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerYearProfit,
    TICKER_DAILY_1,
    null,
    null,
  )).toEqual(null)
})

test('could get ticker prefer value for yearly totalRevenue', () => {
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherYearRevenue,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(1100)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherYearRevenue,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    TICKER_YEARLY_2,
  )).toEqual(110)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerYearRevenue,
    TICKER_DAILY_1,
    TICKER_QUARTERLY_1,
    TICKER_YEARLY_1,
  )).toEqual(1100)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerYearRevenue,
    TICKER_DAILY_2,
    TICKER_QUARTERLY_2,
    TICKER_YEARLY_2,
  )).toEqual(110)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.HigherYearRevenue,
    TICKER_DAILY_2,
    null,
    null,
  )).toEqual(null)
  expect(evaluation.getTickerPreferValue(
    constants.BehaviorValue.Preference.LowerYearRevenue,
    TICKER_DAILY_1,
    null,
    null,
  )).toEqual(null)
})
