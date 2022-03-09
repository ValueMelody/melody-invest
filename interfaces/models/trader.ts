export interface Record {
  id: number;
  traderEnvId: number;
  traderPatternId: number;
  isActive: boolean;
  rebalancedAt: string;
  totalValue: number | null;
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

export interface Raw {
  id: number;
  traderEnvId: number;
  traderPatternId: number;
  isActive: boolean;
  rebalancedAt: string;
  totalValue: string | null;
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

export interface Create {
  traderEnvId: number;
  traderPatternId: number;
  isActive: boolean;
}

export interface Update {
  isActive?: boolean;
  rebalancedAt?: string;
  totalValue?: number;
  estimatedAt?: string;
  startedAt?: string ;
  totalDays?: number;
  yearlyPercentNumber?: number;
  grossPercentNumber?: number;
  pastYearPercentNumber?: number;
  pastQuarterPercentNumber?: number;
  pastMonthPercentNumber?: number;
  pastWeekPercentNumber?: number;
}
