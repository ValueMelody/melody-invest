import * as interfaces from '@shared/interfaces'
import * as traderModel from '../models/trader'
import * as traderFollowerModel from '../models/traderFollower'
import * as traderPatternModel from '../models/traderPattern'
import * as traderHoldingModel from '../models/traderHolding'
import * as errorEnum from '../enums/error'
import * as databaseAdapter from '../adapters/database'

export const getTraderStat = async (
  id: number, accessCode: string,
): Promise<interfaces.traderProfileRes.TraderProfile> => {
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

export const getTraderHoldings = async (
  id: number, accessCode: string,
): Promise<interfaces.traderHoldingModel.Record[]> => {
  const trader = await traderModel.getByPK(id)
  if (!trader || trader.accessCode !== accessCode) throw errorEnum.CUSTOM.ACCESS_CODE_MISMATCH

  const holdings = await traderHoldingModel.getAll(trader.id)
  return holdings
}

const combineTraderAndPattern = (
  trader: interfaces.traderModel.Record,
  patterns: interfaces.traderPatternModel.Public[],
) => {
  const matchedPattern = patterns.find((pattern) => pattern.id === trader.traderPatternId)!
  return { trader, pattern: matchedPattern }
}

export const getTopPatterns = async (): Promise<interfaces.traderProfileRes.TopProfiles> => {
  const tops = await traderModel.getTops(15)
  const topTraders = [...tops.yearly, ...tops.pastYear, ...tops.pastQuarter, ...tops.pastMonth, ...tops.pastWeek]
  const relatedPatternIds = topTraders.map((trader) => trader.traderPatternId)
  const patterns = await traderPatternModel.getInPKs(relatedPatternIds)
  const relatedPatterns = patterns.map(({ hashCode, ...publicPattern }) => publicPattern)

  return {
    yearly: tops.yearly.map((trader) => combineTraderAndPattern(trader, relatedPatterns)),
    pastYear: tops.pastYear.map((trader) => combineTraderAndPattern(trader, relatedPatterns)),
    pastQuarter: tops.pastQuarter.map((trader) => combineTraderAndPattern(trader, relatedPatterns)),
    pastMonth: tops.pastMonth.map((trader) => combineTraderAndPattern(trader, relatedPatterns)),
    pastWeek: tops.pastWeek.map((trader) => combineTraderAndPattern(trader, relatedPatterns)),
  }
}

export const getFollowedTraders = async (userId: number) => {
  const userTraders = await traderFollowerModel.getUserFollowed(userId)
  const traderIds = userTraders.map((userTrader) => userTrader.traderId)
  const traders = await traderModel.getInPKs(traderIds)
  const relatedPatternIds = traders.map((trader) => trader.traderPatternId)
  const patterns = await traderPatternModel.getInPKs(relatedPatternIds)
  const relatedPatterns = patterns.map(({ hashCode, ...publicPattern }) => publicPattern)

  return traders.map((trader) => combineTraderAndPattern(trader, relatedPatterns))
}

export const createFollowedTrader = async (
  userId: number, traderId: number,
) => {
  const currentRecord = await traderFollowerModel.getByUK(userId, traderId)
  if (currentRecord) return true

  const transaction = await databaseAdapter.createTransaction()
  try {
    await traderFollowerModel.create({ userId, traderId }, transaction)

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const deleteFollowedTrader = async (
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
