import * as traderModel from '../models/trader'
import * as traderPatternModel from '../models/traderPattern'

export interface TraderWithPattern {
  trader: traderModel.Record;
  pattern: traderPatternModel.Public;
}

export interface TopPatterns {
  yearly: TraderWithPattern[];
  pastYear: TraderWithPattern[];
  pastQuarter: TraderWithPattern[];
  pastMonth: TraderWithPattern[];
  pastWeek: TraderWithPattern[];
}
