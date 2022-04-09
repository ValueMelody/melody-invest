import * as traderEnvModel from '../models/traderEnv'
import * as tickerModel from '../models/ticker'
import * as traderRes from './trader'

export interface Defaults {
  traderEnvs: traderEnvModel.Record[];
  traderCombos: traderRes.ComboDetail[];
  tickerIdentities: tickerModel.Identity[];
}
