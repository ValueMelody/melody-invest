export interface Holding {
  tickerId: number;
  shares: number;
  splitMultiplier: number;
  value: number;
}

interface Common {
  id: string;
  traderId: number;
  date: string;
  holdings: Holding[];
}

export interface Record extends Common {
  totalValue: number;
  totalCash: number;
}

export interface Raw extends Common {
  totalValue: string;
  totalCash: string;
}

export interface Create {
  traderId: number;
  date: string;
  totalValue: number;
  totalCash: number;
  holdings: Holding[];
}
