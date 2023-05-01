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
        'ca5cd1e3e43b340d0c7ab8e83d496b5e82aa1ca4563ad18e90ae0a4a18e1206a8e63f2f5ccb03c15a04f28f17903be58a1524d75a436efa2e29c1508e5b47f3a',
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
        '26db4feb4e7068f50c84d41cd615bc96d6a3db77cfc5ed77d3ae329f4666b54325f9852b2ab5eae7bf03e93b20acb34afa73b2e35fcbc8898bc9c306bf194b5d',
      )
  })
})
