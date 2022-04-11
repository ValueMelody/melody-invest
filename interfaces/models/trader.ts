interface Common {
  id: number;
  traderEnvId: number;
  traderPatternId: number;
  accessCode: string;
  isActive: boolean;
  rebalancedAt: string | null;
  estimatedAt: string | null;
  startedAt: string | null;
  totalDays: number | null;
  yearlyPercentNumber: number | null;
  grossPercentNumber: number | null;
  pastYearPercentNumber: number | null;
  pastQuarterPercentNumber: number | null;
  pastMonthPercentNumber: number | null;
  pastWeekPercentNumber: number | null;
}

export interface Record extends Common {
  totalValue: number | null;
}

export interface Raw extends Common {
  totalValue: string | null;
}

export interface Create {
  traderEnvId: number;
  traderPatternId: number;
  isActive: boolean;
  accessCode: string;
}

export interface Update {
  accessCode?: string;
  isActive?: boolean;
  rebalancedAt?: string | null;
  totalValue?: number | null;
  estimatedAt?: string | null;
  startedAt?: string | null;
  totalDays?: number | null;
  yearlyPercentNumber?: number | null;
  grossPercentNumber?: number | null;
  pastYearPercentNumber?: number | null;
  pastQuarterPercentNumber?: number | null;
  pastMonthPercentNumber?: number | null;
  pastWeekPercentNumber?: number | null;
}

export interface Tops {
  yearly: Record[],
  pastYear: Record[],
  pastQuarter: Record[],
  pastMonth: Record[],
  pastWeek: Record[],
}
