import * as cacheAdapter from 'adapters/cache'
import * as cacheTool from 'tools/cache'
import * as constants from '@shared/constants'
import * as dailyTickersModel from 'models/dailyTickers'
import * as dailyIndicatorsModel from 'models/dailyIndicators'
import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as errorEnums from 'enums/error'
import * as entityModel from 'models/entity'
import * as evaluationLogic from 'logics/evaluation'
import * as generateTool from 'tools/generate'
import * as helpers from '@shared/helpers'
import * as interfaces from '@shared/interfaces'
import * as patternLogic from 'logics/pattern'
import * as runTool from 'tools/run'
import * as tickerDailyModel from 'models/tickerDaily'
import * as tickerHolderModel from 'models/tickerHolder'
import * as tickerModel from 'models/ticker'
import * as traderEnvFollowerModel from 'models/traderEnvFollower'
import * as traderEnvModel from 'models/traderEnv'
import * as traderHoldingModel from 'models/traderHolding'
import * as traderLogic from 'logics/trader'
import * as traderModel from 'models/trader'
import * as traderPatternModel from 'models/traderPattern'
import * as transactionLogic from 'logics/transaction'
import buildHoldingValueStats from './shared/buildHoldingValueStats'

const cleanupTrader = async (traderId: number): Promise<interfaces.traderModel.Record> => {
  const transaction = await databaseAdapter.createTransaction()
  try {
    await tickerHolderModel.destroyTraderTickers(traderId, transaction)
    await traderHoldingModel.destroyAll(traderId, transaction)
    const updated = await traderModel.update(traderId, {
      rankingNumber: null,
      totalValue: null,
      totalDays: null,
      startedAt: null,
      rebalancedAt: null,
      estimatedAt: null,
      grossPercentNumber: null,
      yearlyPercentNumber: null,
      pastYearPercentNumber: null,
      pastQuarterPercentNumber: null,
      pastMonthPercentNumber: null,
      pastWeekPercentNumber: null,
      oneYearTrends: null,
      oneDecadeTrends: null,
    }, transaction)

    await transaction.commit()

    return updated
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

const isActiveTraderEnv = async (env: interfaces.traderEnvModel.Record) => {
  const followers = await traderEnvFollowerModel.getEnvFollowers(env.id)
  const userIds = followers.map((follower) => follower.userId)
  return userIds.length
}

const getCachedDailyTickers = async (
  entityId: number, date: string,
): Promise<interfaces.dailyTickersModel.Record | null> => {
  return cacheAdapter.returnBuild({
    cacheAge: '1d',
    cacheKey: cacheTool.generateDailyTickersKey(entityId, date),
    buildFunction: async () => {
      const dailyTickers = await dailyTickersModel.getByUK(entityId, date)
      return dailyTickers
    },
    preferLocal: true,
  })
}

const getCachedDailyIndicators = async (
  date: string,
): Promise<interfaces.dailyIndicatorsModel.Record | null> => {
  return cacheAdapter.returnBuild({
    cacheAge: '1d',
    cacheKey: cacheTool.generateDailyIndicatorsKey(date),
    buildFunction: async () => {
      const dailyIndicators = await dailyIndicatorsModel.getByUK(date)
      return dailyIndicators
    },
    preferLocal: true,
  })
}

const calcTraderPerformance = async (
  targetTrader: interfaces.traderModel.Record,
  env: interfaces.traderEnvModel.Record,
  forceRecheck: boolean,
  latestDate: string,
  delistedLastPrices: transactionLogic.DelistedLastPrices,
) => {
  // Delete all trader records in related tables and reset trader record if forceRecheck = true
  const trader = forceRecheck
    ? await cleanupTrader(targetTrader.id)
    : targetTrader

  // If trader has been estimated already, then skip
  if (trader.estimatedAt && trader.estimatedAt >= latestDate) return

  const pattern = await traderPatternModel.getByPK(targetTrader.traderPatternId)
  if (!pattern) throw errorEnums.Custom.RecordNotFound

  let holding = await traderHoldingModel.getLatest(trader.id)

  // Get next trade date, or use env start date for empty trader record
  let tradeDate = holding
    ? dateTool.getNextDate(holding.date, pattern.tradeFrequency)
    : env.startDate

  // If target trade date is larger than latest date with market data, then skip
  if (tradeDate > latestDate) return

  let rebalancedAt = trader.rebalancedAt || tradeDate
  let startedAt = trader.startedAt
  let hasRebalanced = false
  let shouldCommitTransaction = false

  const cashMaxPercent = pattern.cashMaxPercent / 100
  const tickerMinPercent = pattern.tickerMinPercent / 100
  const tickerMaxPercent = pattern.tickerMaxPercent / 100
  const holdingBuyPercent = pattern.holdingBuyPercent / 100
  const holdingSellPercent = pattern.holdingSellPercent / 100

  console.info(`Checking Trader:${trader.id}`)
  const transaction = await databaseAdapter.createTransaction()
  try {
    // Keep calculate until target trade date is larger than lastes date with market data
    while (tradeDate <= latestDate) {
      const nextDate = dateTool.getNextDate(tradeDate, pattern.tradeFrequency)

      const dailyTickersRecord = await getCachedDailyTickers(
        env.entityId,
        tradeDate,
      )

      // If target trade date has no market date, then try next date
      if (!dailyTickersRecord?.tickerInfos) {
        tradeDate = nextDate
        continue
      }

      const tickerInfos = dailyTickersRecord.tickerInfos
      const dailyIndicators = await getCachedDailyIndicators(tradeDate)
      const indicatorInfo = dailyIndicators?.indicatorInfo || {}

      const tickerIds = env.tickerIds ?? (await tickerModel.getAll()).map((ticker) => ticker.id)
      const availableTickerInfos = tickerIds.reduce((tickers, tickerId) => {
        tickers[tickerId] = tickerInfos[tickerId]
        return tickers
      }, {} as interfaces.dailyTickersModel.TickerInfos)

      const totalCash = holding ? holding.totalCash : constants.Trader.Initial.Cash
      const items = holding ? holding.items : []

      // Regenerate holding detail by cash, holding items, and target market info
      const regeneratedDetail = transactionLogic.generateHoldingDetail(
        totalCash, items, availableTickerInfos, tradeDate, delistedLastPrices,
      )

      // If next expected rebalance date is earlier than target trade date, then rebalance
      const shouldRebalance =
        !!pattern.rebalanceFrequency &&
        dateTool.getNextDate(rebalancedAt, pattern.rebalanceFrequency) <= tradeDate

      // Rebalance holding based on tickerMinPercent, tickerMaxPercent and cashMaxPercent
      const {
        holdingDetail: rebalancedDetail,
        hasTransaction: hasRebalanceTransaction,
      } = transactionLogic.rebalanceHoldingDetail(
        shouldRebalance,
        regeneratedDetail,
        availableTickerInfos,
        tickerMinPercent,
        tickerMaxPercent,
        cashMaxPercent,
      )

      // Check if indicatorInfo matches sell criterion
      const shouldSellBasedOnIndicator = evaluationLogic.isIndicatorFitPatternBehaviors(
        pattern,
        indicatorInfo,
        constants.Behavior.IndicatorMovementSellBehaviors,
        constants.Behavior.IndicatorCompareSellBehaviors,
      )

      // Get a list of ordered tickerIds that should be sold
      const holdingTickerIds = rebalancedDetail.items.map((item) => item.tickerId)

      // Get evaluations of each ticker, order by which one should be sold first
      const tickerSellEvaluations = shouldSellBasedOnIndicator
        ? evaluationLogic.getTickerSellEvaluations(
          holdingTickerIds, pattern, tickerInfos,
        )
        : []
      const sellTickerIds = tickerSellEvaluations.map((tickerSellEvaluation) => tickerSellEvaluation.tickerId)

      // Update holding after sell target tickers
      const {
        holdingDetail: detailAfterSell,
        hasTransaction: hasSellTransaction,
      } = transactionLogic.getHoldingDetailAfterSell(
        rebalancedDetail,
        sellTickerIds,
        availableTickerInfos,
        holdingSellPercent,
        tickerMinPercent,
        cashMaxPercent,
      )

      // Check if indicatorInfo matches buy criterion
      const shouldBuyBasedOnIndicator = evaluationLogic.isIndicatorFitPatternBehaviors(
        pattern,
        indicatorInfo,
        constants.Behavior.IndicatorMovementBuyBehaviors,
        constants.Behavior.IndicatorCompareBuyBehaviors,
      )

      // Get a list of tickerIds that could be trade
      const availableTickerIds = Object.keys(availableTickerInfos).map((id) => parseInt(id))

      // Get evaluations of each ticker, order by which one should be bought first
      const tickerBuyEvaluations = shouldBuyBasedOnIndicator
        ? evaluationLogic.getTickerBuyEvaluations(
          availableTickerIds, pattern, tickerInfos,
        )
        : []
      const buyTickerIds = tickerBuyEvaluations.map((evaluation) => evaluation.tickerId)

      // Update holding after buy target tickers
      const {
        holdingDetail: detailAfterBuy,
        hasTransaction: hasBuyTransaction,
      } = transactionLogic.getHoldingDetailAfterBuy(
        detailAfterSell,
        buyTickerIds,
        tickerInfos,
        holdingBuyPercent,
        tickerMaxPercent,
      )

      const hasTransaction = hasRebalanceTransaction || hasSellTransaction || hasBuyTransaction

      if (hasTransaction) {
        shouldCommitTransaction = true
        if (!startedAt) startedAt = tradeDate
        holding = await traderHoldingModel.create({
          traderId: trader.id,
          date: tradeDate,
          totalValue: detailAfterBuy.totalValue,
          totalCash: detailAfterBuy.totalCash,
          items: detailAfterBuy.items,
        }, transaction)
      }

      if (shouldRebalance && hasRebalanceTransaction) {
        rebalancedAt = tradeDate
        hasRebalanced = true
      }

      tradeDate = nextDate
    }

    if (shouldCommitTransaction) {
      await transaction.commit()
    } else {
      await transaction.rollback()
    }
  } catch (error) {
    await transaction.rollback()
    throw error
  }

  const traderTransaction = await databaseAdapter.createTransaction()
  try {
    // If not holding created or there is no start date, then save estimate date only
    if (!holding || !startedAt) {
      await traderModel.update(trader.id, { estimatedAt: latestDate }, traderTransaction)
      await traderTransaction.commit()
      return
    }

    // Regenerate tickerHolder records for current trader
    await tickerHolderModel.destroyTraderTickers(trader.id, traderTransaction)
    await runTool.asyncForEach(holding.items, async (
      item: interfaces.traderHoldingModel.Item,
    ) => {
      await tickerHolderModel.create({ tickerId: item.tickerId, traderId: trader.id }, traderTransaction)
    })

    const holdings = await traderHoldingModel.getAll(trader.id)
    const initialValue = constants.Trader.Initial.Cash
    const stats = await buildHoldingValueStats(env.entityId, startedAt, latestDate, initialValue, holdings)

    await traderModel.update(trader.id, {
      estimatedAt: latestDate,
      rebalancedAt: hasRebalanced ? rebalancedAt : undefined,
      startedAt,
      totalValue: stats.totalValue,
      totalDays: stats.totalDays,
      grossPercentNumber: stats.grossPercentNumber,
      yearlyPercentNumber: stats.yearlyPercentNumber,
      pastYearPercentNumber: stats.pastYearPercentNumber,
      pastQuarterPercentNumber: stats.pastQuarterPercentNumber,
      pastMonthPercentNumber: stats.pastMonthPercentNumber,
      pastWeekPercentNumber: stats.pastWeekPercentNumber,
      rankingNumber: stats.rankingNumber,
      oneYearTrends: stats.oneYearTrends.join(','),
      oneDecadeTrends: stats.oneDecadeTrends.join(','),
    }, traderTransaction)

    await traderTransaction.commit()
  } catch (error) {
    await traderTransaction.rollback()
    throw error
  }
}

export const calcAllTraderPerformances = async (
  forceRecheck: boolean,
  checkAll: boolean,
) => {
  const entities = await entityModel.getAll()

  await runTool.asyncForEach(entities, async (entity: interfaces.entityModel.Record) => {
    const latestDate = await dailyTickersModel.getLatestDate(entity.id)
    const delistedTickers = await tickerModel.getAllDelisted(entity.id)
    const delistedTickerIds = delistedTickers.map((ticker) => ticker.id)
    const latestPrices = await runTool.asyncMap(delistedTickerIds, async (tickerId: number) => {
      return tickerDailyModel.getLatest(tickerId)
    })
    const delistedLastPrices = latestPrices.reduce((lastPrices, tickerDaily) => {
      lastPrices[tickerDaily.tickerId] = tickerDaily
      return lastPrices
    }, {} as transactionLogic.DelistedLastPrices)

    const envs = await traderEnvModel.getAll(entity.id)

    await runTool.asyncForEach(envs, async (env: interfaces.traderEnvModel.Record) => {
      console.info(`Checking Env:${env.id}`)
      const traders = checkAll
        ? await traderModel.getAllByEnvId(env.id)
        : await traderModel.getActives(env.id)

      await runTool.asyncForEach(traders, async (trader: interfaces.traderModel.Record) => {
        await calcTraderPerformance(trader, env, forceRecheck, latestDate, delistedLastPrices)
      })
      // const deactivateTarget = await traderModel.getByRank(env.id, env.activeTotal)
      // const inactiveRankingNumber = deactivateTarget?.rankingNumber
      // if (inactiveRankingNumber) {
      //   await databaseAdapter.runWithTransaction(async (transaction) => {
      //     await traderModel.activateAllByRankingNumber(
      //       env.id,
      //       inactiveRankingNumber,
      //       transaction,
      //     )
      //     await traderModel.deactivateAllByRankingNumber(
      //       env.id,
      //       inactiveRankingNumber,
      //       transaction,
      //     )
      //   })
      // }
    })
  })
}

const calcEnvDescendants = async (
  envId: number,
  traders: interfaces.traderModel.Record[],
) => {
  const couples = traderLogic.groupTraderCouples(traders)
  const patternHashs: string[] = []

  const transaction = await databaseAdapter.createTransaction()
  try {
    let transactionUsed = false

    await runTool.asyncForEach(couples, async (
      couple: interfaces.traderModel.Record[],
    ) => {
      const firstTrader = couple[0]
      const secondTrader = couple.length > 1 ? couple[1] : couple[0]
      const shouldMutate = couple.length !== 2 || couple[0].id === couple[1].id

      const firstPattern = await traderPatternModel.getByPK(firstTrader.traderPatternId)
      const secondPattern = await traderPatternModel.getByPK(secondTrader.traderPatternId)

      const hasFollower = false

      const childOne = patternLogic.generatePatternChild(firstPattern!, secondPattern!, shouldMutate)
      if (!patternHashs.includes(childOne.hashCode)) {
        const patternOne = await traderPatternModel.createIfEmpty(childOne, transaction)
        patternHashs.push(patternOne.record.hashCode)
        const traderResult = await traderModel.createOrActive(
          envId,
          patternOne.record.id,
          firstTrader.id,
          secondTrader.id,
          shouldMutate,
          hasFollower,
          transaction,
        )
        if (!transactionUsed) {
          transactionUsed = patternOne.isNew || traderResult.isEdited
        }
      }

      const childTwo = patternLogic.generatePatternChild(firstPattern!, secondPattern!, shouldMutate)
      if (!patternHashs.includes(childTwo.hashCode)) {
        const patternTwo = await traderPatternModel.createIfEmpty(childTwo, transaction)
        patternHashs.push(patternTwo.record.hashCode)
        const traderResult = await traderModel.createOrActive(
          envId,
          patternTwo.record.id,
          firstTrader.id,
          secondTrader.id,
          shouldMutate,
          hasFollower,
          transaction,
        )
        if (!transactionUsed) {
          transactionUsed = patternTwo.isNew || traderResult.isEdited
        }
      }

      const childThree = patternLogic.generatePatternChild(firstPattern!, secondPattern!, shouldMutate)
      if (!patternHashs.includes(childThree.hashCode)) {
        const patternThree = await traderPatternModel.createIfEmpty(childThree, transaction)
        patternHashs.push(patternThree.record.hashCode)
        const traderResult = await traderModel.createOrActive(
          envId,
          patternThree.record.id,
          firstTrader.id,
          secondTrader.id,
          shouldMutate,
          hasFollower,
          transaction,
        )
        if (!transactionUsed) {
          transactionUsed = patternThree.isNew || traderResult.isEdited
        }
      }

      const childFour = patternLogic.generatePatternChild(firstPattern!, secondPattern!, shouldMutate)
      if (!patternHashs.includes(childFour.hashCode)) {
        const patternFour = await traderPatternModel.createIfEmpty(childFour, transaction)
        patternHashs.push(patternFour.record.hashCode)
        const traderResult = await traderModel.createOrActive(
          envId,
          patternFour.record.id,
          firstTrader.id,
          secondTrader.id,
          shouldMutate,
          hasFollower,
          transaction,
        )
        if (!transactionUsed) {
          transactionUsed = patternFour.isNew || traderResult.isEdited
        }
      }

      const childFive = patternLogic.generatePatternChild(firstPattern!, secondPattern!, true)
      if (!patternHashs.includes(childFive.hashCode)) {
        const patternFive = await traderPatternModel.createIfEmpty(childFive, transaction)
        patternHashs.push(patternFive.record.hashCode)
        const traderResult = await traderModel.createOrActive(
          envId,
          patternFive.record.id,
          firstTrader.id,
          secondTrader.id,
          true,
          hasFollower,
          transaction,
        )
        if (!transactionUsed) {
          transactionUsed = patternFive.isNew || traderResult.isEdited
        }
      }
    })

    if (transactionUsed) {
      await transaction.commit()
    } else {
      await transaction.rollback()
    }
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const calcAllEnvDescendants = async () => {
  const envs = await traderEnvModel.getAll()
  await runTool.asyncForEach(envs, async (env: interfaces.traderEnvModel.Record) => {
    console.info(`checking Env:${env.id}`)
    const isActive = await isActiveTraderEnv(env)
    if (!isActive) return

    const tops = await traderModel.getTops(30, { envId: env.id })
    const topTraders = [
      ...tops.yearly, ...tops.pastYear, ...tops.pastQuarter,
      ...tops.pastMonth, ...tops.pastWeek,
    ]
    if (topTraders.length <= 30) {
      const defaultTops = await traderModel.getTops(30, { envId: 1 })
      topTraders.push(
        ...defaultTops.yearly,
        ...defaultTops.pastYear,
        ...defaultTops.pastQuarter,
        ...defaultTops.pastMonth,
        ...defaultTops.pastWeek,
      )
    }
    await calcEnvDescendants(env.id, topTraders)
  })
}

export const calcTraderAccessHashs = async () => {
  const patterns = await traderPatternModel.getAll()
  const traders = await traderModel.getAll()

  const transaction = await databaseAdapter.createTransaction()
  try {
    await runTool.asyncForEach(patterns, async (pattern: interfaces.traderPatternModel.Record) => {
      const hashCode = helpers.toPatternHashCode(pattern)
      await traderPatternModel.update(pattern.id, { hashCode }, transaction)
    })

    await runTool.asyncForEach(traders, async (pattern: interfaces.traderModel.Record) => {
      const accessCode = generateTool.buildAccessHash(16)
      await traderModel.update(pattern.id, { accessCode }, transaction)
    })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
