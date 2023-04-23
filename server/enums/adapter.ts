import dotenv from 'dotenv'

dotenv.config()

export const DatabaseConfig = Object.freeze({
  Client: 'pg',
  Connection: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
  },
})

export const DatabaseTable = Object.freeze({
  User: 'user',
  UserPayment: 'user_payment',
  Email: 'email',
  Entity: 'entity',
  Ticker: 'ticker',
  TickerDaily: 'ticker_daily',
  TickerYearly: 'ticker_yearly',
  TickerQuarterly: 'ticker_quarterly',
  TickerHolder: 'ticker_holder',
  IndicatorYearly: 'indicator_yearly',
  IndicatorQuarterly: 'indicator_quarterly',
  IndicatorMonthly: 'indicator_monthly',
  Trader: 'trader',
  TraderEnv: 'trader_env',
  TraderEnvFollower: 'trader_env_follower',
  TraderHolding: 'trader_holding',
  TraderPattern: 'trader_pattern',
  TraderFollower: 'trader_follower',
  TraderCombo: 'trader_combo',
  TraderComboFollower: 'trader_combo_follower',
  DailyTickers: 'daily_tickers',
  Policy: 'policy',
})

export const CacheConfig = Object.freeze({
  Connection: {
    host: process.env.CACHE_HOST!,
    port: parseInt(process.env.CACHE_PORT!),
    password: process.env.CACHE_PASSWORD,
  },
  LocalConnection: {
    host: process.env.LOCAL_CACHE_HOST!,
    port: parseInt(process.env.LOCAL_CACHE_PORT!),
    password: process.env.LOCAL_CACHE_PASSWORD,
  },
})

export const CacheKey = Object.freeze({
  DailyTickers: 'dailyTickers',
  TickerPrices: 'tickerPrices',
  SysemEndpoint: 'systemEndpoint',
})

export const MarketConfig = Object.freeze({
  Key: process.env.MARKET_KEY!,
  CooldownSeconds: parseInt(process.env.MARKET_KEY_COOLDOWN!),
  BaseUrl: 'https://www.alphavantage.co/query',
})

export const MailerConfig = Object.freeze({
  Host: process.env.EMAIL_HOST!,
  Port: Number(process.env.EMAIL_PORT!),
  Email: process.env.EMAIL_SENDER!,
  Password: process.env.EMAIL_PASS!,
  BatchSize: Number(process.env.EMAIL_BATCH_SIZE!),
})

export const HostConfig = Object.freeze({
  ClientHost: process.env.CLIENT_HOST!,
  ClientType: process.env.CLIENT_TYPE!,
  ServerPort: Number(process.env.SERVER_PORT!),
  ServerHost: process.env.SERVER_HOST!,
  ServerType: process.env.SERVER_TYPE!,
  AccessTokenSecret: process.env.ACCESS_TOKEN_SECRET!,
  RefreshTokenSecret: process.env.REFRESH_TOKEN_SECRET!,
  DataKeySecret: process.env.DATA_KEY_SECRET!,
  AccessExpiresIn: '15m',
})

export const PaymentConfig = Object.freeze({
  BaseUrl: process.env.PAYPAL_BASE_URL!,
  ClientId: process.env.PAYPAL_CLIENT_ID!,
  ClientSecret: process.env.PAYPAL_CLIENT_SECRET!,
})
