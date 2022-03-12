import * as traderModel from '../models/trader'
import * as traderPatternModel from '../models/traderPattern'

export interface TraderProfile {
  trader: traderModel.Record,
  pattern: traderPatternModel.Public,
}

export interface TopProfiles {
  yearly: TraderProfile[];
  pastYear: TraderProfile[];
  pastQuarter: TraderProfile[];
  pastMonth: TraderProfile[];
  pastWeek: TraderProfile[];
}
