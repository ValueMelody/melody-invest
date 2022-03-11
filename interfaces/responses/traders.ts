import * as traderModel from '../models/trader'
import * as traderPatternModel from '../models/traderPattern'

export interface TraderSummary {
  trader: traderModel.Record,
  pattern: traderPatternModel.Public,
}

export interface Top {
  yearly: TraderSummary[];
  pastYear: TraderSummary[];
  pastQuarter: TraderSummary[];
  pastMonth: TraderSummary[];
  pastWeek: TraderSummary[];
}
