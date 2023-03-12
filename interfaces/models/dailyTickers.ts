import * as indicatorMonthly from './indicatorMonthly'
import * as indicatorQuarterly from './indicatorQuarterly'
import * as indicatorYearly from './indicatorYearly'
import * as tickerDaily from './tickerDaily'
import * as tickerQuarterly from './tickerQuarterly'
import * as tickerYearly from './tickerYearly'

export type TickerMovementKey =
  tickerDaily.MovementKey |
  tickerQuarterly.MovementKey |
  tickerYearly.MovementKey

export type GeneralMovementKey = indicatorMonthly.MovementKey |indicatorYearly.MovementKey

export type MovementKey = TickerMovementKey | GeneralMovementKey

export type GeneralCompareKey = indicatorQuarterly.CompareKey | indicatorYearly.CompareKey

export type CompareKey = GeneralCompareKey

export type GeneralKey = GeneralMovementKey | GeneralCompareKey

export type TickerInfo = {
  [key in TickerMovementKey]: number | null;
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

export type IndicatorInfo = {
  [key in GeneralKey]: number | null;
}

export interface Record {
  id: number;
  date: string;
  tickers: DailyTickers | null;
  indicators: IndicatorInfo | null;
  nearestPrices: tickerDaily.TickerPrices;
}

export interface Create {
  date: string;
  tickers: DailyTickers | null;
  indicators: IndicatorInfo | null;
  nearestPrices: tickerDaily.TickerPrices;
}

export interface Update {
  tickers: DailyTickers | null;
  indicators: IndicatorInfo | null;
  nearestPrices: tickerDaily.TickerPrices;
}
