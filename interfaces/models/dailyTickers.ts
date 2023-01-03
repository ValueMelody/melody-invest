import * as indicatorMonthly from './indicatorMonthly'
import * as indicatorQuarterly from './indicatorQuarterly'
import * as indicatorYearly from './indicatorYearly'
import * as tickerDaily from './tickerDaily'
import * as tickerQuarterly from './tickerQuarterly'
import * as tickerYearly from './tickerYearly'

export type MovementKey =
  tickerDaily.MovementKey |
  tickerQuarterly.MovementKey |
  tickerYearly.MovementKey |
  indicatorMonthly.MovementKey |
  indicatorYearly.MovementKey

export type CompareKey = indicatorQuarterly.CompareKey | indicatorYearly.CompareKey

export type TickerInfo = {
  [key in MovementKey | CompareKey]: number | null;
}

export interface DailyTicker {
  daily: tickerDaily.Record;
  quarterly: tickerQuarterly.Record | null;
  yearly: tickerYearly.Record | null;
  info: TickerInfo;
}

export interface DailyTickers {
  [tickerId: number]: DailyTicker;
}

export interface Record {
  id: number;
  date: string;
  tickers: DailyTickers | null;
  nearestPrices: tickerDaily.TickerPrices;
}

export interface Create {
  date: string;
  tickers: DailyTickers | null;
  nearestPrices: tickerDaily.TickerPrices;
}

export interface Update {
  tickers: DailyTickers | null;
  nearestPrices: tickerDaily.TickerPrices;
}
