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
    expect(cache.generateSystemEndpointKey('top-trader-combos'))
      .toEqual('systemEndpoint-[top-trader-combos]')
  })
})

describe('#generatePayPalAccessTokenKey', () => {
  test('could generate cache key for paypal access token', () => {
    expect(cache.generatePayPalAccessTokenKey()).toBe('paypalAccessToken')
  })
})
