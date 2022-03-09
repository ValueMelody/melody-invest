import * as traderModel from '../models/trader'
import * as traderPatternModel from '../models/traderPattern'

interface TraderWithPattern {
  trader: traderModel.Record;
  pattern: traderPatternModel.Record;
}

export interface Top {
  yearly: TraderWithPattern[];
  pastYear: TraderWithPattern[];
  pastQuarter: TraderWithPattern[];
  pastMonth: TraderWithPattern[];
  pastWeek: TraderWithPattern[];
}
