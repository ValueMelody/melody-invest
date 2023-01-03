export type MovementKey =
  'priceDailyIncrease' | 'priceDailyDecrease' |
  'priceWeeklyIncrease' | 'priceWeeklyDecrease' |
  'priceMonthlyIncrease' | 'priceMonthlyDecrease' |
  'priceQuarterlyIncrease' | 'priceQuarterlyDecrease' |
  'priceYearlyIncrease' | 'priceYearlyDecrease'

interface Common {
  id: number;
  tickerId: number;
  date: string;
  volume: string;
  closePrice: number;
  weeklyAverageFinalPrice: number | null;
  monthlyAverageFinalPrice: number | null;
  quarterlyAverageFinalPrice: number | null;
  yearlyAverageFinalPrice: number | null;
  priceDailyIncrease: number | null;
  priceDailyDecrease: number | null;
  priceWeeklyIncrease: number | null;
  priceWeeklyDecrease: number | null;
  priceMonthlyIncrease: number | null;
  priceMonthlyDecrease: number | null;
  priceQuarterlyIncrease: number | null;
  priceQuarterlyDecrease: number | null;
  priceYearlyIncrease: number | null;
  priceYearlyDecrease: number | null;
}

export interface Record extends Common {
  splitMultiplier: number;
  dividendAmount: number;
}

export interface Raw extends Common {
  splitMultiplier: string;
  dividendAmount: string;
}

export interface Create {
  tickerId: number;
  date: string;
  volume: string;
  closePrice: number;
  splitMultiplier: string;
  dividendAmount: string;
}

export interface Update {
  weeklyAverageFinalPrice?: number | null;
  monthlyAverageFinalPrice?: number | null;
  quarterlyAverageFinalPrice?: number | null;
  yearlyAverageFinalPrice?: number | null;
  priceDailyIncrease?: number | null;
  priceDailyDecrease?: number | null;
  priceWeeklyIncrease?: number | null;
  priceWeeklyDecrease?: number | null;
  priceMonthlyIncrease?: number | null;
  priceMonthlyDecrease?: number | null;
  priceQuarterlyIncrease?: number | null;
  priceQuarterlyDecrease?: number | null;
  priceYearlyIncrease?: number | null;
  priceYearlyDecrease?: number | null;
}

export interface TickerPrices {
  [tickerId: number]: number;
}
