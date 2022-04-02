import * as interfaces from '@shared/interfaces'
import * as traderModel from '../models/trader'
import * as traderEnvModel from '../models/traderEnv'
import * as traderPatternModel from '../models/traderPattern'
import * as traderHoldingModel from '../models/traderHolding'
import * as tickerDailyModel from '../models/tickerDaily'
import * as tickerQuarterlyModel from '../models/tickerQuarterly'
import * as tickerYearlyModel from '../models/tickerYearly'
import * as indicatorYearlyModel from '../models/indicatorYearly'
import * as indicatorQuarterlyModel from '../models/indicatorQuarterly'
import * as indicatorMonthlyModel from '../models/indicatorMonthly'
import * as dateTool from '../tools/date'
import * as runTool from '../tools/run'
import * as generateTool from '../tools/generate'
import * as patternLogic from '../logics/pattern'
import * as marketLogic from '../logics/market'
import * as errorEnums from '../enums/error'
import * as databaseAdapter from '../adapters/database'

interface HoldingDetails {
  totalCash: number,
  totalValue: number,
  holdings: interfaces.traderHoldingModel.Holding[]
}

interface Target {
  daily: interfaces.tickerDailyModel.Record;
  quarterly: interfaces.tickerQuarterlyModel.Record | null;
  yearly: interfaces.tickerYearlyModel.Record | null;
}

interface Targets {
  [tickerId: number]: Target
}

interface QuarterlyHashmap {
  [tickerId: number]: interfaces.tickerQuarterlyModel.Record
}

interface YearlyHashmap {
  [tickerId: number]: interfaces.tickerYearlyModel.Record
}

const getHoldingValue = (
  holding: HoldingDetails,
  dailys: interfaces.tickerDailyModel.Record[],
): number => {
  return holding.holdings.reduce((total, holding) => {
    const matchedDaily = dailys.find((daily) => daily.tickerId === holding.tickerId)
    if (!matchedDaily) return total
    const combined = total + matchedDaily.closePrice * matchedDaily.splitMultiplier * holding.shares
    return Math.floor(combined)
  }, holding.totalCash)
}

