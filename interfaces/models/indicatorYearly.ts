export type IndicatorKey = 'inflation' | 'realGDP'

export type MovementKey = 'inflationYearlyIncrease' | 'inflationYearlyDecrease'

export type CompareKey = 'gdpYearlyChangePercent'

interface Common {
  id: number;
  year: string;
  inflationYearlyIncrease: number | null;
  inflationYearlyDecrease: number | null;
}

export interface Record extends Common {
  realGDP: number | null;
  inflation: number | null;
  gdpYearlyChangePercent: number | null;
}

export interface Raw extends Common {
  realGDP: string | null;
  inflation: string | null;
  gdpYearlyChangePercent: string | null;
}

export interface Create {
  year: string;
  realGDP?: string;
  inflation?: string;
}

export interface Update {
  realGDP?: string;
  inflation?: string;
  gdpYearlyChangePercent?: string | null;
  inflationYearlyIncrease?: number | null;
  inflationYearlyDecrease?: number | null;
}
