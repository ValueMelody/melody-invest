import * as traderModel from '../models/trader'
import * as traderDNAModel from '../models/traderDNA'
import * as traderHoldingModel from '../models/traderHolding'
import * as tickerDailyModel from '../models/tickerDaily'
import * as tickerQuarterlyModel from '../models/tickerQuarterly'
import * as tickerYearlyModel from '../models/tickerYearly'
import * as indicatorYearlyModel from '../models/indicatorYearly'
import * as indicatorQuarterlyModel from '../models/indicatorQuarterly'
import * as indicatorMonthlyModel from '../models/indicatorMonthly'
import * as dateTool from '../tools/date'
import * as runTool from '../tools/run'
import * as dnaLogic from '../logics/dna'
import * as marketLogic from '../logics/market'
import * as errorEnum from '../enums/error'
import * as databaseAdapter from '../adapters/database'

interface HoldingDetails {
  totalCash: number,
  totalValue: number,
  holdings: traderHoldingModel.Holding[]
}

interface Target {
  daily: tickerDailyModel.Record;
  quarterly: tickerQuarterlyModel.Record | null;
  yearly: tickerYearlyModel.Record | null;
  yearlyIndicator: indicatorYearlyModel.Record | null;
}

interface Targets {
  [key: number]: Target
}

