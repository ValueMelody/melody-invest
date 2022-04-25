import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as traderModel from '../models/trader'
import * as traderEnvModel from '../models/traderEnv'
import * as traderPatternModel from '../models/traderPattern'
import * as traderHoldingModel from '../models/traderHolding'
import * as tickerHolderModel from '../models/tickerHolder'
import * as dailyTickersModel from '../models/dailyTickers'
import * as dateTool from '../tools/date'
import * as runTool from '../tools/run'
import * as patternLogic from '../logics/pattern'
import * as transactionLogic from '../logics/transaction'
import * as evaluationLogic from '../logics/evaluation'
import * as errorEnums from '../enums/error'
import * as databaseAdapter from '../adapters/database'
import buildHoldingValueStats from './shared/buildHoldingValueStats'

const cleanupTrader = async (traderId: number): Promise<interfaces.traderModel.Record> => {
  const transaction = await databaseAdapter.createTransaction()
  try {
    await tickerHolderModel.destroyTraderTickers(traderId, transaction)
    await traderHoldingModel.destroyTraderHoldings(traderId, transaction)
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
  console.info(`Checking ${trader.id}`)
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

      const availableTargets = dailyTickers.tickers

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

    if (hasCreatedAnyRecord) await transaction.commit()
  } catch (error) {
    if (hasCreatedAnyRecord) await transaction.rollback()
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
      oneYearTrends: stats.oneYearTrends.join(','),
      oneDecadeTrends: stats.oneDecadeTrends.join(','),
    }, traderTransaction)

    await traderTransaction.commit()
  } catch (error) {
    await traderTransaction.rollback()
    throw error
  }
}

export const calcAllTradersPerformance = async (forceRecheck: boolean) => {
  const traders = await traderModel.getActives()

  await runTool.asyncForEach(traders, async (trader: interfaces.traderModel.Record) => {
    await calcTraderPerformance(trader, forceRecheck)
  })
}

const calcEnvDescendants = async (envId: number, traders: interfaces.traderModel.Record[]) => {
  const couples = patternLogic.groupPatternCouples(traders)
  const patternHashs: string[] = []

  const transaction = await databaseAdapter.createTransaction()
  try {
    const newTraders = await runTool.asyncForEach(couples, async (
      couple: interfaces.traderModel.Record[],
    ) => {
      const firstTrader = couple[0]
      const secondTrader = couple.length > 1 ? couple[1] : couple[0]
      const shouldMutate = couple.length !== 2 || couple[0].id === couple[1].id

      const firstPattern = await traderPatternModel.getByPK(firstTrader.traderPatternId)
      const secondPattern = await traderPatternModel.getByPK(secondTrader.traderPatternId)

      const childOne = patternLogic.generatePatternChild(firstPattern!, secondPattern!, shouldMutate)
      const patternOne = await traderPatternModel.createIfEmpty(childOne, transaction)
      patternHashs.push(patternOne.hashCode)
      await traderModel.createOrActive(envId, patternOne.id, transaction)

      const childTwo = patternLogic.generatePatternChild(firstPattern!, secondPattern!, shouldMutate)
      if (!patternHashs.includes(childTwo.hashCode)) {
        const patternTwo = await traderPatternModel.createIfEmpty(childTwo, transaction)
        patternHashs.push(patternTwo.hashCode)
        await traderModel.createOrActive(envId, patternTwo.id, transaction)
      }

      const childThree = patternLogic.generatePatternChild(firstPattern!, secondPattern!, shouldMutate)
      if (!patternHashs.includes(childThree.hashCode)) {
        const patternThree = await traderPatternModel.createIfEmpty(childThree, transaction)
        patternHashs.push(patternThree.hashCode)
        await traderModel.createOrActive(envId, patternThree.id, transaction)
      }

      const childFour = patternLogic.generatePatternChild(firstPattern!, secondPattern!, shouldMutate)
      if (!patternHashs.includes(childFour.hashCode)) {
        const patternFour = await traderPatternModel.createIfEmpty(childFour, transaction)
        patternHashs.push(patternFour.hashCode)
        await traderModel.createOrActive(envId, patternFour.id, transaction)
      }

      const childFive = patternLogic.generatePatternChild(firstPattern!, secondPattern!, true)
      if (!patternHashs.includes(childFive.hashCode)) {
        const patternFive = await traderPatternModel.createIfEmpty(childFive, transaction)
        patternHashs.push(patternFive.hashCode)
        await traderModel.createOrActive(envId, patternFive.id, transaction)
      }
    })

    await transaction.commit()
    return newTraders
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const calcAllEnvDescendants = async () => {
  const envs = await traderEnvModel.getAll()
  await runTool.asyncForEach(envs, async (env: interfaces.traderEnvModel.Record) => {
    const tops = await traderModel.getTops(30, { envId: env.id })
    const topTraders = [
      ...tops.yearly, ...tops.pastYear, ...tops.pastQuarter, ...tops.pastMonth, ...tops.pastWeek,
    ]
    if (!topTraders.length) return
    await calcEnvDescendants(env.id, topTraders)
  })
}
