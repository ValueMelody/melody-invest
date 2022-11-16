import * as accessMiddleware from 'middlewares/access'
import * as authMiddleware from 'middlewares/auth'
import * as constants from '@shared/constants'
import * as crudTraders from 'services/crudTraders'
import * as errorEnum from 'enums/error'
import * as interfaces from '@shared/interfaces'
import * as verifyTool from 'tools/verify'
import { Router } from 'express'

const tradersRouter = Router()
export default tradersRouter

// ------------------------------------------------------------ Validate --

const validateGetProfileParams = (id: number, accessCode: string) => {
  const hasValidParam = id && accessCode && accessCode.length === 16
  if (!hasValidParam) throw errorEnum.Custom.WrongAccessCode
}

const validateCreateProfileParams = (
  traderId: number,
  traderPattern: interfaces.traderPatternModel.Create,
) => {
  if (!traderId || !traderPattern) throw errorEnum.Custom.MissingParams
}

const validateCreateEnvParams = (name: string, startDate: string, tickerIds: number[] | null) => {
  if (!name || startDate?.length !== 10) throw errorEnum.Custom.MissingParams
  const hasWrongId = tickerIds && tickerIds.some((id) => typeof id !== 'number')
  if (hasWrongId) throw errorEnum.Default.Forbidden
}

const validateCreateComboParams = (name: string, traderIds: number[]) => {
  if (!name || !Array.isArray(traderIds) || traderIds.length < 2) throw errorEnum.Custom.MissingParams
  const hasWrongId = traderIds.some((id) => typeof id !== 'number')
  if (hasWrongId) throw errorEnum.Default.Forbidden
}

const validateBehavior = (behavior: string): interfaces.traderPatternModel.Behavior => {
  const matched = constants.Behavior.Behaviors.find((name) => name === behavior)
  if (!matched) throw errorEnum.Default.Forbidden
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

    const auth: interfaces.request.Auth | null = req.body.auth
    const userId = auth?.id || null
    const userEnvIds = await crudTraders.getUserTraderEnvIds(userId)

    const details = await crudTraders.getProfileDetail(id, accessCode, userEnvIds)
    return res.status(200).send(details)
  },
)

tradersRouter.get(
  '/combos/:combo_id',
  authMiddleware.normalUser,
  async (req, res) => {
    const comboId = parseInt(req.params.combo_id)
    if (!verifyTool.isGreaterThanZero(comboId)) throw errorEnum.Default.Forbidden

    const comboDetail = await crudTraders.getComboDetail(comboId)
    return res.status(200).send(comboDetail)
  },
)

tradersRouter.get(
  '/envs/:env_id',
  authMiddleware.normalUser,
  accessMiddleware.couldAccessEnv,
  async (req, res) => {
    const envId = parseInt(req.params.env_id)
    if (!verifyTool.isGreaterThanZero(envId)) throw errorEnum.Default.Forbidden

    const tops = await crudTraders.getEnvDetail(envId)
    return res.status(200).send(tops)
  },
)

tradersRouter.get(
  '/envs/:env_id/behaviors/:behavior',
  authMiddleware.normalUser,
  accessMiddleware.couldAccessEnv,
  async (req, res) => {
    const envId = parseInt(req.params.env_id)
    if (!verifyTool.isGreaterThanZero(envId)) throw errorEnum.Default.Forbidden

    const behavior = req.params.behavior
    const matchedBahavior = validateBehavior(behavior)

    const detail = await crudTraders.getBehaviorDetail(envId, matchedBahavior)
    return res.status(200).send(detail)
  },
)

