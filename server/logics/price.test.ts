import * as interfaces from '@shared/interfaces'
import * as price from './price'

test('could get getSplitMultiplier', async () => {
  // @ts-ignore
  const DAILY: interfaces.tickerDailyModel.Record = {
    splitMultiplier: 5.2,
  }
  expect(price.getSplitMultiplier('1.11', DAILY).toFixed(3)).toEqual('5.772')
  expect(price.getSplitMultiplier('1.23', DAILY).toFixed(3)).toEqual('6.396')
  expect(price.getSplitMultiplier('1.11', null).toFixed(2)).toEqual('1.11')
  expect(price.getSplitMultiplier('1.23', null).toFixed(2)).toEqual('1.23')
})

test('could convert to padding price', async () => {
  expect(price.convertToPaddingPrice('1.11')).toEqual(111)
  expect(price.convertToPaddingPrice('1.111')).toEqual(111)
  expect(price.convertToPaddingPrice('1.23')).toEqual(123)
  expect(price.convertToPaddingPrice('1.234')).toEqual(123)
})
