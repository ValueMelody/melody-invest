import { Router } from 'express'
import * as interfaces from '@shared/interfaces'
import * as crudTraderProfiles from '../services/crudTraderProfiles'
import * as errorEnum from '../enums/error'
import * as authMiddleware from '../middlewares/auth'

const traderProfilesRouter = Router()
export default traderProfilesRouter

traderProfilesRouter.get('/tops', async (req, res) => {
  const patterns = await crudTraderProfiles.getTopPatterns()
  return res.status(200).send(patterns)
})

const validGetProfileParam = (id: number, accessCode: string) => {
  const hasValidParam = id && accessCode && accessCode.length === 16
  if (!hasValidParam) throw errorEnum.CUSTOM.ACCESS_CODE_MISMATCH
}

traderProfilesRouter.get('/:id/:access_code', async (req, res) => {
  const id = parseInt(req.params.id)
  const accessCode = req.params.access_code
  validGetProfileParam(id, accessCode)

  const trader = await crudTraderProfiles.getTraderStat(id, accessCode)
  return res.status(200).send(trader)
})

traderProfilesRouter.get('/:id/:access_code/detail', async (req, res) => {
  const id = parseInt(req.params.id)
  const accessCode = req.params.access_code
  validGetProfileParam(id, accessCode)

  const details = await crudTraderProfiles.getProfileDetail(id, accessCode)
  return res.status(200).send(details)
})

traderProfilesRouter.post('/', authMiddleware.normalUser, async (req, res) => {
  const traderEnvId = req.body.traderEnvId
  const traderPattern = req.body.traderPattern
  const auth: interfaces.common.Auth = req.body.auth

  const trader = await crudTraderProfiles.createTrader(auth.id, traderEnvId, traderPattern)
  return res.status(201).send(trader)
})
