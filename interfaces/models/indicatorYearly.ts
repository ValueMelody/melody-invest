export type IndicatorKey = 'inflation' | 'gdp'

export type MovementKey = 'inflationYearlyIncrease' | 'inflationYearlyDecrease'

export type CompareKey = 'gdpYearlyChangePercent'

interface Common {
  id: number;
  year: string;
  inflationYearlyIncrease: number | null;
  inflationYearlyDecrease: number | null;
}

export interface Record extends Common {
  gdp: number | null;
  inflation: number | null;
  gdpYearlyChangePercent: number | null;
}

export interface Raw extends Common {
  gdp: string | null;
  inflation: string | null;
  gdpYearlyChangePercent: string | null;
}

export interface Create {
  year: string;
  gdp?: string;
  inflation?: string;
}

export interface Update {
  gdp?: string;
  inflation?: string;
  gdpYearlyChangePercent?: string | null;
  inflationYearlyIncrease?: number | null;
  inflationYearlyDecrease?: number | null;
}
