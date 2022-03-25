import * as interfaces from '@shared/interfaces'
import * as traderEnvModel from '../models/traderEnv'

export const getDefaults = async (): Promise<interfaces.systemRes.Defaults> => {
  const systemTraderEnvs = await traderEnvModel.getSystemDefined()

  return {
    traderEnvs: systemTraderEnvs,
  }
}
