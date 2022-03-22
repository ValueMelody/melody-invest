export type IndicatorKey = 'realGDP'

export type CompareKey = 'gdpQuarterlyChangePercent' | 'gdpQuarterlyYoYChangePercent'

interface Common {
  id: number;
  quarter: string;
  reportMonth: string;
}

export interface Record extends Common {
  realGDP: number | null;
  gdpQuarterlyChangePercent: number | null;
  gdpQuarterlyYoYChangePercent: number | null;
}

export interface Raw extends Common {
  realGDP: string | null;
  gdpQuarterlyChangePercent: string | null;
  gdpQuarterlyYoYChangePercent: string | null;
}

export interface Create {
  quarter: string;
  reportMonth: string;
  realGDP?: string;
}

export interface Update {
  realGDP?: string;
  gdpQuarterlyChangePercent?: string | null;
  gdpQuarterlyYoYChangePercent?: string | null;
}
