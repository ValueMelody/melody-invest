import * as traderModel from '../models/trader'
import * as traderPatternModel from '../models/traderPattern'

export interface TraderSummary {
  trader: traderModel.Record,
  pattern: traderPatternModel.Public,
}
