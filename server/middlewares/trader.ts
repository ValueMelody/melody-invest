import { Request, Response, NextFunction } from 'express'
import * as interfaces from '@shared/interfaces'
import * as errorEnum from '../enums/error'
import * as traderEnvModel from '../models/traderEnv'
import * as traderEnvFollowerModel from '../models/traderEnvFollower'
import * as traderComboFollowerModel from '../models/traderComboFollower'
import * as traderFollowerModel from '../models/traderFollower'

export const couldAccessEnv = async (
  req: Request, res: Response, next: NextFunction,
) => {
  const envId = parseInt(req.params.env_id)
  if (!envId) throw errorEnum.Dev.WrongMiddleware

  const env = await traderEnvModel.getByPK(envId)
  if (!env) throw errorEnum.Default.NotFound

  if (!env.isSystem) {
    const auth: interfaces.request.Auth = req.body.auth
    const envFollower = await traderEnvFollowerModel.getByUK(auth.id, envId)
    if (!envFollower) throw errorEnum.Default.NotFound
  }

  next()
}

export const couldAccessCombo = async (
  req: Request, res: Response, next: NextFunction,
) => {
  const comboId = parseInt(req.params.combo_id)
  if (!comboId) throw errorEnum.Dev.WrongMiddleware

  const auth: interfaces.request.Auth = req.body.auth
  const relation = await traderComboFollowerModel.getByUK(auth.id, comboId)
  if (!relation) throw errorEnum.Default.NotFound

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