tradersRouter.get(
  '/envs/:env_id/tickers/:ticker_id',
  authMiddleware.normalUser,
  accessMiddleware.couldAccessEnv,
  async (req, res) => {
    const envId = parseInt(req.params.env_id)
    if (!verifyTool.isGreaterThanZero(envId)) throw errorEnum.Default.Forbidden

    const tickerId = parseInt(req.params.ticker_id)
    if (!verifyTool.isGreaterThanZero(tickerId)) throw errorEnum.Default.Forbidden

    const detail = await crudTraders.getTickerDetail(envId, tickerId)
    return res.status(200).send(detail)
  },
)

// ------------------------------------------------------------ Post --

tradersRouter.post(
  '/profiles',
  authMiddleware.normalUser,
  accessMiddleware.couldCreateProfile,
  async (req, res) => {
    const traderEnvId = req.body.traderEnvId
    const traderPattern = req.body.traderPattern
    validateCreateProfileParams(traderEnvId, traderPattern)

    const auth: interfaces.request.Auth = req.body.auth

    const trader = await crudTraders.createTraderProfile(auth.id, traderEnvId, traderPattern)
    return res.status(201).send(trader)
  },
)

tradersRouter.post(
  '/profiles/:trader_id',
  authMiddleware.normalUser,
  accessMiddleware.couldCreateProfile,
  async (req, res) => {
    const traderId = parseInt(req.params.trader_id)
    if (!verifyTool.isGreaterThanZero(traderId)) throw errorEnum.Default.Forbidden

    const auth: interfaces.request.Auth = req.body.auth
    await crudTraders.createFollowedTrader(auth.id, traderId)
    return res.status(201).send()
  },
)

tradersRouter.post(
  '/envs',
  authMiddleware.normalUser,
  accessMiddleware.couldCreateEnv,
  async (req, res) => {
    const { name, startDate, tickerIds }: interfaces.request.TraderEnvCreation = req.body
    const parsedName = name?.trim()
    validateCreateEnvParams(parsedName, startDate, tickerIds)
    const auth: interfaces.request.Auth = req.body.auth

    const traderEnv = await crudTraders.createTraderEnv(
      auth.id, parsedName, startDate, tickerIds,
    )
    return res.status(201).send(traderEnv)
  },
)

tradersRouter.post(
  '/combos',
  authMiddleware.normalUser,
  accessMiddleware.couldCreateCombo,
  accessMiddleware.couldAccessProfiles,
  async (req, res) => {
    const { name, traderIds }: interfaces.request.TraderComboCreation = req.body
    const parsedName = name?.trim()
    validateCreateComboParams(parsedName, traderIds)

    const auth: interfaces.request.Auth = req.body.auth

    const traderCombo = await crudTraders.createTraderCombo(
      auth.id, parsedName, traderIds,
    )
    return res.status(201).send(traderCombo)
  },
)

// ------------------------------------------------------------ Delete --

tradersRouter.delete('/profiles/:trader_id', authMiddleware.normalUser, async (req, res) => {
  const traderId = parseInt(req.params.trader_id)
  if (!verifyTool.isGreaterThanZero(traderId)) throw errorEnum.Default.Forbidden

  const auth: interfaces.request.Auth = req.body.auth
  await crudTraders.deleteFollowedProfile(auth.id, traderId)
  return res.status(204).send()
})

tradersRouter.delete('/envs/:env_id', authMiddleware.normalUser, async (req, res) => {
  const envId = parseInt(req.params.env_id)
  if (!verifyTool.isGreaterThanZero(envId)) throw errorEnum.Default.Forbidden

  const auth: interfaces.request.Auth = req.body.auth
  await crudTraders.deleteFollowedEnv(auth.id, envId)
  return res.status(204).send()
})

tradersRouter.delete('/combos/:combo_id', authMiddleware.normalUser, async (req, res) => {
  const comboId = parseInt(req.params.combo_id)
  if (!verifyTool.isGreaterThanZero(comboId)) throw errorEnum.Default.Forbidden

  const auth: interfaces.request.Auth = req.body.auth
  await crudTraders.deleteFollowedCombo(auth.id, comboId)
  return res.status(204).send()
})
