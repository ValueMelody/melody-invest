export type MovementKey = 'seasonalGDPQuarterlyIncrease' | 'seasonalGDPQuarterlyDecrease'
export type CompareKey = 'seasonalGDPQoQ' | 'seasonalGDPYoY'

interface Common {
  id: number;
  quarter: string;
  seasonalGDPQuarterlyIncrease: number | null;
  seasonalGDPQuarterlyDecrease: number | null;
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
  seasonalGDPQuarterlyIncrease?: number | null;
  seasonalGDPQuarterlyDecrease?: number | null;
}
