import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as errorEnum from 'enums/error'
import * as tickerModel from 'models/ticker'
import * as tickerCategoryModel from 'models/tickerCategory'
import * as traderModel from 'models/trader'
import * as dailyTickersModel from 'models/dailyTickers'
import * as traderEnvModel from 'models/traderEnv'
import * as policyModel from 'models/policy'
import * as runTool from 'tools/run'
import * as cacheTool from 'tools/cache'
import * as cacheAdapter from 'adapters/cache'
import buildTopTraderProfiles from './shared/buildTopTraderProfiles'
import buildHoldingValueStats from './shared/buildHoldingValueStats'
import buildComboEntities from './shared/buildComboEntities'

const buildSystemPolicy = async (
  type: number,
): Promise<interfaces.policyModel.Record | null> => {
  const record = await policyModel.getLatest(type)
  return record
}

export const getSystemPolicy = async (
  type: number,
): Promise<interfaces.policyModel.Record | null> => {
  return cacheAdapter.returnBuild(
    cacheTool.generateSystemEndpointKey(`policy-${type}`),
    '1d',
    async () => await buildSystemPolicy(type),
  )
}

const generateSystemTopTraderCombo = async (
  traderEnvId: number,
  combo: interfaces.traderComboModel.Identity,
  total: number,
): Promise<interfaces.response.ComboProfile> => {
  const topTraders = await traderModel.getTopPerformancers(traderEnvId, total, 'yearlyPercentNumber')
  const { traderProfiles, holdings } = await buildComboEntities(topTraders)
  const latestDate = await dailyTickersModel.getLatestDate()
  const startDate = holdings.length ? holdings[holdings.length - 1].date : latestDate
  const stats = await buildHoldingValueStats(
    startDate,
    latestDate,
    constants.Trader.Initial.Cash * topTraders.length,
    holdings,
  )

  return {
    identity: {
      ...combo,
      traderIds: topTraders.map((trader) => trader.id),
    },
    detail: {
      profiles: traderProfiles,
      holdings: holdings.slice(0, 20),
      oneYearTrends: stats.oneYearTrends,
      oneDecadeTrends: stats.oneDecadeTrends,
      totalValue: stats.totalValue,
      yearlyPercentNumber: stats.yearlyPercentNumber,
      pastWeekPercentNumber: stats.pastWeekPercentNumber,
      pastMonthPercentNumber: stats.pastMonthPercentNumber,
      pastQuarterPercentNumber: stats.pastQuarterPercentNumber,
      pastYearPercentNumber: stats.pastYearPercentNumber,
    },
  }
}

const SystemCombos: interfaces.traderComboModel.Identity[] = [
  {
    id: -1,
    name: 'systemCombo.default5',
    isSystem: true,
    traderIds: [],
  },
  {
    id: -2,
    name: 'systemCombo.bigTech5',
    isSystem: true,
    traderIds: [],
  },
]

const buildDefaults = async (): Promise<
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

  const categories = await tickerCategoryModel.getAll()

  return {
    tickerIdentities,
    traderEnvs: systemTraderEnvs,
    tickerCategories: categories,
  }
}

export const getDefaults = async (): Promise<
  interfaces.response.SystemDefaults
> => {
  return cacheAdapter.returnBuild(
    cacheTool.generateSystemEndpointKey('defaults'),
    '1d',
    buildDefaults,
  )
}

const buildCurrentTopTraderProfiles = async (): Promise<
  interfaces.response.TopTraderProfiles
> => {
  const topTraders = await traderModel.getTops(5)
  const topTraderProfiles = await buildTopTraderProfiles(topTraders)
  return topTraderProfiles
}

export const getTopTraderProfiles = async (): Promise<
  interfaces.response.TopTraderProfiles
> => {
  return cacheAdapter.returnBuild(
    cacheTool.generateSystemEndpointKey('top-trader-profiles'),
    '1d',
    buildCurrentTopTraderProfiles,
  )
}

const buildDefaultTraderCombos = async (): Promise<
  interfaces.response.ComboProfile[]
> => {
  const comboProfiles = await runTool.asyncMap(SystemCombos, async (
    combo: interfaces.traderComboModel.Identity,
  ) => {
    switch (combo.name) {
      case 'systemCombo.default5': {
        const comboProfile = await generateSystemTopTraderCombo(1, combo, 5)
        return comboProfile
      }
      case 'systemCombo.bigTech5': {
        const comboProfile = await generateSystemTopTraderCombo(2, combo, 5)
        return comboProfile
      }
      default:
        throw errorEnum.Default.Forbidden
    }
  })

  return comboProfiles
}

export const getDefaultTraderCombos = async (): Promise<
  interfaces.response.ComboProfile[]
> => {
  return cacheAdapter.returnBuild(
    cacheTool.generateSystemEndpointKey('trader-combos'),
    '1d',
    buildDefaultTraderCombos,
  )
}
