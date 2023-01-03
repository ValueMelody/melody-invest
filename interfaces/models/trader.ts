interface Common {
  id: number;
  traderEnvId: number;
  traderPatternId: number;
  fatherId: number | null;
  motherId: number | null;
  hasMutation: boolean;
  accessCode: string;
  isActive: boolean;
  hasFollower: boolean;
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
  rankingNumber: number | null;
}

export interface Record extends Common {
  totalValue: number | null;
  oneYearTrends: number[] | null;
  oneDecadeTrends: number[] | null;
}

export interface Raw extends Common {
  totalValue: string | null;
  oneYearTrends: string | null;
  oneDecadeTrends: string | null;
}

export interface Create {
  traderEnvId: number;
  traderPatternId: number;
  isActive: boolean;
  hasFollower: boolean;
  accessCode: string;
  fatherId: number | null;
  motherId: number | null;
  hasMutation: boolean;
}

export interface Update {
  accessCode?: string;
  isActive?: boolean;
  hasFollower?: boolean;
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
  rankingNumber?: number | null;
  oneYearTrends?: string | null;
  oneDecadeTrends?: string | null;
}

export interface Tops {
  yearly: Record[];
  pastYear: Record[];
  pastQuarter: Record[];
  pastMonth: Record[];
  pastWeek: Record[];
}
