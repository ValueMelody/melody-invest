import * as adapter from './adapter'

describe('#DatabaseConfig', () => {
  test('Have defined database config enums', () => {
    expect(adapter.DatabaseConfig.Client).toBe('pg')
    expect(adapter.DatabaseConfig.Connection).toStrictEqual({
      host: '127.0.0.1',
      port: 5432,
      user: 'test',
      password: '123',
      database: 'melody',
    })
  })
})

describe('DatabaseTable', () => {
  test('Have defined database table enums', () => {
    expect(adapter.DatabaseTable.User).toBeDefined()
    expect(adapter.DatabaseTable.UserPayment).toBeDefined()
    expect(adapter.DatabaseTable.Email).toBeDefined()
    expect(adapter.DatabaseTable.Ticker).toBeDefined()
    expect(adapter.DatabaseTable.TickerYearly).toBeDefined()
    expect(adapter.DatabaseTable.TickerQuarterly).toBeDefined()
    expect(adapter.DatabaseTable.TickerHolder).toBeDefined()
    expect(adapter.DatabaseTable.TickerCategory).toBeDefined()
    expect(adapter.DatabaseTable.IndicatorYearly).toBeDefined()
    expect(adapter.DatabaseTable.IndicatorQuarterly).toBeDefined()
    expect(adapter.DatabaseTable.IndicatorMonthly).toBeDefined()
    expect(adapter.DatabaseTable.Trader).toBeDefined()
    expect(adapter.DatabaseTable.TraderEnv).toBeDefined()
    expect(adapter.DatabaseTable.TraderEnvFollower).toBeDefined()
    expect(adapter.DatabaseTable.TraderHolding).toBeDefined()
    expect(adapter.DatabaseTable.TraderPattern).toBeDefined()
    expect(adapter.DatabaseTable.TraderFollower).toBeDefined()
    expect(adapter.DatabaseTable.TraderCombo).toBeDefined()
    expect(adapter.DatabaseTable.TraderComboFollower).toBeDefined()
    expect(adapter.DatabaseTable.DailyTickers).toBeDefined()
    expect(adapter.DatabaseTable.Policy).toBeDefined()
  })
})

describe('#CacheConfig', () => {
  test('Have defined cache config enums', () => {
    expect(adapter.CacheConfig.Connection).toStrictEqual({
      host: '127.0.0.1',
      port: 6379,
      password: '123',
    })
    expect(adapter.CacheConfig.LocalConnection).toStrictEqual({
      host: '127.0.0.2',
      port: 6380,
      password: '234',
    })
  })
})

describe('#CacheKey', () => {
  test('Have defined cache key enums', () => {
    expect(adapter.CacheKey.TickerPrices).toBeDefined()
    expect(adapter.CacheKey.SysemEndpoint).toBeDefined()
  })
})

describe('#MarketConfig', () => {
  test('Have defined market config enums', () => {
    expect(adapter.MarketConfig).toStrictEqual({
      Key: 'demo',
      CooldownSeconds: 5,
      BaseUrl: 'https://www.alphavantage.co/query',
    })
  })
})

describe('#MailerConfig', () => {
  test('Have defined mailer config enums', () => {
    expect(adapter.MailerConfig).toStrictEqual({
      Host: 'smtp-mail.test.com',
      Port: 587,
      Email: 'test@test.com',
      Password: '123',
      BatchSize: 20,
    })
  })
})

describe('#HostConfig', () => {
  test('Have defined host config enums', () => {
    expect(adapter.HostConfig).toStrictEqual({
      ClientHost: '127.0.0.1:3099',
      ClientType: 'http',
      ServerType: 'http',
      ServerPort: 3001,
      ServerHost: '127.0.0.1',
      AccessTokenSecret: '123',
      RefreshTokenSecret: '345',
      AccessExpiresIn: '15m',
    })
  })
})

describe('#PayPalConfig', () => {
  test('Have defined paypal enums', () => {
    expect(adapter.PaymentConfig).toStrictEqual({
      BaseUrl: 'https://paypal.com',
      ClientId: '123456',
      ClientSecret: 'ABCDEF',
    })
  })
})
