import * as interfaces from '@shared/interfaces'
import * as traderModel from '../models/trader'
import * as traderEnvModel from '../models/traderEnv'
import * as traderPatternModel from '../models/traderPattern'
import * as traderHoldingModel from '../models/traderHolding'
import * as tickerHolderModel from '../models/tickerHolder'
import * as tickerDailyModel from '../models/tickerDaily'
import * as dailyTickersModel from '../models/dailyTickers'
import * as dateTool from '../tools/date'
import * as runTool from '../tools/run'
import * as generateTool from '../tools/generate'
import * as patternLogic from '../logics/pattern'
import * as traderLogic from '../logics/trader'
import * as transactionLogic from '../logics/transaction'
import * as evaluationLogic from '../logics/evaluation'
import * as holdingLogic from '../logics/holding'
import * as errorEnums from '../enums/error'
import * as databaseAdapter from '../adapters/database'

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
  if (!pattern) throw errorEnums.CUSTOM.FOREIGN_RECORD_MISSING

  const env = await traderEnvModel.getByPK(targetTrader.traderEnvId)
  if (!env) throw errorEnums.CUSTOM.FOREIGN_RECORD_MISSING

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

      const totalCash = holding ? holding.totalCash : holdingLogic.getInitialCash()
      const holdings = holding ? holding.holdings : []

      const detailsAfterUpdate = transactionLogic.detailsFromCashAndHoldings(
        totalCash, holdings, availableTargets,
      )

      const shouldRebalance =
        !!pattern.rebalanceFrequency &&
        dateTool.getNextDate(rebalancedAt, pattern.rebalanceFrequency) <= tradeDate

      const maxCashValue = detailsAfterUpdate.totalValue * cashMaxPercent / 100
      const {
        holdingDetails: detailsAfterRebalance,
        hasTransaction: hasRebalanceTransaction,
      } = transactionLogic.detailsAfterRebalance(
        shouldRebalance,
        detailsAfterUpdate,
        availableTargets,
        tickerMinPercent,
        tickerMaxPercent,
        maxCashValue,
      )

      const holdingTickerIds = detailsAfterRebalance.holdings.map((holding) => holding.tickerId)
      const sellTickerEvaluations = evaluationLogic.getTickerSellEaluations(
        holdingTickerIds, pattern, availableTargets,
      )
      const sellTickerIds = sellTickerEvaluations.map((sellTickerEvaluation) => sellTickerEvaluation.tickerId)

      const {
        holdingDetails: detailsAfterSell,
        hasTransaction: hasSellTransaction,
      } = transactionLogic.detailsAfterSell(
        detailsAfterRebalance,
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

      const maxBuyAmount = detailsAfterSell.totalValue * holdingBuyPercent / 100
      const {
        holdingDetails: detailsAfterBuy,
        hasTransaction: hasBuyTransaction,
      } = transactionLogic.detailsAfterBuy(
        detailsAfterSell,
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
          totalValue: detailsAfterBuy.totalValue,
          totalCash: detailsAfterBuy.totalCash,
          holdings: detailsAfterBuy.holdings,
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
    if (!holding) {
      await traderModel.update(trader.id, { estimatedAt: latestDate }, traderTransaction)
      await traderTransaction.commit()
      return
    }

    await tickerHolderModel.destroyTraderTickers(trader.id, traderTransaction)
    await runTool.asyncForEach(holding.holdings, async (
      holding: interfaces.traderHoldingModel.Holding,
    ) => {
      await tickerHolderModel.create({ tickerId: holding.tickerId, traderId: trader.id }, traderTransaction)
    })

    const dailyPrices = await tickerDailyModel.getAllLatestByDate(latestDate)
    const totalValue = holdingLogic.getHoldingTotalValue(holding, dailyPrices)
    const initialValue = holdingLogic.getInitialCash()
    const totalDays = dateTool.getDurationCount(startedAt!, latestDate)
    const grossPercent = generateTool.getChangePercent(totalValue, initialValue)

    const pastWeek = dateTool.getPreviousDate(latestDate, 7)
    const pastWeekPrices = await tickerDailyModel.getAllLatestByDate(pastWeek)
    const pastWeekHolding = await traderHoldingModel.getLatestByDate(trader.id, pastWeek)
    const pastWeekValue = pastWeekHolding
      ? holdingLogic.getHoldingTotalValue(pastWeekHolding, pastWeekPrices)
      : null

    const pastMonth = dateTool.getPreviousDate(latestDate, 30)
    const pastMonthPrices = await tickerDailyModel.getAllLatestByDate(pastMonth)
    const pastMonthHolding = await traderHoldingModel.getLatestByDate(trader.id, pastMonth)
    const pastMonthValue = pastMonthHolding
      ? holdingLogic.getHoldingTotalValue(pastMonthHolding, pastMonthPrices)
      : null

    const pastQuarter = dateTool.getPreviousDate(latestDate, 91)
    const pastQuarterPrices = await tickerDailyModel.getAllLatestByDate(pastQuarter)
    const pastQuarterHolding = await traderHoldingModel.getLatestByDate(trader.id, pastQuarter)
    const pastQuarterValue = pastQuarterHolding
      ? holdingLogic.getHoldingTotalValue(pastQuarterHolding, pastQuarterPrices)
      : null

    const pastYear = dateTool.getPreviousDate(latestDate, 365)
    const pastYearPrices = await tickerDailyModel.getAllLatestByDate(pastYear)
    const pastYearHolding = await traderHoldingModel.getLatestByDate(trader.id, pastYear)
    const pastYearValue = pastYearHolding
      ? holdingLogic.getHoldingTotalValue(pastYearHolding, pastYearPrices)
      : null

    const pastYearPercentNumber = pastYearValue
      ? generateTool.getChangePercent(totalValue, pastYearValue)
      : null
    const pastQuarterPercentNumber = pastQuarterValue
      ? generateTool.getChangePercent(totalValue, pastQuarterValue)
      : null
    const pastMonthPercentNumber = pastMonthValue
      ? generateTool.getChangePercent(totalValue, pastMonthValue)
      : null
    const pastWeekPercentNumber = pastWeekValue
      ? generateTool.getChangePercent(totalValue, pastWeekValue)
      : null

    await traderModel.update(trader.id, {
      totalValue,
      estimatedAt: latestDate,
      rebalancedAt: hasRebalanced ? rebalancedAt : undefined,
      startedAt: startedAt ?? undefined,
      totalDays,
      grossPercentNumber: Math.floor(grossPercent),
      yearlyPercentNumber: Math.floor(grossPercent * 365 / totalDays),
      pastYearPercentNumber,
      pastQuarterPercentNumber,
      pastMonthPercentNumber,
      pastWeekPercentNumber,
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
