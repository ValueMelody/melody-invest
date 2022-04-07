import * as traderEnvModel from '../models/traderEnv'
import * as traderComboModel from '../models/traderCombo'
import * as tickerModel from '../models/ticker'

export interface Defaults {
  traderEnvs: traderEnvModel.Record[];
  traderCombos: traderComboModel.Detail[];
  tickerIdentities: tickerModel.Identity[];
}
