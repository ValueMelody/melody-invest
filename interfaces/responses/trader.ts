import * as traderModel from '../models/trader'
import * as traderPatternModel from '../models/traderPattern'
import * as traderHoldingModel from '../models/traderHolding'

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

export interface BehaviorDetail {
  topProfiles: TopProfiles;
}

export interface TickerDetail {
  topProfiles: TopProfiles;
}
