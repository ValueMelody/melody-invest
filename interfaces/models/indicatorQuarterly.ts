export type IndicatorKey = 'seasonalGDP'

export type CompareKey = 'seasonalGDPQoQ' | 'seasonalGDPYoY'

interface Common {
  id: number;
  quarter: string;
}

export interface Record extends Common {
  seasonalGDP: number | null;
  seasonalGDPQoQ: number | null;
  seasonalGDPYoY: number | null;
}

export interface Raw extends Common {
  seasonalGDP: string | null;
  seasonalGDPQoQ: string | null;
  seasonalGDPYoY: string | null;
}

export interface Create {
  quarter: string;
  seasonalGDP?: string;
}

export interface Update {
  seasonalGDP?: string;
  seasonalGDPQoQ?: string | null;
  seasonalGDPYoY?: string | null;
}
