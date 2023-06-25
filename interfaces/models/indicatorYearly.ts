export type MovementKey =
  'inflationYearlyIncrease' | 'inflationYearlyDecrease' |
  'gdpYearlyIncrease' | 'gdpYearlyDecrease'

export type CompareKey = 'gdpYearlyChangePercent' | 'annualInflation'

interface Common {
  id: number;
  year: string;
  inflationYearlyIncrease: number | null;
  inflationYearlyDecrease: number | null;
  gdpYearlyIncrease: number | null;
  gdpYearlyDecrease: number | null;
}

export interface Record extends Common {
  gdp: number | null;
  annualInflation: number | null;
  gdpYearlyChangePercent: number | null;
}

export interface Raw extends Common {
  gdp: string | null;
  annualInflation: string | null;
  gdpYearlyChangePercent: string | null;
}

export interface Create {
  year: string;
  gdp?: string;
  annualInflation?: string;
}

export interface Update {
  gdp?: string;
  annualInflation?: string;
  gdpYearlyChangePercent?: string | null;
  inflationYearlyIncrease?: number | null;
  inflationYearlyDecrease?: number | null;
  gdpYearlyIncrease?: number | null;
  gdpYearlyDecrease?: number | null;
}
