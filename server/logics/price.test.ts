import * as interfaces from '@shared/interfaces'
import * as price from './price'
import { mock } from 'ts-mockito'

describe('#getSplitMultiplier', () => {
  test('could get correct value', () => {
    const dailyMock: interfaces.tickerDailyModel.Record = mock({})
    const daily = {
      ...dailyMock,
      splitMultiplier: 5.2,
    }

    expect(price.getSplitMultiplier(1.11, daily)).toEqual('5.77')
    expect(price.getSplitMultiplier(1.23, daily)).toEqual('6.40')
    expect(price.getSplitMultiplier(1.11, null)).toEqual('1.11')
    expect(price.getSplitMultiplier(1.23, null)).toEqual('1.23')
  })
})

describe('#convertToPaddingPrice', () => {
  test('could convert to correct value', () => {
    expect(price.convertToPaddingPrice(1.11)).toEqual(111)
    expect(price.convertToPaddingPrice(1.111)).toEqual(111)
    expect(price.convertToPaddingPrice(1.23)).toEqual(123)
    expect(price.convertToPaddingPrice(1.234)).toEqual(123)
  })
})
