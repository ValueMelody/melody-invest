import * as cacheAdapter from 'adapters/cache'
import * as cacheTool from 'tools/cache'
import * as interfaces from '@shared/interfaces'
import * as policyModel from 'models/policy'

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
