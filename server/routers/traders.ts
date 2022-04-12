import { Router } from 'express'
import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as crudTraders from '../services/crudTraders'
import * as errorEnum from '../enums/error'
import * as authMiddleware from '../middlewares/auth'

const tradersRouter = Router()
export default tradersRouter

// ------------------------------------------------------------ Validdate --

const validateGetProfileParams = (id: number, accessCode: string) => {
  const hasValidParam = id && accessCode && accessCode.length === 16
  if (!hasValidParam) throw errorEnum.CUSTOM.ACCESS_CODE_MISMATCH
}

const validateGetEnvParams = (id: number) => {
  if (!id) throw errorEnum.CUSTOM.PARAMS_MISSING
}

const validateGetComboParams = (id: number) => {
  if (!id) throw errorEnum.CUSTOM.PARAMS_MISSING
}

const validateCreateProfileParams = (traderId: number, traderPattern: interfaces.traderPatternModel.Create) => {
  if (!traderId || !traderPattern) throw errorEnum.CUSTOM.PARAMS_MISSING
}

const validateCreateEnvParams = (name: string, startDate: string, tickerIds: number[] | null) => {
  if (!name || startDate?.length !== 10) throw errorEnum.CUSTOM.PARAMS_MISSING
  const hasWrongId = tickerIds && tickerIds.some((id) => typeof id !== 'number')
  if (hasWrongId) throw errorEnum.DEFAULT.FORBIDDEN
}

const validateCreateComboParams = (name: string, traderEnvId: number, traderIds: number[]) => {
  if (!name || !traderEnvId || !Array.isArray(traderIds) || traderIds.length < 2) throw errorEnum.CUSTOM.PARAMS_MISSING
  const hasWrongId = traderIds.some((id) => typeof id !== 'number')
  if (hasWrongId) throw errorEnum.DEFAULT.FORBIDDEN
}

const validateTraderId = (traderId: number) => {
  if (!traderId) throw errorEnum.DEFAULT.FORBIDDEN
}

const validateEnvId = (envId: number) => {
  if (!envId) throw errorEnum.DEFAULT.FORBIDDEN
}

const validateTickerId = (tickerId: number) => {
  if (!tickerId) throw errorEnum.DEFAULT.FORBIDDEN
}

const validateBehavior = (behavior: string): interfaces.traderPatternModel.Behavior => {
  const matched = constants.behavior.behaviors.find((name) => name === behavior)
  if (!matched) throw errorEnum.DEFAULT.FORBIDDEN
  return matched
}

// ------------------------------------------------------------ Get --

tradersRouter.get('/profiles/:id/:access_code', async (req, res) => {
  const id = parseInt(req.params.id)
  const accessCode = req.params.access_code
  validateGetProfileParams(id, accessCode)

  const trader = await crudTraders.getTraderProfile(id, accessCode)
  return res.status(200).send(trader)
})

tradersRouter.get(
  '/profiles/:id/:access_code/detail',
  authMiddleware.guestOrUser,
  async (req, res) => {
    const id = parseInt(req.params.id)
    const accessCode: string = req.params.access_code
    validateGetProfileParams(id, accessCode)

    const auth: interfaces.reqs.Auth | null = req.body.auth
    const userId = auth?.id || null
    const userEnvIds = await crudTraders.getUserTraderEnvIds(userId)

    const details = await crudTraders.getProfileDetail(id, accessCode, userEnvIds)
    return res.status(200).send(details)
  },
)

tradersRouter.get('/combos/:id', authMiddleware.normalUser, async (req, res) => {
  const comboId = parseInt(req.params.id)
  validateGetComboParams(comboId)

  const auth: interfaces.reqs.Auth = req.body.auth
  await crudTraders.verifyUserToTraderCombo(auth.id, comboId)

  const comboDetail = await crudTraders.getComboDetail(comboId)
  return res.status(200).send(comboDetail)
})

tradersRouter.get('/envs/tops', async (req, res) => {
  const tops = await crudTraders.getTopProfiles()
  return res.status(200).send(tops)
})

tradersRouter.get('/envs/:id', authMiddleware.normalUser, async (req, res) => {
  const envId = parseInt(req.params.id)

  validateGetEnvParams(envId)

  const auth: interfaces.reqs.Auth = req.body.auth

  const env = await crudTraders.getTraderEnv(auth.id, envId)
  return res.status(200).send(env)
})

