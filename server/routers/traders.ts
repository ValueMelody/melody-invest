import { Router } from 'express'
import * as interfaces from '@shared/interfaces'
import * as crudTraders from '../services/crudTraders'
import * as errorEnum from '../enums/error'
import * as authMiddleware from '../middlewares/auth'

const tradersRouter = Router()
export default tradersRouter

const validGetProfileParams = (id: number, accessCode: string) => {
  const hasValidParam = id && accessCode && accessCode.length === 16
  if (!hasValidParam) throw errorEnum.CUSTOM.ACCESS_CODE_MISMATCH
}

const validGetEnvParams = (id: number) => {
  if (!id) throw errorEnum.CUSTOM.PARAMS_MISSING
}

const validCreateProfileParams = (traderId: number, traderPattern: interfaces.traderPatternModel.Create) => {
  if (!traderId || !traderPattern) throw errorEnum.CUSTOM.PARAMS_MISSING
}

const validCreateEnvParams = (name: string, startDate: string, tickerIds: number[] | null) => {
  if (!name || startDate?.length !== 10) throw errorEnum.CUSTOM.PARAMS_MISSING
  const hasWrongId = tickerIds && tickerIds.some((id) => typeof id !== 'number')
  if (hasWrongId) throw errorEnum.DEFAULT.FORBIDDEN
}

tradersRouter.get('/profiles/tops', async (req, res) => {
  const patterns = await crudTraders.getTopProfiles()
  return res.status(200).send(patterns)
})

tradersRouter.get('/profiles/:id/:access_code', async (req, res) => {
  const id = parseInt(req.params.id)
  const accessCode = req.params.access_code
  validGetProfileParams(id, accessCode)

  const trader = await crudTraders.getTraderProfile(id, accessCode)
  return res.status(200).send(trader)
})

tradersRouter.get('/profiles/:id/:access_code/detail', async (req, res) => {
  const id = parseInt(req.params.id)
  const accessCode = req.params.access_code
  validGetProfileParams(id, accessCode)

  const details = await crudTraders.getProfileDetail(id, accessCode)
  return res.status(200).send(details)
})

tradersRouter.post('/profiles', authMiddleware.normalUser, async (req, res) => {
  const traderEnvId = req.body.traderEnvId
  const traderPattern = req.body.traderPattern
  validCreateProfileParams(traderEnvId, traderPattern)

  const auth: interfaces.reqs.Auth = req.body.auth

  const trader = await crudTraders.createTraderProfile(auth.id, traderEnvId, traderPattern)
  return res.status(201).send(trader)
})

tradersRouter.get('/envs/:id', authMiddleware.normalUser, async (req, res) => {
  const envId = parseInt(req.params.id)

  validGetEnvParams(envId)

  const auth: interfaces.reqs.Auth = req.body.auth

  const env = await crudTraders.getTraderEnv(auth.id, envId)
  return res.status(200).send(env)
})

tradersRouter.post('/envs', authMiddleware.normalUser, async (req, res) => {
  const { name, startDate, tickerIds }: interfaces.reqs.TraderEnvCreation = req.body
  const parsedName = name?.trim()
  validCreateEnvParams(parsedName, startDate, tickerIds)

  const auth: interfaces.reqs.Auth = req.body.auth

  const traderEnv = await crudTraders.createTraderEnv(
    auth.id, parsedName, startDate, tickerIds,
  )
  return res.status(201).send(traderEnv)
})
