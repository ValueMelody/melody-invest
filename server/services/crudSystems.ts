import * as interfaces from '@shared/interfaces'
import * as tickerModel from '../models/ticker'
import * as traderEnvModel from '../models/traderEnv'

export const getDefaults = async (): Promise<interfaces.systemRes.Defaults> => {
  const systemTraderEnvs = await traderEnvModel.getSystemDefined()

  const tickers = await tickerModel.getAll()
  const tickerIdentities: interfaces.tickerModel.Identity[] = tickers.map((ticker) => ({
    id: ticker.id,
    name: ticker.name,
    region: ticker.region,
    symbol: ticker.symbol,
  }))

  return {
    tickerIdentities,
    traderEnvs: systemTraderEnvs,
  }
}