tradersRouter.get('/envs/:id/tops', authMiddleware.normalUser, async (req, res) => {
  const envId = parseInt(req.params.id)
  validateEnvId(envId)

  const auth: interfaces.reqs.Auth = req.body.auth
  await crudTraders.verifyUserToTraderEnv(auth.id, envId)

  const tops = await crudTraders.getTopProfiles(envId)
  return res.status(200).send(tops)
})

tradersRouter.get('/envs/:env_id/behaviors/:behavior', authMiddleware.normalUser, async (req, res) => {
  const envId = parseInt(req.params.env_id)
  validateEnvId(envId)
  const behavior = req.params.behavior
  const matchedBahavior = validateBehavior(behavior)

  const auth: interfaces.reqs.Auth = req.body.auth
  await crudTraders.verifyUserToTraderEnv(auth.id, envId)

  const detail = await crudTraders.getBehaviorDetail(envId, matchedBahavior)
  return res.status(200).send(detail)
})

tradersRouter.get('/envs/:env_id/tickers/:ticker_id', authMiddleware.normalUser, async (req, res) => {
  const envId = parseInt(req.params.env_id)
  validateEnvId(envId)
  const tickerId = parseInt(req.params.ticker_id)
  validateTickerId(tickerId)

  const auth: interfaces.reqs.Auth = req.body.auth
  await crudTraders.verifyUserToTraderEnv(auth.id, envId)

  const detail = await crudTraders.getTickerDetail(envId, tickerId)
  return res.status(200).send(detail)
})

// ------------------------------------------------------------ Post --

tradersRouter.post('/profiles', authMiddleware.normalUser, async (req, res) => {
  const traderEnvId = req.body.traderEnvId
  const traderPattern = req.body.traderPattern
  validateCreateProfileParams(traderEnvId, traderPattern)

  const auth: interfaces.reqs.Auth = req.body.auth

  const trader = await crudTraders.createTraderProfile(auth.id, traderEnvId, traderPattern)
  return res.status(201).send(trader)
})

tradersRouter.post('/profiles/:trader_id', authMiddleware.normalUser, async (req, res) => {
  const traderId = parseInt(req.params.trader_id)
  validateTraderId(traderId)

  const auth: interfaces.reqs.Auth = req.body.auth
  await crudTraders.createFollowedTrader(auth.id, traderId)
  return res.status(201).send()
})

tradersRouter.post('/envs', authMiddleware.normalUser, async (req, res) => {
  const { name, startDate, tickerIds }: interfaces.reqs.TraderEnvCreation = req.body
  const parsedName = name?.trim()
  validateCreateEnvParams(parsedName, startDate, tickerIds)

  const auth: interfaces.reqs.Auth = req.body.auth

  const traderEnv = await crudTraders.createTraderEnv(
    auth.id, parsedName, startDate, tickerIds,
  )
  return res.status(201).send(traderEnv)
})

tradersRouter.post('/combos', authMiddleware.normalUser, async (req, res) => {
  const { name, traderEnvId, traderIds }: interfaces.reqs.TraderComboCreation = req.body
  const parsedName = name?.trim()
  validateCreateComboParams(parsedName, traderEnvId, traderIds)

  const auth: interfaces.reqs.Auth = req.body.auth
  await crudTraders.verifyUserToTraderEnv(auth.id, traderEnvId)

  const traderCombo = await crudTraders.createTraderCombo(
    auth.id, parsedName, traderEnvId, traderIds,
  )
  return res.status(201).send(traderCombo)
})

// ------------------------------------------------------------ Delete --

tradersRouter.delete('/profiles/:trader_id', authMiddleware.normalUser, async (req, res) => {
  const traderId = parseInt(req.params.trader_id)
  validateTraderId(traderId)

  const auth: interfaces.reqs.Auth = req.body.auth
  await crudTraders.deleteFollowedProfile(auth.id, traderId)
  return res.status(204).send()
})

tradersRouter.delete('/envs/:env_id', authMiddleware.normalUser, async (req, res) => {
  const envId = parseInt(req.params.env_id)
  validateEnvId(envId)

  const auth: interfaces.reqs.Auth = req.body.auth
  await crudTraders.deleteFollowedEnv(auth.id, envId)
  return res.status(204).send()
})
