import * as traderModel from '../models/trader'
import * as traderDNAModel from '../models/traderDNA'
import * as traderHoldingModel from '../models/traderHolding'
import * as tickerDailyModel from '../models/tickerDaily'
import * as tickerQuarterlyModel from '../models/tickerQuarterly'
import * as tickerYearlyModel from '../models/tickerYearly'
import * as dateTool from '../tools/date'
import * as dnaTool from '../tools/dna'
import * as marketTool from '../tools/market'
import * as runTool from '../tools/run'
import * as errorEnum from '../enums/error'

interface HoldingDetails {
  totalCash: number,
  totalValue: number,
  holdings: traderHoldingModel.Holding[]
}

export const calcPerformance = async (): Promise<traderModel.Record[]> => {
  const traders = await traderModel.getActives()

  await runTool.asyncMap(traders, async (trader: traderModel.Record) => {
    const dna = await traderDNAModel.getByPK(trader.traderDNAId)
    if (!dna) throw errorEnum.HTTP_ERRORS.NOT_FOUND

    const tickerMinPercent = dna.tickerMinPercent / 100
    const tickerMaxPercent = dna.tickerMaxPercent / 100
    const holdingBuyPercent = dna.holdingBuyPercent / 100
    const holdingSellPercent = dna.holdingSellPercent / 100
    const cashMaxPercent = dna.cashMaxPercent / 100

    let holding = await traderHoldingModel.getLatest(trader.id)

    let tradeDate = holding
      ? dateTool.getNextDate(holding.date, dna.tradeFrequency)
      : dateTool.getInitialDate()

    let rebalancedAt = trader.rebalancedAt || tradeDate
    let startedAt = trader.startedAt
    let hasRebalanced = false

    const today = dateTool.getCurrentDate()

    while (tradeDate <= today) {
      tradeDate = dateTool.getNextDate(tradeDate, dna.tradeFrequency)
      const dailyTargets = await tickerDailyModel.getByDate(tradeDate)
      const quarterlyTargets = await tickerQuarterlyModel.getPublishedByDate(tradeDate)
      const yearlyTargets = await tickerYearlyModel.getPublishedByDate(tradeDate)

      const targets = dailyTargets.map((daily) => {
        const quarterly = quarterlyTargets.find((quarterly) => quarterly.tickerId === daily.tickerId)
        const yearly = yearlyTargets.find((yearly) => yearly.tickerId === daily.tickerId)
        return { daily, quarterly, yearly }
      })

      const totalCash = holding ? holding.totalCash : marketTool.getInitialCash()
      const holdings = holding ? holding.holdings : []

      const detailsBeforeUpdate: HoldingDetails = {
        totalValue: totalCash, totalCash, holdings: [],
      }
      const detailsAfterUpdate = holdings.reduce((details, holding) => {
        const matched = targets.find(({ daily }) => daily.tickerId === holding.tickerId)
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
        const matched = targets.find(({ daily }) => daily.tickerId === holding.tickerId)
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
      const sellTickerIds = targets
        .filter(({ daily, quarterly, yearly }) => {
          return holdingTickerIds.includes(daily.tickerId) &&
            dnaTool.getPriceMovementSellWeights(dna, daily, quarterly, yearly)
        })
        .sort((first, second) => {
          const firstWeight = dnaTool.getPriceMovementSellWeights(dna, first.daily, first.quarterly, first.yearly)
          const secondWeight = dnaTool.getPriceMovementSellWeights(dna, second.daily, second.quarterly, second.yearly)
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
        const matched = targets.find(({ daily }) => daily.tickerId === holding.tickerId)
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

      const buyTargets = targets
        .filter(({ daily, quarterly, yearly }) => !!dnaTool.getPriceMovementBuyWeights(dna, daily, quarterly, yearly))
        .sort((first, second) => {
          const firstWeight = dnaTool.getPriceMovementBuyWeights(dna, first.daily, first.quarterly, first.yearly)
          const secondWeight = dnaTool.getPriceMovementBuyWeights(dna, second.daily, second.quarterly, second.yearly)
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
        })
      }
    }

    if (!holding) return trader

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
    const initialValue = marketTool.getInitialCash()
    const totalEarning = totalValue - initialValue
    const totalDays = dateTool.getDurationCount(startedAt!, latestDate)
    const grossPercent = totalEarning * 100 / initialValue
    const updatedTrader = await traderModel.update(trader.id, {
      totalValue,
      estimatedAt: latestDate,
      rebalancedAt: hasRebalanced ? rebalancedAt : undefined,
      startedAt: startedAt ?? undefined,
      grossPercent: grossPercent.toFixed(2),
      yearlyPercent: (grossPercent * 365 / totalDays).toFixed(2),
      totalDays,
    })
    return updatedTrader
  })

  return traders
}

export const calcDescendant = async (): Promise<traderModel.Record[]> => {
  const traders = await traderModel.getActives()
  const topTraders = traders.slice(0, 20)
  const couples = dnaTool.groupDNACouples(topTraders)

  const newDNAs = await runTool.asyncMap(couples, async (couple: traderModel.Record[]) => {
    const [firstTrader, secondTrader] = couple
    const firstDNA = await traderDNAModel.getByPK(firstTrader.traderDNAId)
    const secondDNA = await traderDNAModel.getByPK(secondTrader.traderDNAId)
  })

  return traders
}
