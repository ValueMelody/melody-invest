import * as cacheAdapter from 'adapters/cache'
import * as cacheTool from 'tools/cache'
import * as interfaces from '@shared/interfaces'
import * as policyModel from 'models/policy'
import * as tickerModel from 'models/ticker'
import * as traderEnvModel from 'models/traderEnv'
import * as traderModel from 'models/trader'
import buildTopTraderProfiles from './shared/buildTopTraderProfiles'

const buildSystemPolicy = async (
  type: number,
): Promise<interfaces.policyModel.Record | null> => {
  const record = await policyModel.getLatest(type)
  return record
}

export const getSystemPolicy = async (
  type: number,
  forceRecheck: boolean = false,
): Promise<interfaces.policyModel.Record | null> => {
  return cacheAdapter.returnBuild({
    cacheAge: '1d',
    cacheKey: cacheTool.generateSystemEndpointKey(`policy-${type}`),
    buildFunction: async () => await buildSystemPolicy(type),
    forceRecheck,
  })
}

const buildDefaults = async (): Promise<
  interfaces.response.SystemDefaults
> => {
  const systemTraderEnvs = await traderEnvModel.getSystemDefined()

  const tickers = await tickerModel.getAll()

  return {
    tickers,
    traderEnvs: systemTraderEnvs,
  }
}

export const getDefaults = async (
  forceRecheck: boolean = false,
): Promise<interfaces.response.SystemDefaults> => {
  return cacheAdapter.returnBuild({
    cacheAge: '1d',
    cacheKey: cacheTool.generateSystemEndpointKey('defaults'),
    buildFunction: buildDefaults,
    forceRecheck,
  })
}

const buildCurrentTopTraderProfiles = async (): Promise<
  interfaces.response.TopTraderProfiles
> => {
  const topTraders = await traderModel.getTops(5)
  const topTraderProfiles = await buildTopTraderProfiles(topTraders)
  return topTraderProfiles
}

export const getTopTraderProfiles = async (
  forceRecheck: boolean = false,
): Promise<interfaces.response.TopTraderProfiles> => {
  return cacheAdapter.returnBuild({
    cacheAge: '1d',
    cacheKey: cacheTool.generateSystemEndpointKey('top-trader-profiles'),
    buildFunction: buildCurrentTopTraderProfiles,
    forceRecheck,
  })
}
