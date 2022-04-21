import * as connect from './adapter'

test('Have defined database config enums', () => {
  expect(connect.DatabaseConfig.Client).toBeDefined()
  expect(connect.DatabaseConfig.Connection).toBeDefined()
})

test('Have defined database table enums', () => {
  expect(connect.DatabaseTable.User).toBeDefined()
  expect(connect.DatabaseTable.Ticker).toBeDefined()
  expect(connect.DatabaseTable.TickerYearly).toBeDefined()
  expect(connect.DatabaseTable.TickerQuarterly).toBeDefined()
  expect(connect.DatabaseTable.TickerHolder).toBeDefined()
  expect(connect.DatabaseTable.TickerCategory).toBeDefined()
  expect(connect.DatabaseTable.IndicatorYearly).toBeDefined()
  expect(connect.DatabaseTable.IndicatorQuarterly).toBeDefined()
  expect(connect.DatabaseTable.IndicatorMonthly).toBeDefined()
  expect(connect.DatabaseTable.Trader).toBeDefined()
  expect(connect.DatabaseTable.TraderEnv).toBeDefined()
  expect(connect.DatabaseTable.TraderEnvFollower).toBeDefined()
  expect(connect.DatabaseTable.TraderHolding).toBeDefined()
  expect(connect.DatabaseTable.TraderPattern).toBeDefined()
  expect(connect.DatabaseTable.TraderFollower).toBeDefined()
  expect(connect.DatabaseTable.TraderCombo).toBeDefined()
  expect(connect.DatabaseTable.TraderComboFollower).toBeDefined()
  expect(connect.DatabaseTable.DailyTickers).toBeDefined()
})

test('Have defined cache key enums', () => {
  expect(connect.CacheKey.TickerPrices).toBeDefined()
})
