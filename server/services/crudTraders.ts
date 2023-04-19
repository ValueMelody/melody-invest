import * as constants from '@shared/constants'
import * as dailyTickersModel from 'models/dailyTickers'
import * as databaseAdapter from 'adapters/database'
import * as errorEnum from 'enums/error'
import * as generateTool from 'tools/generate'
import * as interfaces from '@shared/interfaces'
import * as tickerModel from 'models/ticker'
import * as traderComboFollowerModel from 'models/traderComboFollower'
import * as traderComboModel from 'models/traderCombo'
import * as traderEnvFollowerModel from 'models/traderEnvFollower'
import * as traderEnvModel from 'models/traderEnv'
import * as traderFollowerModel from 'models/traderFollower'
import * as traderHoldingModel from 'models/traderHolding'
import * as traderLogic from 'logics/trader'
import * as traderModel from 'models/trader'
import * as traderPatternModel from 'models/traderPattern'
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
  const traders = await traderModel.getByPatternId(trader.traderPatternId)
  const filteredTraders = traders.filter((trader) => envIds.includes(trader.traderEnvId))
  const profileEnvs = filteredTraders.map((trader) => ({
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

export const getUserTraderEnvIds = async (
  userId: number | null,
): Promise<number[]> => {
  if (!userId) return []
  const userEnvs = await traderEnvFollowerModel.getUserFollowed(userId)
  const userEnvIds = userEnvs.map((env) => env.traderEnvId)
  return userEnvIds
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

export const getEnvDetail = async (
  traderEnvId: number,
): Promise<interfaces.response.EnvDetail> => {
  const tops = await traderModel.getTops(3, { envId: traderEnvId })
  const topProfiles = await buildTraderTopProfiles(tops)

  return {
    topProfiles,
  }
}

export const getBehaviorDetail = async (
  envId: number,
  behavior: interfaces.traderPatternModel.Behavior,
): Promise<interfaces.response.BehaviorDetail> => {
  const tops = await traderModel.getTops(3, { envId, behavior })
  const topProfiles = await buildTraderTopProfiles(tops)

  return {
    topProfiles,
  }
}

export const getTickerDetail = async (
  envId: number,
  tickerId: number,
): Promise<interfaces.response.TickerDetail> => {
  const tops = await traderModel.getTops(3, { envId, tickerId })
  const topProfiles = await buildTraderTopProfiles(tops)

  return {
    topProfiles,
  }
}

export const createFollowedTrader = async (
  userId: number, traderId: number,
) => {
  const trader = await traderModel.getByPK(traderId)
  if (!trader) return

  const currentRecord = await traderFollowerModel.getByUK(userId, traderId)
  if (currentRecord) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    await traderFollowerModel.create({ userId, traderId }, transaction)
    if (!trader.hasFollower) await traderModel.update(traderId, { hasFollower: false }, transaction)
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
    const patternResult = await traderPatternModel.createIfEmpty(traderPattern, transaction)
    const pattern = patternResult.record
    const parent = null
    const hasMutation = false
    const hasFollower = false
    const traderResult = await traderModel.createOrActive(
      traderEnvId,
      pattern.id,
      parent,
      parent,
      hasMutation,
      hasFollower,
      transaction,
    )
    const trader = traderResult.record

    const currentRelation = await traderFollowerModel.getByUK(userId, trader.id)
    if (!currentRelation) {
      await traderFollowerModel.create({ userId, traderId: trader.id }, transaction)
    }

    if (patternResult.isNew || traderResult.isEdited || !currentRelation) {
      await transaction.commit()
    } else {
      await transaction.rollback()
    }

    return {
      trader,
      pattern,
    }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
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
    combo.entityId,
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

export const createTicker = async (
  entityId: number,
  symbol: string,
): Promise<interfaces.tickerModel.Record> => {
  const transaction = await databaseAdapter.createTransaction()
  try {
    const ticker = await tickerModel.createIfEmpty({
      entityId,
      symbol,
      region: 'US',
      isDelisted: false,
    }, transaction)

    if (ticker.isNew) {
      await transaction.commit()
    } else {
      await transaction.rollback()
    }

    return ticker.record
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const createTraderEnv = async (
  userId: number,
  entityId: number,
  name: string,
  startDate: string,
  tickerIds: number[] | null,
): Promise<interfaces.traderEnvModel.Identity> => {
  const tickerIdsAsString = tickerIds
    ? generateTool.sortNumsToString(tickerIds)
    : null
  const transaction = await databaseAdapter.createTransaction()
  try {
    const envResult = await traderEnvModel.createIfEmpty({
      entityId,
      startDate,
      tickerIds: tickerIdsAsString,
      activeTotal: 1000,
    }, transaction)
    const env = envResult.record

    const relation = await traderEnvFollowerModel.createIfEmpty({
      userId, traderEnvId: env.id, name,
    }, transaction)

    if (relation.isNew || envResult.isNew) {
      await transaction.commit()
    } else {
      await transaction.rollback()
    }

    return { ...env, name: relation.record.name }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const createTraderCombo = async (
  userId: number,
  entityId: number,
  name: string,
  traderIds: number[],
): Promise<interfaces.traderComboModel.Identity> => {
  const traderIdsAsString = generateTool.sortNumsToString(traderIds)

  const transaction = await databaseAdapter.createTransaction()
  try {
    const combo = await traderComboModel.createIfEmpty({
      entityId,
      traderIds: traderIdsAsString,
    }, transaction)

    const relation = await traderComboFollowerModel.createIfEmpty({
      userId, traderComboId: combo.record.id, name,
    }, transaction)

    combo.isNew || relation.isNew
      ? await transaction.commit()
      : await transaction.rollback()

    return { ...combo.record, name: relation.record.name }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const deleteFollowedEnv = async (
  userId: number,
  envId: number,
) => {
  const envFollower = await traderEnvFollowerModel.getByUK(userId, envId)
  if (!envFollower) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    await traderEnvFollowerModel.destroy(userId, envId, transaction)

    const userFollowedTraders = await traderFollowerModel.getUserFollowed(userId)
    const traderIds = userFollowedTraders.map((followed) => followed.traderId)
    const traders = await traderModel.getInPKs(traderIds)
    const filteredTraders = traders.filter((trader) => trader.traderEnvId === envId)
    const targetTraderIds = filteredTraders.map((trader) => trader.id)

    if (targetTraderIds.length) {
      await traderFollowerModel.destroyUserFollowedTraders(userId, targetTraderIds, transaction)
    }

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const deleteFollowedCombo = async (
  userId: number,
  comboId: number,
) => {
  const comboFollower = await traderComboFollowerModel.getByUK(userId, comboId)
  if (!comboFollower) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    await traderComboFollowerModel.destroy(userId, comboId, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
