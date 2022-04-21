import dotenv from 'dotenv'

dotenv.config()

export const DatabaseConfig = Object.freeze({
  Client: 'pg',
  Connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
})

export enum DatabaseTable {
  User = 'user',
  Ticker = 'ticker',
  TickerDaily = 'ticker_daily',
  TickerYearly = 'ticker_yearly',
  TickerQuarterly = 'ticker_quarterly',
  TickerHolder = 'ticker_holder',
  TickerCategory = 'ticker_category',
  IndicatorYearly = 'indicator_yearly',
  IndicatorQuarterly = 'indicator_quarterly',
  IndicatorMonthly = 'indicator_monthly',
  Trader = 'trader',
  TraderEnv = 'trader_env',
  TraderEnvFollower = 'trader_env_follower',
  TraderHolding = 'trader_holding',
  TraderPattern = 'trader_pattern',
  TraderFollower = 'trader_follower',
  TraderCombo = 'trader_combo',
  TraderComboFollower = 'trader_combo_follower',
  DailyTickers = 'daily_tickers',
}

export const CacheKey = {
  TickerPrices: 'tickerPrices',
}
