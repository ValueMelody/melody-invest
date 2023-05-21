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
        'd16baed8f3cfabfed16e781b7efb3642cde9f090918591cdb8f6dd034bff5e12b8bef05aa61e3ac2819e8bb91d59f74629aed58dae4a3ffdce5290dd37d842d8',
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
        '299249681d3ee074ebcb330b7757f0697de130318f148fbd62226786fb7b5a22becbd36c793575e3f048302b1b40612f40cfb9e1aced26b0e670830cded339af',
      )
  })
})
