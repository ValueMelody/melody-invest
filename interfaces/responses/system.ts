import * as traderEnvModel from '../models/traderEnv'
import * as tickerModel from '../models/ticker'
import * as tickerCategoryModel from '../models/tickerCategory'
import * as traderComboModel from '../models/traderCombo'
import * as traderHoldingModel from '../models/traderHolding'
import * as traderRes from './trader'

export interface ComboDetail {
  identity: traderComboModel.Identity;
  holdings: traderHoldingModel.Detail[];
  profiles: traderRes.TraderProfile[];
  oneYearTrends: number[];
  totalValue: number | null;
}

export interface Defaults {
  traderEnvs: traderEnvModel.Record[];
  traderCombos: ComboDetail[];
  tickerIdentities: tickerModel.Identity[];
  tickerCategories: tickerCategoryModel.Record[];
}
