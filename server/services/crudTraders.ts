import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as traderModel from '../models/trader'
import * as traderEnvModel from '../models/traderEnv'
import * as dailyTickersModel from '../models/dailyTickers'
import * as traderEnvFollowerModel from '../models/traderEnvFollower'
import * as traderFollowerModel from '../models/traderFollower'
import * as traderPatternModel from '../models/traderPattern'
import * as traderHoldingModel from '../models/traderHolding'
import * as traderComboModel from '../models/traderCombo'
import * as traderComboFollowerModel from '../models/traderComboFollower'
import * as errorEnum from '../enums/error'
import * as databaseAdapter from '../adapters/database'
import * as generateTool from '../tools/generate'
import * as traderLogic from '../logics/trader'
import buildComboEntities from './shared/buildComboEntities'
import buildHoldingValueStats from './shared/buildHoldingValueStats'

export const getTraderProfile = async (
  id: number, accessCode: string,
): Promise<interfaces.response.TraderProfile> => {
  const trader = await traderModel.getByPK(id)
  if (!trader || trader.accessCode !== accessCode) throw errorEnum.Custom.WrongAccessCode

  const pattern = await traderPatternModel.getByPK(trader.traderPatternId)
  if (!pattern) throw errorEnum.Custom.RecordNotFound

  const { hashCode, ...patternPublic } = pattern

  return {
    trader,
    pattern: patternPublic,
  }
}

