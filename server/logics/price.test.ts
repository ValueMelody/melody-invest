import * as interfaces from '@shared/interfaces'
import * as price from './price'
import { instance, mock, when } from 'ts-mockito'

describe('#getSplitMultiplier', () => {
  test('could get correct value', () => {
    const dailyMock: interfaces.tickerDailyModel.Record = mock({})
    when(dailyMock.splitMultiplier).thenReturn(5.2)
    const daily = instance(dailyMock)

    expect(price.getSplitMultiplier('1.11', daily).toFixed(3)).toEqual('5.772')
    expect(price.getSplitMultiplier('1.23', daily).toFixed(3)).toEqual('6.396')
    expect(price.getSplitMultiplier('1.11', null).toFixed(2)).toEqual('1.11')
    expect(price.getSplitMultiplier('1.23', null).toFixed(2)).toEqual('1.23')
  })
})

describe('#convertToPaddingPrice', () => {
  test('could convert to correct value', () => {
    expect(price.convertToPaddingPrice('1.11')).toEqual(111)
    expect(price.convertToPaddingPrice('1.111')).toEqual(111)
    expect(price.convertToPaddingPrice('1.23')).toEqual(123)
    expect(price.convertToPaddingPrice('1.234')).toEqual(123)
  })
})