const calcTraderPerformance = async (trader: traderModel.Record) => {
  const dna = await traderDNAModel.getByPK(trader.traderDNAId)
  if (!dna) throw errorEnum.HTTP_ERRORS.NOT_FOUND

  const tickerMinPercent = dna.tickerMinPercent / 100
  const tickerMaxPercent = dna.tickerMaxPercent / 100
  const holdingBuyPercent = dna.holdingBuyPercent / 100
  const holdingSellPercent = dna.holdingSellPercent / 100
  const cashMaxPercent = dna.cashMaxPercent / 100

  const transaction = await databaseAdapter.createTransaction()
  try {
    let holding = await traderHoldingModel.getLatest(trader.id)
    let tradeDate = holding
      ? dateTool.getNextDate(holding.date, dna.tradeFrequency)
      : dateTool.getInitialDate()
    let rebalancedAt = trader.rebalancedAt || tradeDate
    let startedAt = trader.startedAt
    let hasRebalanced = false

    const today = dateTool.getCurrentDate()
    while (tradeDate <= today) {
      const dailyTargets = await tickerDailyModel.getByDate(tradeDate)
      const quarterlyTargets = await tickerQuarterlyModel.getPublishedByDate(tradeDate)
      const yearlyTargets = await tickerYearlyModel.getPublishedByDate(tradeDate)
      const monthlyIndicator = await indicatorMonthlyModel.getPublishedByDate(tradeDate)
      const quarterlyIndicator = await indicatorQuarterlyModel.getPublishedByDate(tradeDate)
      const yearlyIndicator = await indicatorYearlyModel.getPublishedByDate(tradeDate)

      const availableTargets: Targets = dailyTargets.reduce((tickers, daily) => {
        const quarterly = quarterlyTargets.find((quarterly) => quarterly.tickerId === daily.tickerId)
        const yearly = yearlyTargets.find((yearly) => yearly.tickerId === daily.tickerId)
        return {
          ...tickers,
          [daily.tickerId]: {
            daily,
            quarterly: quarterly || null,
            yearly: yearly || null,
            yearlyIndicator,
            monthlyIndicator,
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
        const holdingValue = matchedDaily ? holding.shares * matchedDaily.adjustedClosePrice : holding.value
        const updatedHolding = { tickerId: holding.tickerId, shares: holding.shares, value: holdingValue }
        return {
          totalValue: details.totalValue + holdingValue,
          totalCash: details.totalCash,
          holdings: [...details.holdings, updatedHolding],
        }
      }, detailsBeforeUpdate)

      let hasTransaction = false

      const maxCashValue = detailsAfterUpdate.totalValue * cashMaxPercent

      const shouldRebalance = dna.rebalanceFrequency && dateTool.getNextDate(rebalancedAt, dna.rebalanceFrequency) <= tradeDate
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
          const sharesSold = Math.ceil(sellValue / matchedDaily.adjustedClosePrice)
          const sharesLeft = holding.shares - sharesSold
          const cashAfterSell = details.totalCash + sharesSold * matchedDaily.adjustedClosePrice
          if (sharesLeft && cashAfterSell <= maxCashValue) {
            hasTransaction = true
            const holdingAfterSell = {
              tickerId: holding.tickerId,
              shares: sharesLeft,
              value: sharesLeft * matchedDaily.adjustedClosePrice,
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
        .filter(({ daily, quarterly, yearly, yearlyIndicator }) => {
          return holdingTickerIds.includes(daily.tickerId) &&
          dnaLogic.getPriceMovementSellWeights(
            dna, daily, quarterly, yearly, monthlyIndicator, quarterlyIndicator, yearlyIndicator,
          )
        })
        .sort((first, second) => {
          const firstWeight = dnaLogic.getPriceMovementSellWeights(
            dna, first.daily, first.quarterly, first.yearly, first.monthlyIndicator, first.quarterlyIndicator, first.yearlyIndicator,
          )
          const secondWeight = dnaLogic.getPriceMovementSellWeights(
            dna, second.daily, second.quarterly, second.yearly, second.monthlyIndicator, second.quarterlyIndicator, second.yearlyIndicator,
          )
          return firstWeight >= secondWeight ? -1 : 1
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
        const tickerPrice = matchedDaily ? matchedDaily.adjustedClosePrice : 0
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
          const holdingDetail = { tickerId: holding.tickerId, shares: sharesAfterSell, value: valueAfterSell }
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
        .filter(({
          daily, quarterly, yearly, monthlyIndicator, quarterlyIndicator, yearlyIndicator,
        }) => !!dnaLogic.getPriceMovementBuyWeights(
          dna, daily, quarterly, yearly, monthlyIndicator, quarterlyIndicator, yearlyIndicator,
        ))
        .sort((first, second) => {
          const firstWeight = dnaLogic.getPriceMovementBuyWeights(
            dna, first.daily, first.quarterly, first.yearly, first.monthlyIndicator, first.quarterlyIndicator, first.yearlyIndicator,
          )
          const secondWeight = dnaLogic.getPriceMovementBuyWeights(
            dna, second.daily, second.quarterly, second.yearly, second.monthlyIndicator, second.quarterlyIndicator, second.yearlyIndicator,
          )
          return firstWeight >= secondWeight ? -1 : 1
        })

      const detailsAfterBuy = buyTargets.reduce((details, { daily }) => {
        const maxCashToUse = details.totalCash < maxBuyAmount ? details.totalCash : maxBuyAmount
        const sharePrice = daily.adjustedClosePrice
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

        const holdingDetail = { tickerId: daily.tickerId, shares: sharesAfterBuy, value: valueAfterBuy }
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

      tradeDate = dateTool.getNextDate(tradeDate, dna.tradeFrequency)
    }

    if (!holding) return

    const latestDaily = await tickerDailyModel.getLatestAll()
    const latestDate = latestDaily.reduce((date, daily) => {
      if (!date) return daily.date
      return date < daily.date ? daily.date : date
    }, '')
    const totalValue = holding.holdings.reduce((total, holding) => {
      const matchedDaily = latestDaily.find((daily) => daily.tickerId === holding.tickerId)
      if (!matchedDaily) return total
      return total + matchedDaily.adjustedClosePrice * holding.shares
    }, holding.totalCash)
    const initialValue = marketLogic.getInitialCash()
    const totalEarning = totalValue - initialValue
    const totalDays = dateTool.getDurationCount(startedAt!, latestDate)
    const grossPercent = totalEarning * 100 / initialValue
    await traderModel.update(trader.id, {
      totalValue,
      estimatedAt: latestDate,
      rebalancedAt: hasRebalanced ? rebalancedAt : undefined,
      startedAt: startedAt ?? undefined,
      grossPercent: grossPercent.toFixed(2),
      yearlyPercent: (grossPercent * 365 / totalDays).toFixed(2),
      totalDays,
    }, transaction)

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const calcAllTradersPerformance = async () => {
  const traders = await traderModel.getActives()

  await runTool.asyncForEach(traders, async (trader: traderModel.Record) => {
    await calcTraderPerformance(trader)
  })
}

export const calcDescendant = async (): Promise<traderModel.Record[]> => {
  const topTraders = await traderModel.getTops(20)
  const couples = dnaLogic.groupDNACouples(topTraders)

  const transaction = await databaseAdapter.createTransaction()
  try {
    const newTraders = await runTool.asyncReduce(couples, async (
      allTraders: traderModel.Record[], couple: traderModel.Record[],
    ) => {
      const [firstTrader, secondTrader] = couple
      const firstDNA = await traderDNAModel.getByPK(firstTrader.traderDNAId)
      const secondDNA = await traderDNAModel.getByPK(secondTrader.traderDNAId)

      const childOne = dnaLogic.generateDNAChild(firstDNA!, secondDNA!)
      const dnaOne = await traderDNAModel.createIfEmpty(childOne, transaction)
      const traderOne = await traderModel.createOrActive(1, dnaOne.id, transaction)

      const childTwo = dnaLogic.generateDNAChild(firstDNA!, secondDNA!)
      const dnaTwo = await traderDNAModel.createIfEmpty(childTwo, transaction)
      const traderTwo = await traderModel.createOrActive(1, dnaTwo.id, transaction)

      const childThree = dnaLogic.generateDNAChild(firstDNA!, secondDNA!)
      const dnaThree = await traderDNAModel.createIfEmpty(childThree, transaction)
      const traderThree = await traderModel.createOrActive(1, dnaThree.id, transaction)

      const childFour = dnaLogic.generateDNAChild(firstDNA!, secondDNA!)
      const dnaFour = await traderDNAModel.createIfEmpty(childFour, transaction)
      const traderFour = await traderModel.createOrActive(1, dnaFour.id, transaction)

      const childFive = dnaLogic.generateDNAChild(firstDNA!, secondDNA!, true)
      const dnaFive = await traderDNAModel.createIfEmpty(childFive, transaction)
      const traderFive = await traderModel.createOrActive(1, dnaFive.id, transaction)

      return [...allTraders, traderOne, traderTwo, traderThree, traderFour, traderFive]
    })

    await transaction.commit()
    return newTraders
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