const calcTraderPerformance = async (trader: interfaces.traderModel.Record) => {
  const pattern = await traderPatternModel.getByPK(trader.traderPatternId)
  if (!pattern) throw errorEnums.CUSTOM.FOREIGN_RECORD_MISSING

  const env = await traderEnvModel.getByPK(trader.traderEnvId)
  if (!env) throw errorEnums.CUSTOM.FOREIGN_RECORD_MISSING

  const tickerMinPercent = pattern.tickerMinPercent / 100
  const tickerMaxPercent = pattern.tickerMaxPercent / 100
  const holdingBuyPercent = pattern.holdingBuyPercent / 100
  const holdingSellPercent = pattern.holdingSellPercent / 100
  const cashMaxPercent = pattern.cashMaxPercent / 100

  const latestDate = await tickerDailyModel.getLatestDate()
  console.log(trader.id)
  if (trader.estimatedAt && trader.estimatedAt >= latestDate) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    let holding = await traderHoldingModel.getLatest(trader.id)
    let tradeDate = holding
      ? dateTool.getNextDate(holding.date, pattern.tradeFrequency)
      : env.startDate
    let rebalancedAt = trader.rebalancedAt || tradeDate
    let startedAt = trader.startedAt
    let hasRebalanced = false

    while (tradeDate <= latestDate) {
      const dailyTargets = await tickerDailyModel.getByDate(tradeDate, env.tickerIds)
      const quarterlyTargets = await tickerQuarterlyModel.getPublishedByDate(tradeDate)
      const initialQuarterlys: QuarterlyHashmap = {}
      const quarterlys = quarterlyTargets.reduce((quarterlys, quarterly) => ({
        ...quarterlys,
        [quarterly.tickerId]: quarterly,
      }), initialQuarterlys)
      const yearlyTargets = await tickerYearlyModel.getPublishedByDate(tradeDate)
      const initialYearlys: YearlyHashmap = {}
      const yearlys = yearlyTargets.reduce((yearlys, yearly) => ({
        ...yearlys,
        [yearly.tickerId]: yearly,
      }), initialYearlys)
      const monthlyIndicator = await indicatorMonthlyModel.getPublishedByDate(tradeDate)
      const quarterlyIndicator = await indicatorQuarterlyModel.getPublishedByDate(tradeDate)
      const yearlyIndicator = await indicatorYearlyModel.getPublishedByDate(tradeDate)

      const availableTargets: Targets = dailyTargets.reduce((tickers, daily) => {
        const quarterly = quarterlys[daily.tickerId] || null
        const yearly = yearlys[daily.tickerId] || null
        const tickerInfo = patternLogic.buildInitialTickerInfo(
          daily, quarterly, yearly, monthlyIndicator, quarterlyIndicator, yearlyIndicator,
        )

        return {
          ...tickers,
          [daily.tickerId]: {
            tickerInfo,
            daily,
            quarterly,
            yearly,
          },
        }
      }, {})

      const totalCash = holding ? holding.totalCash : marketLogic.getInitialCash()
      const holdings = holding ? holding.holdings : []

      const detailsBeforeUpdate: HoldingDetails = {
        totalValue: totalCash, totalCash, holdings: [],
      }
      const detailsAfterUpdate = holdings.reduce((details, holding) => {
        const matched = availableTargets[holding.tickerId]
        const matchedDaily = matched?.daily
        const holdingValue = matchedDaily
          ? holding.shares * matchedDaily.closePrice * matchedDaily.splitMultiplier
          : holding.value
        const value = Math.floor(holdingValue)
        const splitMultiplier = matchedDaily?.splitMultiplier || holding.splitMultiplier
        const updatedHolding = {
          tickerId: holding.tickerId,
          shares: holding.shares,
          value,
          splitMultiplier,
        }
        return {
          totalValue: details.totalValue + value,
          totalCash: details.totalCash,
          holdings: [...details.holdings, updatedHolding],
        }
      }, detailsBeforeUpdate)

      let hasTransaction = false

      const maxCashValue = detailsAfterUpdate.totalValue * cashMaxPercent

      const shouldRebalance = pattern.rebalanceFrequency &&
        dateTool.getNextDate(rebalancedAt, pattern.rebalanceFrequency) <= tradeDate
      const detailsBeforeRebalance: HoldingDetails = {
        totalValue: detailsAfterUpdate.totalValue,
        totalCash: detailsAfterUpdate.totalCash,
        holdings: [],
      }
      const detailsAfterRebalance = detailsAfterUpdate.holdings.reduce((details, holding) => {
        const matched = availableTargets[holding.tickerId]
        const matchedDaily = matched?.daily
        const holdingPercent = holding.value / details.totalValue
        const isMoreThanMaxPercent = matchedDaily && holdingPercent > tickerMaxPercent
        const isLessThanMinPercent = matchedDaily && holdingPercent < tickerMinPercent

        if (shouldRebalance && isLessThanMinPercent) {
          const cashAfterSell = details.totalCash + holding.value
          if (cashAfterSell <= maxCashValue) {
            hasTransaction = true
            return {
              totalValue: details.totalValue,
              totalCash: cashAfterSell,
              holdings: details.holdings.filter((hold) => hold.tickerId !== holding.tickerId),
            }
          }
        }

        if (shouldRebalance && isMoreThanMaxPercent) {
          const sellPercent = holdingPercent - tickerMaxPercent
          const sellValue = details.totalValue * sellPercent
          const dailyFinalPrice = Math.floor(matchedDaily.closePrice * matchedDaily.splitMultiplier)
          const sharesSold = Math.ceil(sellValue / dailyFinalPrice)
          const sharesLeft = holding.shares - sharesSold
          const cashAfterSell = details.totalCash + sharesSold * dailyFinalPrice
          if (sharesLeft && cashAfterSell <= maxCashValue) {
            hasTransaction = true
            const holdingAfterSell = {
              tickerId: holding.tickerId,
              shares: sharesLeft,
              value: Math.floor(sharesLeft * dailyFinalPrice),
              splitMultiplier: matchedDaily.splitMultiplier,
            }
            return {
              totalValue: details.totalValue,
              totalCash: cashAfterSell,
              holdings: [...details.holdings, holdingAfterSell],
            }
          }
        }

        return {
          totalValue: details.totalValue,
          totalCash: details.totalCash,
          holdings: [...details.holdings, holding],
        }
      }, detailsBeforeRebalance)

      const holdingTickerIds = detailsAfterRebalance.holdings.map((holding) => holding.tickerId)
      const sellTickerIds = Object.values(availableTargets)
        .filter(({ daily, quarterly, yearly, tickerInfo }) => {
          if (!holdingTickerIds.includes(daily.tickerId)) return false

          const preferValue = patternLogic.getTickerPreferValue(
            pattern.sellPreference, daily, quarterly, yearly,
          )
          if (preferValue === null) return false

          const hasWeight = patternLogic.getPriceMovementSellWeights(pattern, tickerInfo)
          if (!hasWeight) return false

          return true
        })
        .sort((first, second) => {
          const firstWeight = patternLogic.getPriceMovementSellWeights(
            pattern, first.tickerInfo,
          )
          const secondWeight = patternLogic.getPriceMovementSellWeights(
            pattern, second.tickerInfo,
          )
          if (firstWeight > secondWeight) return -1
          if (firstWeight < secondWeight) return 1

          const firstPreferValue = patternLogic.getTickerPreferValue(
            pattern.sellPreference, first.daily, first.quarterly, first.yearly,
          )
          const secondPreferValue = patternLogic.getTickerPreferValue(
            pattern.sellPreference, second.daily, second.quarterly, second.yearly,
          )
          return firstPreferValue! >= secondPreferValue! ? -1 : 1
        })
        .map(({ daily }) => daily.tickerId)

      const detailsBeforeSell: HoldingDetails = {
        totalValue: detailsAfterRebalance.totalValue,
        totalCash: detailsAfterRebalance.totalCash,
        holdings: [],
      }
      const detailsAfterSell = detailsAfterRebalance.holdings.reduce((details, holding) => {
        const isSellTarget = sellTickerIds.includes(holding.tickerId)
        const matched = availableTargets[holding.tickerId]
        const matchedDaily = matched?.daily
        const sharesSold = matchedDaily ? Math.floor(holding.shares * holdingSellPercent) : 0
        const tickerPrice = Math.floor(matchedDaily ? matchedDaily.closePrice * matchedDaily.splitMultiplier : 0)
        const valueSold = sharesSold * tickerPrice
        const percentAfterSell = holding.value - valueSold / details.totalValue
        const cashAfterSell = details.totalCash + valueSold
        const isMoreThanMinPercent = percentAfterSell > tickerMinPercent
        const isLessThanMaxCash = cashAfterSell < maxCashValue

        const allowSell = isSellTarget && sharesSold && isLessThanMaxCash && isMoreThanMinPercent

        if (allowSell) {
          hasTransaction = true
          const sharesAfterSell = holding.shares - sharesSold
          const valueAfterSell = sharesAfterSell * tickerPrice
          const holdingDetail = {
            tickerId: holding.tickerId,
            shares: sharesAfterSell,
            value: valueAfterSell,
            splitMultiplier: matchedDaily.splitMultiplier,
          }
          const holdings = sharesAfterSell ? [...details.holdings, holdingDetail] : details.holdings
          return {
            totalValue: details.totalValue,
            totalCash: cashAfterSell,
            holdings,
          }
        }

        return {
          totalValue: details.totalValue,
          totalCash: details.totalCash,
          holdings: [...details.holdings, holding],
        }
      }, detailsBeforeSell)

      const maxBuyAmount = detailsAfterSell.totalValue * holdingBuyPercent

      const buyTargets: Target[] = Object.values(availableTargets)
        .filter(({ daily, quarterly, yearly, tickerInfo }) => {
          const preferValue = patternLogic.getTickerPreferValue(
            pattern.buyPreference, daily, quarterly, yearly,
          )
          if (preferValue === null) return false

          return !!patternLogic.getPriceMovementBuyWeights(pattern, tickerInfo)
        })
        .sort((first, second) => {
          const firstWeight = patternLogic.getPriceMovementBuyWeights(
            pattern, first.tickerInfo,
          )
          const secondWeight = patternLogic.getPriceMovementBuyWeights(
            pattern, second.tickerInfo,
          )
          if (firstWeight > secondWeight) return -1
          if (firstWeight < secondWeight) return 1

          const firstPreferValue = patternLogic.getTickerPreferValue(
            pattern.buyPreference, first.daily, first.quarterly, first.yearly,
          )
          const secondPreferValue = patternLogic.getTickerPreferValue(
            pattern.buyPreference, second.daily, second.quarterly, second.yearly,
          )
          return firstPreferValue! >= secondPreferValue! ? -1 : 1
        })

      const detailsAfterBuy = buyTargets.reduce((details, { daily }) => {
        const maxCashToUse = details.totalCash < maxBuyAmount ? details.totalCash : maxBuyAmount
        const sharePrice = Math.floor(daily.closePrice * daily.splitMultiplier)
        const sharesBought = Math.floor(maxCashToUse / sharePrice)
        if (!sharesBought) return details

        const holdingIndex = details.holdings.findIndex((holding) => holding.tickerId === daily.tickerId)
        const isNewHolding = holdingIndex === -1
        const sharesAfterBuy = isNewHolding ? sharesBought : sharesBought + details.holdings[holdingIndex].shares
        const valueAfterBuy = sharesAfterBuy * sharePrice
        const percentAfterBuy = valueAfterBuy / details.totalValue
        const isLessThanMaxPercent = percentAfterBuy < tickerMaxPercent
        if (!isLessThanMaxPercent) return details

        hasTransaction = true

        const holdingDetail = {
          tickerId: daily.tickerId,
          shares: sharesAfterBuy,
          value: valueAfterBuy,
          splitMultiplier: daily.splitMultiplier,
        }
        const holdings = isNewHolding
          ? [...details.holdings, holdingDetail]
          : details.holdings.map((holding, index) => index === holdingIndex ? holdingDetail : holding)
        return {
          totalValue: details.totalValue,
          totalCash: details.totalCash - sharePrice * sharesBought,
          holdings,
        }
      }, detailsAfterSell)

      if (shouldRebalance) {
        rebalancedAt = tradeDate
        hasRebalanced = true
      }

      if (hasTransaction) {
        if (!startedAt) startedAt = tradeDate
        holding = await traderHoldingModel.create({
          traderId: trader.id,
          date: tradeDate,
          totalValue: detailsAfterBuy.totalValue,
          totalCash: detailsAfterBuy.totalCash,
          holdings: detailsAfterBuy.holdings,
        }, transaction)
      }

      tradeDate = dateTool.getNextDate(tradeDate, pattern.tradeFrequency)
    }

    if (!holding) {
      if (trader.estimatedAt !== latestDate) {
        await traderModel.update(trader.id, { estimatedAt: latestDate }, transaction)
        await transaction.commit()
      }
      return
    }

    const latestDailys = await tickerDailyModel.getAllLatestByDate(latestDate)
    const totalValue = getHoldingValue(holding, latestDailys)
    const initialValue = marketLogic.getInitialCash()
    const totalDays = dateTool.getDurationCount(startedAt!, latestDate)
    const grossPercent = generateTool.getChangePercent(totalValue, initialValue)

    const pastWeek = dateTool.getPreviousDate(latestDate, 7)
    const pastWeekDailys = await tickerDailyModel.getAllLatestByDate(pastWeek)
    const pastWeekValue = getHoldingValue(holding, pastWeekDailys)

    const pastMonth = dateTool.getPreviousDate(latestDate, 30)
    const pastMonthDailys = await tickerDailyModel.getAllLatestByDate(pastMonth)
    const pastMonthValue = getHoldingValue(holding, pastMonthDailys)

    const pastQuarter = dateTool.getPreviousDate(latestDate, 91)
    const pastQuarterDailys = await tickerDailyModel.getAllLatestByDate(pastQuarter)
    const pastQuarterValue = getHoldingValue(holding, pastQuarterDailys)

    const pastYear = dateTool.getPreviousDate(latestDate, 365)
    const pastYearDailys = await tickerDailyModel.getAllLatestByDate(pastYear)
    const pastYearValue = getHoldingValue(holding, pastYearDailys)

    await traderModel.update(trader.id, {
      totalValue,
      estimatedAt: latestDate,
      rebalancedAt: hasRebalanced ? rebalancedAt : undefined,
      startedAt: startedAt ?? undefined,
      totalDays,
      grossPercentNumber: Math.floor(grossPercent),
      yearlyPercentNumber: Math.floor(grossPercent * 365 / totalDays),
      pastYearPercentNumber: generateTool.getChangePercent(totalValue, pastYearValue),
      pastQuarterPercentNumber: generateTool.getChangePercent(totalValue, pastQuarterValue),
      pastMonthPercentNumber: generateTool.getChangePercent(totalValue, pastMonthValue),
      pastWeekPercentNumber: generateTool.getChangePercent(totalValue, pastWeekValue),
    }, transaction)

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const calcAllTradersPerformance = async () => {
  const traders = await traderModel.getActives()

  await runTool.asyncForEach(traders, async (trader: interfaces.traderModel.Record) => {
    await calcTraderPerformance(trader)
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
    const tops = await traderModel.getTops(env.id, 30)
    const topTraders = [
      ...tops.yearly, ...tops.pastYear, ...tops.pastQuarter, ...tops.pastMonth, ...tops.pastWeek,
    ]
    if (!topTraders.length) return
    await calcEnvDescendants(env.id, topTraders)
  })
}
