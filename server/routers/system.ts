import { Router } from 'express'
import * as cacheAdapter from 'adapters/cache'
import * as cacheTool from 'tools/cache'
import * as crudSystems from 'services/crudSystems'
import * as errorEnum from 'enums/error'

const systemRouter = Router()
export default systemRouter

// ------------------------------------------------------------ Validate --

const validateGetPolicyParams = (type: number) => {
  if (!type) throw errorEnum.Default.Forbidden
}

// ------------------------------------------------------------ Get --

systemRouter.get('/policy/:type', async (req, res) => {
  const type = parseInt(req.params.type)
  validateGetPolicyParams(type)

  const policy = await cacheAdapter.returnBuild(
    cacheTool.generateSystemEndpointKey(`policy-${type}`),
    '1d',
    async () => await crudSystems.getSystemPolicy(type),
  )
  return res.status(200).send(policy)
})

systemRouter.get('/top-trader-profiles', async (req, res) => {
  const tops = await cacheAdapter.returnBuild(
    cacheTool.generateSystemEndpointKey('top-trader-profiles'),
    '1d',
    crudSystems.getTopTraderProfiles,
  )
  return res.status(200).send(tops)
})

systemRouter.get('/top-trader-combos', async (req, res) => {
  const tops = await cacheAdapter.returnBuild(
    cacheTool.generateSystemEndpointKey('top-trader-combos'),
    '1d',
    crudSystems.getTopTraderCombos,
  )
  return res.status(200).send(tops)
})

systemRouter.get('/defaults', async (req, res) => {
  const defaults = await cacheAdapter.returnBuild(
    cacheTool.generateSystemEndpointKey('defaults'),
    '1d',
    crudSystems.getDefaults,
  )
  return res.status(200).send(defaults)
})
