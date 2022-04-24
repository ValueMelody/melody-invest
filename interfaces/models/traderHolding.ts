export interface Item {
  tickerId: number;
  shares: number;
  splitMultiplier: number;
  value: number;
}

export interface Detail {
  date: string;
  totalValue: number;
  totalCash: number;
  items: Item[];
}

export interface Record extends Detail {
  id: string;
  traderId: number;
}

export interface Raw {
  id: string;
  traderId: number;
  date: string;
  items: Item[];
  totalValue: string;
  totalCash: string;
}

export interface Create extends Detail {
  traderId: number;
}
