import * as cacheAdapter from 'adapters/cache'
import * as cacheTool from 'tools/cache'
import * as interfaces from '@shared/interfaces'
import * as policyModel from 'models/policy'
import * as tickerModel from 'models/ticker'

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
  const tickers = await tickerModel.getAll()

  return {
    tickers,
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