export const getProfileDetail = async (
  id: number, accessCode: string, envIds: number[],
): Promise<interfaces.response.ProfileDetail> => {
  const trader = await traderModel.getByPK(id)
  if (!trader || trader.accessCode !== accessCode) throw errorEnum.Custom.WrongAccessCode

  const holdings = await traderHoldingModel.getAll(trader.id)
  const traders = await traderModel.getByPattern(trader.traderPatternId)
  const filterredTraders = traders.filter((trader) => envIds.includes(trader.traderEnvId))
  const profileEnvs = filterredTraders.map((trader) => ({
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

export const verifyUserToTraderEnv = async (
  userId: number, traderEnvId: number,
) => {
  const env = await traderEnvModel.getByPK(traderEnvId)
  if (!env) throw errorEnum.Default.NotFound

  if (!env.isSystem) {
    const envFollower = await traderEnvFollowerModel.getByUK(userId, traderEnvId)
    if (!envFollower) throw errorEnum.Default.NotFound
  }
}

export const verifyUserToTraderIds = async (
  userId: number,
  traderIds: number[],
) => {
  const followed = await traderFollowerModel.getUserFollowed(userId)
  const followedIds = followed.map((follow) => follow.traderId)
  const allContained = traderIds.every((traderId) => followedIds.includes(traderId))
  if (!allContained) throw errorEnum.Default.Forbidden
}

export const verifyUserToTraderCombo = async (
  userId: number, traderComboId: number,
) => {
  const relation = await traderComboFollowerModel.getByUK(userId, traderComboId)
  if (!relation) throw errorEnum.Default.NotFound
}

export const getUserTraderEnvIds = async (
  userId: number | null,
): Promise<number[]> => {
  const userEnvs = userId ? await traderEnvFollowerModel.getUserFollowed(userId) : []
  const userEnvIds = userEnvs.map((env) => env.traderEnvId)
  const systemEnvs = await traderEnvModel.getSystemDefined()
  const systemEnvIds = systemEnvs.map((env) => env.id)
  return [...userEnvIds, ...systemEnvIds]
}

const buildTraderTopProfiles = async (
  tops: interfaces.traderModel.Tops,
): Promise<interfaces.response.TopTraderProfiles> => {
  const topTraders = [...tops.yearly, ...tops.pastYear, ...tops.pastQuarter, ...tops.pastMonth, ...tops.pastWeek]
  const relatedPatterns = await traderPatternModel.getPublicByTraders(topTraders)
  return {
    yearly: tops.yearly.map((trader) => traderLogic.presentTraderProfile(trader, relatedPatterns)),
    pastYear: tops.pastYear.map((trader) => traderLogic.presentTraderProfile(trader, relatedPatterns)),
    pastQuarter: tops.pastQuarter.map((trader) => traderLogic.presentTraderProfile(trader, relatedPatterns)),
    pastMonth: tops.pastMonth.map((trader) => traderLogic.presentTraderProfile(trader, relatedPatterns)),
    pastWeek: tops.pastWeek.map((trader) => traderLogic.presentTraderProfile(trader, relatedPatterns)),
  }
}

export const getTopProfiles = async (
  traderEnvId: number,
): Promise<interfaces.response.TopTraderProfiles> => {
  const each = 1
  const tops = await traderModel.getTops(each, { envId: traderEnvId })
  const topProfiles = await buildTraderTopProfiles(tops)

  return topProfiles
}

export const getBehaviorDetail = async (
  envId: number,
  behavior: interfaces.traderPatternModel.Behavior,
): Promise<interfaces.response.BehaviorDetail> => {
  const tops = await traderModel.getTops(1, { envId, behavior })
  const topProfiles = await buildTraderTopProfiles(tops)

  return {
    topProfiles,
  }
}

export const getTickerDetail = async (
  envId: number,
  tickerId: number,
): Promise<interfaces.response.TickerDetail> => {
  const tops = await traderModel.getTops(1, { envId, tickerId })
  const topProfiles = await buildTraderTopProfiles(tops)

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
): Promise<interfaces.response.TraderProfile> => {
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
  if (!env) throw errorEnum.Default.NotFound

  const envFollower = await traderEnvFollowerModel.getByUK(userId, envId)
  if (!envFollower && !env.isSystem) throw errorEnum.Default.NotFound

  const name = envFollower && !env.isSystem ? envFollower.name : env.name

  return { ...env, name }
}

export const getComboDetail = async (
  comboId: number,
): Promise<interfaces.response.ComboDetail> => {
  const combo = await traderComboModel.getByPK(comboId)
  if (!combo) throw errorEnum.Default.NotFound

  const traders = await traderModel.getInPKs(combo.traderIds)
  const { traderProfiles, holdings } = await buildComboEntities(traders)
  const latestDate = await dailyTickersModel.getLatestDate()
  const startDate = holdings.length ? holdings[holdings.length - 1].date : latestDate
  const stats = await buildHoldingValueStats(
    startDate,
    latestDate,
    constants.Trader.Initial.Cash * traders.length,
    holdings,
  )

  return {
    holdings: holdings.slice(0, 20),
    profiles: traderProfiles,
    oneYearTrends: stats.oneYearTrends,
    oneDecadeTrends: stats.oneDecadeTrends,
    totalValue: stats.totalValue,
    yearlyPercentNumber: stats.yearlyPercentNumber,
    pastWeekPercentNumber: stats.pastWeekPercentNumber,
    pastMonthPercentNumber: stats.pastMonthPercentNumber,
    pastQuarterPercentNumber: stats.pastQuarterPercentNumber,
    pastYearPercentNumber: stats.pastYearPercentNumber,
  }
}

export const createTraderEnv = async (
  userId: number,
  name: string,
  startDate: string,
  tickerIds: number[] | null,
): Promise<interfaces.traderEnvModel.Record> => {
  const tickerIdsAsString = tickerIds
    ? generateTool.sortNumsToString(tickerIds)
    : null
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

export const createTraderCombo = async (
  userId: number,
  name: string,
  traderIds: number[],
): Promise<interfaces.traderComboModel.Identity> => {
  const traderIdsAsString = generateTool.sortNumsToString(traderIds)

  const transaction = await databaseAdapter.createTransaction()
  try {
    const combo = await traderComboModel.createIfEmpty({
      traderIds: traderIdsAsString,
    }, transaction)

    const relation = await traderComboFollowerModel.createIfEmpty({
      userId, traderComboId: combo.id, name,
    }, transaction)
    await transaction.commit()

    return { ...combo, name: relation.name, isSystem: false }
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
