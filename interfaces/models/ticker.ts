export interface Record {
  id: number;
  symbol: string;
  region: string;
  name: string;
  isDelisted: boolean;
  tickerCategoryId: number | null;
  firstPriceDate: string | null;
  lastPriceDate: string | null;
  firstEPSYear: string | null;
  lastEPSYear: string | null;
  firstEPSQuarter: string | null;
  lastEPSQuarter: string | null;
  firstIncomeYear: string | null;
  lastIncomeYear: string | null;
  firstIncomeQuarter: string | null;
  lastIncomeQuarter: string | null;
}

export interface Create {
  symbol: string;
  region: string;
  name: string;
  isDelisted: boolean;
  tickerCategoryId: number | null;
}

export interface Update {
  firstPriceDate?: string;
  lastPriceDate?: string;
  firstEPSYear?: string;
  lastEPSYear?: string;
  firstEPSQuarter?: string;
  lastEPSQuarter?: string;
  firstIncomeYear?: string;
  lastIncomeYear?: string;
  firstIncomeQuarter?: string;
  lastIncomeQuarter?: string;
}
