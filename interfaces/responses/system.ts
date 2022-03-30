import * as traderEnvModel from '../models/traderEnv'
import * as tickerModel from '../models/ticker'

export interface Defaults {
  traderEnvs: traderEnvModel.Record[];
  tickerIdentities: tickerModel.Identity[]
}
