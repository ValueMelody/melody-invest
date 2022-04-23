import * as traderHoldingModel from './models/traderHolding'
import * as traderModel from './models/trader'
import * as traderEnvModel from './models/traderEnv'
import * as traderPatternModel from './models/traderPattern'
import * as traderComboModel from './models/traderCombo'
import * as tickerModel from './models/ticker'
import * as tickerCategoryModel from './models/tickerCategory'

export interface TraderProfile {
  trader: traderModel.Record,
  pattern: traderPatternModel.Public,
}

export interface ComboDetail {
  holdings: traderHoldingModel.Detail[];
  profiles: TraderProfile[];
  oneYearTrends: number[];
  oneDecadeTrends: number[];
  totalValue: number | null;
  yearlyPercentNumber: number | null;
  pastWeekPercentNumber: number | null;
  pastMonthPercentNumber: number | null;
  pastQuarterPercentNumber: number | null;
  pastYearPercentNumber: number | null;
}

export interface ComboProfile {
  identity: traderComboModel.Identity;
  detail: ComboDetail;
}

export interface TopTraderProfiles {
  yearly: TraderProfile[];
  pastYear: TraderProfile[];
  pastQuarter: TraderProfile[];
  pastMonth: TraderProfile[];
  pastWeek: TraderProfile[];
}

export interface SystemDefaults {
  comboProfiles: ComboProfile[];
  traderEnvs: traderEnvModel.Record[];
  tickerIdentities: tickerModel.Identity[];
  tickerCategories: tickerCategoryModel.Record[];
  topTraderProfiles: TopTraderProfiles;
}
