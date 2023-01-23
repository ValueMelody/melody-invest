import * as constants from '@shared/constants'
import * as crudSystems from 'services/crudSystems'
import * as errorEnum from 'enums/error'
import * as verifyTool from 'tools/verify'
import { Router } from 'express'

const attachRoutes = (router: Router) => {
  router.get('/policy/:type', async (req, res) => {
    const type = parseInt(req.params.type)
    if (!verifyTool.isGreaterThanZero(type)) throw errorEnum.Default.Forbidden
    if (
      type !== constants.Content.PolicyType.Privacy &&
      type !== constants.Content.PolicyType.TermsAndConditions
    ) {
      throw errorEnum.Default.NotFound
    }

    const policy = await crudSystems.getSystemPolicy(type)
    return res.status(200).send(policy)
  })

  router.get('/top-trader-profiles', async (req, res) => {
    const tops = await crudSystems.getTopTraderProfiles()
    return res.status(200).send(tops)
  })

  router.get('/default-trader-combos', async (req, res) => {
    const tops = await crudSystems.getDefaultTraderCombos()
    return res.status(200).send(tops)
  })

  router.get('/defaults', async (req, res) => {
    const defaults = await crudSystems.getDefaults()
    return res.status(200).send(defaults)
  })
}

export default attachRoutes
