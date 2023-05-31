import * as indicatorMonthly from './indicatorMonthly'
import * as indicatorQuarterly from './indicatorQuarterly'
import * as indicatorYearly from './indicatorYearly'

export type IndicatorMovementKey =
  indicatorMonthly.MovementKey |
  indicatorQuarterly.MovementKey |
  indicatorYearly.MovementKey

export type IndicatorCompareKey =
  indicatorMonthly.CompareKey |
  indicatorQuarterly.CompareKey |
  indicatorYearly.CompareKey

export type IndicatorKey = IndicatorMovementKey | IndicatorCompareKey

export type IndicatorInfo = {
  [key in IndicatorKey]?: number | null;
}

export interface Record {
  id: number;
  date: string;
  indicatorInfo: IndicatorInfo;
}

export interface Create {
  date: string;
  indicatorInfo: IndicatorInfo;
}

export interface Update {
  indicatorInfo: IndicatorInfo;
}
