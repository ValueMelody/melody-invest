import * as interfaces from '@shared/interfaces'
import * as traderModel from '../models/trader'
import * as traderEnvModel from '../models/traderEnv'
import * as traderEnvFollowerModel from '../models/traderEnvFollower'
import * as traderFollowerModel from '../models/traderFollower'
import * as traderPatternModel from '../models/traderPattern'
import * as traderHoldingModel from '../models/traderHolding'
import * as errorEnum from '../enums/error'
import * as databaseAdapter from '../adapters/database'
import * as presentTool from '../tools/present'

export const getTraderProfile = async (
  id: number, accessCode: string,
): Promise<interfaces.traderRes.TraderProfile> => {
  const trader = await traderModel.getByPK(id)
  if (!trader || trader.accessCode !== accessCode) throw errorEnum.CUSTOM.ACCESS_CODE_MISMATCH

  const pattern = await traderPatternModel.getByPK(trader.traderPatternId)
  if (!pattern) throw errorEnum.CUSTOM.FOREIGN_RECORD_MISSING

  const { hashCode, ...patternPublic } = pattern

  return {
    trader,
    pattern: patternPublic,
  }
}

export const getProfileDetail = async (
  id: number, accessCode: string,
): Promise<interfaces.traderRes.ProfileDetail> => {
  const trader = await traderModel.getByPK(id)
  if (!trader || trader.accessCode !== accessCode) throw errorEnum.CUSTOM.ACCESS_CODE_MISMATCH

  const holdings = await traderHoldingModel.getAll(trader.id)
  const traders = await traderModel.getByPattern(trader.traderPatternId)
  const profileEnvs = traders.map((trader) => ({
    traderId: trader.id,
    traderEnvId: trader.traderEnvId,
    traderPatternId: trader.traderPatternId,
    accessCode: trader.accessCode,
  }))

  return {
    profileEnvs,
    holdings,
  }
}

export const verifyUserToTraderEnv = async (userId: number, traderEnvId: number) => {
  const env = await traderEnvModel.getByPK(traderEnvId)
  if (!env) throw errorEnum.DEFAULT.NOT_FOUND

  if (!env.isSystem) {
    const envFollower = await traderEnvFollowerModel.getByUK(userId, traderEnvId)
    if (!envFollower) throw errorEnum.DEFAULT.NOT_FOUND
  }
}

const getTopProfilesRelatedPatterns = async (
  tops: interfaces.traderModel.Tops,
): Promise<interfaces.traderPatternModel.Public[]> => {
  const topTraders = [...tops.yearly, ...tops.pastYear, ...tops.pastQuarter, ...tops.pastMonth, ...tops.pastWeek]
  const relatedPatternIds = topTraders.map((trader) => trader.traderPatternId)
  const patterns = await traderPatternModel.getInPKs(relatedPatternIds)
  const relatedPatterns = patterns.map(({ hashCode, ...publicPattern }) => publicPattern)
  return relatedPatterns
}

export const getTopProfiles = async (
  traderEnvId?: number,
): Promise<interfaces.traderRes.TopProfiles> => {
  const each = traderEnvId ? 1 : 3

  const tops = await traderModel.getTops(each, traderEnvId)
  const relatedPatterns = await getTopProfilesRelatedPatterns(tops)

  return {
    yearly: tops.yearly.map((trader) => presentTool.combineTraderAndPattern(trader, relatedPatterns)),
    pastYear: tops.pastYear.map((trader) => presentTool.combineTraderAndPattern(trader, relatedPatterns)),
    pastQuarter: tops.pastQuarter.map((trader) => presentTool.combineTraderAndPattern(trader, relatedPatterns)),
    pastMonth: tops.pastMonth.map((trader) => presentTool.combineTraderAndPattern(trader, relatedPatterns)),
    pastWeek: tops.pastWeek.map((trader) => presentTool.combineTraderAndPattern(trader, relatedPatterns)),
  }
}

export const getBehaviorDetail = async (
  envId: number,
  behavior: interfaces.traderPatternModel.Behavior,
): Promise<interfaces.traderRes.BehaviorDetail> => {
  const tops = await traderModel.getTops(1, envId, behavior)
  const relatedPatterns = await getTopProfilesRelatedPatterns(tops)

  const topProfiles = {
    yearly: tops.yearly.map((trader) => presentTool.combineTraderAndPattern(trader, relatedPatterns)),
    pastYear: tops.pastYear.map((trader) => presentTool.combineTraderAndPattern(trader, relatedPatterns)),
    pastQuarter: tops.pastQuarter.map((trader) => presentTool.combineTraderAndPattern(trader, relatedPatterns)),
    pastMonth: tops.pastMonth.map((trader) => presentTool.combineTraderAndPattern(trader, relatedPatterns)),
    pastWeek: tops.pastWeek.map((trader) => presentTool.combineTraderAndPattern(trader, relatedPatterns)),
  }

  return {
    topProfiles,
  }
}

export const createFollowedTrader = async (
  userId: number, traderId: number,
) => {
  const currentRecord = await traderFollowerModel.getByUK(userId, traderId)
  if (currentRecord) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    await traderFollowerModel.create({ userId, traderId }, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const deleteFollowedProfile = async (
  userId: number, traderId: number,
) => {
  const transaction = await databaseAdapter.createTransaction()
  try {
    await traderFollowerModel.destroy(userId, traderId, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const createTraderProfile = async (
  userId: number,
  traderEnvId: number,
  traderPattern: interfaces.traderPatternModel.Create,
): Promise<interfaces.traderRes.TraderProfile> => {
  const transaction = await databaseAdapter.createTransaction()
  try {
    const pattern = await traderPatternModel.createIfEmpty(traderPattern, transaction)
    const trader = await traderModel.createOrActive(traderEnvId, pattern.id, transaction)

    const currentRelation = await traderFollowerModel.getByUK(userId, trader.id)
    if (!currentRelation) {
      await traderFollowerModel.create({ userId, traderId: trader.id }, transaction)
    }

    await transaction.commit()

    return {
      trader,
      pattern,
    }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const getTraderEnv = async (
  userId: number, envId: number,
): Promise<interfaces.traderEnvModel.Record> => {
  const env = await traderEnvModel.getByPK(envId)
  if (!env) throw errorEnum.DEFAULT.NOT_FOUND

  const envFollower = await traderEnvFollowerModel.getByUK(userId, envId)
  if (!envFollower && !env.isSystem) throw errorEnum.DEFAULT.NOT_FOUND

  const name = envFollower && !env.isSystem ? envFollower.name : env.name

  return { ...env, name }
}

export const createTraderEnv = async (
  userId: number,
  name: string,
  startDate: string,
  tickerIds: number[] | null,
): Promise<interfaces.traderEnvModel.Record> => {
  const tickerIdsAsString = tickerIds ? tickerIds.sort((a, b) => a - b).join(',') : null
  const transaction = await databaseAdapter.createTransaction()
  try {
    const env = await traderEnvModel.createIfEmpty({
      startDate,
      tickerIds: tickerIdsAsString,
      name: null,
      isSystem: false,
      activeTotal: 1000,
    }, transaction)

    if (env.isSystem) return env

    const relation = await traderEnvFollowerModel.createIfEmpty({
      userId, traderEnvId: env.id, name,
    }, transaction)
    await transaction.commit()

    return { ...env, name: relation.name }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const deleteFollowedEnv = async (
  userId: number, envId: number,
) => {
  const envFollower = await traderEnvFollowerModel.getByUK(userId, envId)
  if (!envFollower) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    await traderEnvFollowerModel.destroy(userId, envId, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
