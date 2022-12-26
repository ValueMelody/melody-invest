import * as constants from '@shared/constants'
import * as dailyTickersModel from 'models/dailyTickers'
import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as errorEnums from 'enums/error'
import * as evaluationLogic from 'logics/evaluation'
import * as generateTool from 'tools/generate'
import * as interfaces from '@shared/interfaces'
import * as patternLogic from 'logics/pattern'
import * as runTool from 'tools/run'
import * as tickerHolderModel from 'models/tickerHolder'
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

const calcTraderPerformance = async (
  targetTrader: interfaces.traderModel.Record,
  forceRecheck: boolean,
) => {
  const pattern = await traderPatternModel.getByPK(targetTrader.traderPatternId)
  if (!pattern) throw errorEnums.Custom.RecordNotFound

  const env = await traderEnvModel.getByPK(targetTrader.traderEnvId)
  if (!env) throw errorEnums.Custom.RecordNotFound

  const trader = forceRecheck
    ? await cleanupTrader(targetTrader.id)
    : targetTrader

  const tickerMinPercent = pattern.tickerMinPercent
  const tickerMaxPercent = pattern.tickerMaxPercent
  const holdingBuyPercent = pattern.holdingBuyPercent
  const holdingSellPercent = pattern.holdingSellPercent
  const cashMaxPercent = pattern.cashMaxPercent

  const latestDate = await dailyTickersModel.getLatestDate()
  console.info(`Checking Trader:${trader.id}`)
  if (trader.estimatedAt && trader.estimatedAt >= latestDate) return

  let holding = await traderHoldingModel.getLatest(trader.id)
  let tradeDate = holding
    ? dateTool.getNextDate(holding.date, pattern.tradeFrequency)
    : env.startDate
  let rebalancedAt = trader.rebalancedAt || tradeDate
  let startedAt = trader.startedAt
  let hasRebalanced = false
  let hasCreatedAnyRecord = false

  const transaction = await databaseAdapter.createTransaction()
  try {
    while (tradeDate <= latestDate) {
      const nextDate = dateTool.getNextDate(tradeDate, pattern.tradeFrequency)

      const dailyTickers = await dailyTickersModel.getByUK(tradeDate)
      if (!dailyTickers || !dailyTickers.tickers) {
        tradeDate = nextDate
        continue
      }

      const emptyDailyTickers: interfaces.dailyTickersModel.DailyTickers = {}
      const availableTargets = env.tickerIds
        ? env.tickerIds.reduce((tickers, tickerId) => {
          if (!dailyTickers.tickers) return tickers
          return {
            ...tickers,
            [tickerId]: dailyTickers.tickers[tickerId],
          }
        }, emptyDailyTickers)
        : dailyTickers.tickers

      const totalCash = holding ? holding.totalCash : constants.Trader.Initial.Cash
      const items = holding ? holding.items : []

      const detailsAfterUpdate = transactionLogic.detailFromCashAndItems(
        totalCash, items, availableTargets,
      )

      const shouldRebalance =
        !!pattern.rebalanceFrequency &&
        dateTool.getNextDate(rebalancedAt, pattern.rebalanceFrequency) <= tradeDate

      const maxCashValue = detailsAfterUpdate.totalValue * cashMaxPercent / 100
      const {
        holdingDetail: detailAfterRebalance,
        hasTransaction: hasRebalanceTransaction,
      } = transactionLogic.detailAfterRebalance(
        shouldRebalance,
        detailsAfterUpdate,
        availableTargets,
        tickerMinPercent,
        tickerMaxPercent,
        maxCashValue,
      )

      const holdingTickerIds = detailAfterRebalance.items.map((item) => item.tickerId)
      const sellTickerEvaluations = evaluationLogic.getTickerSellEaluations(
        holdingTickerIds, pattern, availableTargets,
      )
      const sellTickerIds = sellTickerEvaluations.map((sellTickerEvaluation) => sellTickerEvaluation.tickerId)

      const {
        holdingDetail: detailAfterSell,
        hasTransaction: hasSellTransaction,
      } = transactionLogic.detailAfterSell(
        detailAfterRebalance,
        sellTickerIds,
        availableTargets,
        holdingSellPercent,
        tickerMinPercent,
        maxCashValue,
      )

      const buyTickerEvaluations = evaluationLogic.getTickerBuyEaluations(
        Object.keys(availableTargets).map((id) => parseInt(id)),
        pattern,
        availableTargets,
      )
      const buyTickerIds = buyTickerEvaluations.map((evaluation) => evaluation.tickerId)

      const maxBuyAmount = detailAfterSell.totalValue * holdingBuyPercent / 100
      const {
        holdingDetail: detailAfterBuy,
        hasTransaction: hasBuyTransaction,
      } = transactionLogic.detailAfterBuy(
        detailAfterSell,
        buyTickerIds,
        availableTargets,
        maxBuyAmount,
        tickerMaxPercent,
      )

      if (shouldRebalance && hasRebalanceTransaction) {
        rebalancedAt = tradeDate
        hasRebalanced = true
      }

      const hasTransaction = hasRebalanceTransaction || hasSellTransaction || hasBuyTransaction
      if (hasTransaction) {
        hasCreatedAnyRecord = true
        if (!startedAt) startedAt = tradeDate
        holding = await traderHoldingModel.create({
          traderId: trader.id,
          date: tradeDate,
          totalValue: detailAfterBuy.totalValue,
          totalCash: detailAfterBuy.totalCash,
          items: detailAfterBuy.items,
        }, transaction)
      }

      tradeDate = nextDate
    }

    if (hasCreatedAnyRecord) {
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
    if (!holding || !startedAt) {
      await traderModel.update(trader.id, { estimatedAt: latestDate }, traderTransaction)
      await traderTransaction.commit()
      return
    }

    await tickerHolderModel.destroyTraderTickers(trader.id, traderTransaction)
    await runTool.asyncForEach(holding.items, async (
      item: interfaces.traderHoldingModel.Item,
    ) => {
      await tickerHolderModel.create({ tickerId: item.tickerId, traderId: trader.id }, traderTransaction)
    })

    const holdings = await traderHoldingModel.getAll(trader.id)
    const initialValue = constants.Trader.Initial.Cash
    const stats = await buildHoldingValueStats(startedAt, latestDate, initialValue, holdings)

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

export const calcAllTraderPerformances = async (forceRecheck: boolean) => {
  const envs = await traderEnvModel.getAll()
  await runTool.asyncForEach(envs, async (env: interfaces.traderEnvModel.Record) => {
    console.info(`Checking Env:${env.id}`)
    const traders = await traderModel.getActives(env.id)
    await runTool.asyncForEach(traders, async (trader: interfaces.traderModel.Record) => {
      await calcTraderPerformance(trader, forceRecheck)
    })
    const deactivateTarget = await traderModel.getByRank(env.id, env.activeTotal)
    const inactiveRankingNumber = deactivateTarget?.rankingNumber
    if (inactiveRankingNumber) {
      await databaseAdapter.runWithTransaction(async (transaction) => {
        await traderModel.activateAllByRankingNumber(
          env.id,
          inactiveRankingNumber,
          transaction,
        )
        await traderModel.deactivateAllByRankingNumber(
          env.id,
          inactiveRankingNumber,
          transaction,
        )
      })
    }
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
      const hashCode = patternLogic.getPatternHashCode(pattern)
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
