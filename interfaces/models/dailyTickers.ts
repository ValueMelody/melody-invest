import * as tickerDaily from './tickerDaily'
import * as tickerQuarterly from './tickerQuarterly'
import * as tickerYearly from './tickerYearly'

export type TickerMovementKey =
  tickerDaily.MovementKey |
  tickerQuarterly.MovementKey |
  tickerYearly.MovementKey

export type TickerCompareKey =
  tickerQuarterly.CompareKey |
  tickerYearly.CompareKey

export type TickerInfoKey = TickerMovementKey | TickerCompareKey

export type TickerInfo = {
  [key in TickerInfoKey]?: number | string | null;
}

export type TickerInfos = {
  [key: number]: TickerInfo;
}

export interface PriceInfo {
  [tickerId: number]: number;
}

export interface Record {
  id: number;
  entityId: number;
  date: string;
  tickerInfos: TickerInfos | null;
  priceInfo: PriceInfo;
}

export interface Create {
  date: string;
  entityId: number;
  tickerInfos: TickerInfos | null;
  priceInfo: PriceInfo;
}

export interface Update {
  tickerInfos: TickerInfos | null;
  priceInfo: PriceInfo;
}
