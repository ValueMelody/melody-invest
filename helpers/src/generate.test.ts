import * as generate from './generate'
import * as interfaces from '@shared/interfaces'
import { mock } from 'ts-mockito'

describe('#toSHA256', () => {
  test('could generate sha256', () => {
    const first = generate.toSHA256('123')
    const second = generate.toSHA256('abcdefg')
    expect(first.length).toEqual(64)
    expect(second.length).toEqual(64)
    expect(first).toEqual(generate.toSHA256('123'))
    expect(first).not.toEqual(second)
  })
})

describe('#toSHA512', () => {
  test('could generate sha512', () => {
    const first = generate.toSHA512('123')
    const second = generate.toSHA512('abcdefg')
    expect(first.length).toEqual(128)
    expect(second.length).toEqual(128)
    expect(first).toEqual(generate.toSHA512('123'))
    expect(first).not.toEqual(second)
  })
})

describe('#getPatternHashCode', () => {
  test('could get pattern hash code', () => {
    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern1 = {
      ...patternMock,
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

    expect(generate.toPatternHashCode(pattern1))
      .toEqual(
        // eslint-disable-next-line max-len
        'd592341948fd4682fde2031197e221aba127eb3106f051f13dbfff6373c0c912ac194a02b141ee21396be8fa8b8979d276133900db610003baa58e52dcc8c6d7',
      )

    const pattern2 = {
      ...patternMock,
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

    expect(generate.toPatternHashCode(pattern2))
      .toEqual(
        // eslint-disable-next-line max-len
        '518c7e9a04d2e0d6a64f6b997819ab4ad7c2a13f73f70e01e0da78ea764910f95cfaa5ac020da4262bc15da62ff2a99f19602f79915d9d39c7bf0e0bde50ceec',
      )
  })
})
