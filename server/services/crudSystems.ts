import * as interfaces from '@shared/interfaces'
import * as errorEnum from '../enums/error'
import * as tickerModel from '../models/ticker'
import * as tickerCategoryModel from '../models/tickerCategory'
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

const SystemCombos: interfaces.traderComboModel.Identity[] = [
  {
    id: -1,
    name: 'systemCombo.default10',
    isSystem: true,
    traderEnvId: 1,
    traderIds: [],
  },
  {
    id: -2,
    name: 'systemCombo.bigTech10',
    isSystem: true,
    traderEnvId: 2,
    traderIds: [],
  },
]

const getSystemTraderCombos = async (): Promise<interfaces.systemRes.ComboDetail[]> => {
  const comboDetails = await runTool.asyncMap(SystemCombos, async (
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
        throw errorEnum.Default.Forbidden
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
    tickerCategoryId: ticker.tickerCategoryId,
  }))

  const combos = await getSystemTraderCombos()

  const categories = await tickerCategoryModel.getAll()

  return {
    tickerIdentities,
    traderEnvs: systemTraderEnvs,
    traderCombos: combos,
    tickerCategories: categories,
  }
}
