import * as constants from '@shared/constants'
import * as crudSystems from 'services/crudSystems'
import * as errorEnum from 'enums/error'
import { Request, Response, Router } from 'express'

export const getPolicy = async (req: Request, res: Response) => {
  const type = parseInt(req.params.type)
  if (
    type !== constants.Content.PolicyType.Privacy &&
    type !== constants.Content.PolicyType.TermsAndConditions
  ) {
    throw errorEnum.Default.NotFound
  }

  const policy = await crudSystems.getSystemPolicy(type)
  return res.status(200).send(policy)
}

export const getTopTraders = async (req: Request, res: Response) => {
  const tops = await crudSystems.getTopTraderProfiles()
  return res.status(200).send(tops)
}

export const getDefaultCombos = async (req: Request, res: Response) => {
  const tops = await crudSystems.getDefaultTraderCombos()
  return res.status(200).send(tops)
}

export const getDefaults = async (req: Request, res: Response) => {
  const defaults = await crudSystems.getDefaults()

  return res.status(200).send(defaults)
}

export const attachRoutes = (router: Router) => {
  router.get('/policy/:type', getPolicy)
  router.get('/top-trader-profiles', getTopTraders)
  router.get('/default-trader-combos', getDefaultCombos)
  router.get('/defaults', getDefaults)
}
