import * as tickerCategoryModel from './models/tickerCategory'
import * as tickerModel from './models/ticker'
import * as traderComboModel from './models/traderCombo'
import * as traderEnvModel from './models/traderEnv'
import * as traderHoldingModel from './models/traderHolding'
import * as traderModel from './models/trader'
import * as traderPatternModel from './models/traderPattern'

export interface TraderProfile {
  trader: traderModel.Record;
  pattern: traderPatternModel.Public;
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
  traderEnvs: traderEnvModel.Record[];
  tickerIdentities: tickerModel.Identity[];
  tickerCategories: tickerCategoryModel.Record[];
}

export interface UserOverall {
  traderProfiles: TraderProfile[];
  traderEnvs: traderEnvModel.Record[];
  traderCombos: traderComboModel.Identity[];
  email: string;
  type: number;
  planStartAtUTC: string | null;
  planEndAtUTC: string | null;
}

export interface AccessToken {
  accessToken: string;
  accessExpiresIn: string;
}

export interface UserToken extends AccessToken {
  refreshToken: string;
  refreshExpiresIn: string;
}

export interface ProfileEnv {
  traderEnvId: number;
  traderId: number;
  traderPatternId: number;
  accessCode: string;
}

export interface ProfileDetail {
  profileEnvs: ProfileEnv[];
  holdings: traderHoldingModel.Record[];
}

export interface EnvDetail {
  topProfiles: TopTraderProfiles;
}

export interface BehaviorDetail {
  topProfiles: TopTraderProfiles;
}

export interface TickerDetail {
  topProfiles: TopTraderProfiles;
}
