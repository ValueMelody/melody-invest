export interface Record {
  id: number;
  entityId: number;
  symbol: string;
  region: string;
  isDelisted: boolean;
  firstPriceDate: string | null;
  lastPriceDate: string | null;
  firstFinancialYear: string | null;
  lastFinancialYear: string | null;
  firstFinancialQuarter: string | null;
  lastFinancialQuarter: string | null;
}

export interface Create {
  entityId: number;
  symbol: string;
  region: string;
  isDelisted: boolean;
}

export interface Update {
  firstPriceDate?: string;
  lastPriceDate?: string;
  firstFinancialYear?: string | null;
  lastFinancialYear?: string | null;
  firstFinancialQuarter?: string | null;
  lastFinancialQuarter?: string | null;
}
