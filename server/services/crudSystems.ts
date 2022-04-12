import * as interfaces from '@shared/interfaces'
import * as commonEnum from '../enums/common'
import * as errorEnum from '../enums/error'
import * as tickerModel from '../models/ticker'
import * as traderModel from '../models/trader'
import * as traderEnvModel from '../models/traderEnv'
import * as runTool from '../tools/run'
import buildComboDetail from './shared/buildComboDetail'

const getSystemTopTraderCombo = async (
  combo: interfaces.traderComboModel.Identity,
  total: number,
): Promise<interfaces.systemRes.ComboDetail> => {
  const topTraders = await traderModel.getTopPerformancers(combo.traderEnvId, total, 'yearlyPercentNumber')
  const comboDetail = await buildComboDetail(topTraders)

  return {
    identity: {
      ...combo,
      traderIds: comboDetail.traderIds,
    },
    profiles: comboDetail.profiles,
    holdings: comboDetail.holdings.slice(0, 20),
  }
}

const getSystemTraderCombos = async (): Promise<interfaces.systemRes.ComboDetail[]> => {
  const combos = commonEnum.SYSTEM_COMBOS
  const comboDetails = await runTool.asyncMap(combos, async (
    combo: interfaces.traderComboModel.Identity,
  ) => {
    switch (combo.name) {
      case 'systemCombo.default10': {
        const comboProfile = await getSystemTopTraderCombo(combo, 10)
        return comboProfile
      }
      case 'systemCombo.bigTech10': {
        const comboProfile = await getSystemTopTraderCombo(combo, 10)
        return comboProfile
      }
      default:
        throw errorEnum.DEFAULT.FORBIDDEN
    }
  })

  return comboDetails
}

export const getDefaults = async (): Promise<interfaces.systemRes.Defaults> => {
  const systemTraderEnvs = await traderEnvModel.getSystemDefined()

  const tickers = await tickerModel.getAll()
  const tickerIdentities: interfaces.tickerModel.Identity[] = tickers.map((ticker) => ({
    id: ticker.id,
    name: ticker.name,
    region: ticker.region,
    symbol: ticker.symbol,
  }))

  const combos = await getSystemTraderCombos()

  return {
    tickerIdentities,
    traderEnvs: systemTraderEnvs,
    traderCombos: combos,
  }
}
