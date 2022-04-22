import * as interfaces from '@shared/interfaces'
import * as errorEnum from '../enums/error'
import * as tickerModel from '../models/ticker'
import * as tickerCategoryModel from '../models/tickerCategory'
import * as traderModel from '../models/trader'
import * as traderEnvModel from '../models/traderEnv'
import * as runTool from '../tools/run'
import buildTopTraderProfiles from './shared/buildTopTraderProfiles'
import buildComboDetail from './shared/buildComboDetail'

const getSystemTopTraderCombo = async (
  combo: interfaces.traderComboModel.Identity,
  total: number,
): Promise<interfaces.response.ComboProfile> => {
  const topTraders = await traderModel.getTopPerformancers(combo.traderEnvId, total, 'yearlyPercentNumber')
  const comboDetail = await buildComboDetail(topTraders)

  return {
    identity: {
      ...combo,
      traderIds: comboDetail.traderIds,
    },
    detail: comboDetail.detail,
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

const getSystemTraderCombos = async (): Promise<
  interfaces.response.ComboProfile[]
> => {
  const comboProfiles = await runTool.asyncMap(SystemCombos, async (
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

  return comboProfiles
}

export const getDefaults = async (): Promise<
  interfaces.response.SystemDefaults
> => {
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

  const topTraders = await traderModel.getTops(5)
  const topTraderProfiles = await buildTopTraderProfiles(topTraders)

  return {
    tickerIdentities,
    traderEnvs: systemTraderEnvs,
    comboProfiles: combos,
    tickerCategories: categories,
    topTraderProfiles,
  }
}
