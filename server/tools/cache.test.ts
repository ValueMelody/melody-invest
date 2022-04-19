import * as cache from './cache'

test('could generate cache key for daily tickers', () => {
  expect(cache.generateTickerPricesKey('2001-01-01')).toEqual('tickerPrices{2001-01-01}')
})
