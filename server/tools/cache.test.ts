import * as cache from './cache'

describe('#generateTickerPricesKey', () => {
  test('could generate cache key for daily tickers', () => {
    expect(cache.generateTickerPricesKey('2001-01-01'))
      .toEqual('tickerPrices-[2001-01-01]')
  })
})

describe('#generateSystemEndpointKey', () => {
  test('could generate cache key for system endpoint', () => {
    expect(cache.generateSystemEndpointKey('top-trader-profiles'))
      .toEqual('systemEndpoint-[top-trader-profiles]')
    expect(cache.generateSystemEndpointKey('default-trader-combos'))
      .toEqual('systemEndpoint-[default-trader-combos]')
  })
})
