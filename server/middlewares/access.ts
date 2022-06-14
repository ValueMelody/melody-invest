import { Request, Response, NextFunction } from 'express'
import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as errorEnum from '../enums/error'
import * as traderEnvModel from '../models/traderEnv'
import * as traderEnvFollowerModel from '../models/traderEnvFollower'
import * as traderComboFollowerModel from '../models/traderComboFollower'
import * as traderFollowerModel from '../models/traderFollower'

const getLimits = (userType: number) => {
  switch (userType) {
    case constants.User.Type.Premium:
      return constants.User.PlanLimit.Premium
    case constants.User.Type.Pro:
      return constants.User.PlanLimit.Pro
    case constants.User.Type.Basic:
    default:
      return constants.User.PlanLimit.Basic
  }
}

export const couldCreateEnv = async (
  req: Request, res: Response, next: NextFunction,
) => {
  const auth: interfaces.request.Auth = req.body.auth

  const userId = auth.id
  const userType = auth.type

  const limits = getLimits(userType)
  const envLimit = limits.Envs
  const currentEnvs = await traderEnvFollowerModel.getUserFollowed(userId)
  if (envLimit <= currentEnvs.length) throw errorEnum.Default.Unauthorized

  next()
}

export const couldCreateCombo = async (
  req: Request, res: Response, next: NextFunction,
) => {
  const auth: interfaces.request.Auth = req.body.auth

  const userId = auth.id
  const userType = auth.type

  const limits = getLimits(userType)
  const envLimit = limits.Combos
  const currentCombos = await traderComboFollowerModel.getUserFollowed(userId)
  if (envLimit <= currentCombos.length) throw errorEnum.Default.Unauthorized

  next()
}

export const couldCreateProfile = async (
  req: Request, res: Response, next: NextFunction,
) => {
  const auth: interfaces.request.Auth = req.body.auth

  const userId = auth.id
  const userType = auth.type

  const limits = getLimits(userType)
  const profileLimit = limits.Profiles
  const currentProfiles = await traderFollowerModel.getUserFollowed(userId)
  if (profileLimit <= currentProfiles.length) throw errorEnum.Default.Unauthorized

  next()
}

export const couldAccessEnv = async (
  req: Request, res: Response, next: NextFunction,
) => {
  const envId = parseInt(req.params.env_id)
  if (!envId) throw errorEnum.Dev.WrongMiddleware

  const env = await traderEnvModel.getByPK(envId)
  if (!env) throw errorEnum.Default.NotFound

  if (!env.isSystem) {
    const auth: interfaces.request.Auth = req.body.auth
    const followed = await traderEnvFollowerModel.getUserFollowed(auth.id)
    const limits = getLimits(auth.type)
    const envLimit = limits.Envs

    const planAllowed = followed.slice(0, envLimit)
    const planAllowedIds = planAllowed.map((record) => record.traderEnvId)

    if (!planAllowedIds.includes(envId)) throw errorEnum.Default.NotFound
  }

  next()
}

export const couldAccessCombo = async (
  req: Request, res: Response, next: NextFunction,
) => {
  const comboId = parseInt(req.params.combo_id)
  if (!comboId) throw errorEnum.Dev.WrongMiddleware

  const auth: interfaces.request.Auth = req.body.auth

  const followed = await traderComboFollowerModel.getUserFollowed(auth.id)
  const limits = getLimits(auth.type)
  const comboLimit = limits.Combos

  const planAllowed = followed.slice(0, comboLimit)
  const planAllowedIds = planAllowed.map((record) => record.traderComboId)

  if (!planAllowedIds.includes(comboId)) throw errorEnum.Default.NotFound

  next()
}

export const couldAccessTraders = async (
  req: Request, res: Response, next: NextFunction,
) => {
  const traderIds: number[] = req.body?.traderIds
  if (!traderIds || !Array.isArray(traderIds)) throw errorEnum.Dev.WrongMiddleware

  const auth: interfaces.request.Auth = req.body.auth

  const userFollowed = await traderFollowerModel.getUserFollowed(auth.id)
  const followedIds = userFollowed.map((follow) => follow.traderId)
  const allContained = traderIds.every((traderId) => followedIds.includes(traderId))
  if (!allContained) throw errorEnum.Default.Forbidden

  next()
}
