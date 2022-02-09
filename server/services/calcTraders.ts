import * as traderModel from '../models/trader'
import * as traderDNAModel from '../models/traderDNA'
import * as traderHoldingModel from '../models/traderHolding'
import * as tickerDailyModel from '../models/tickerDaily'
import * as dateTool from '../tools/date'
import * as dnaTool from '../tools/dna'
import * as traderTool from '../tools/trader'
import * as errorEnum from '../enums/error'

export const calcPerformance = async (): Promise<traderHoldingModel.TraderHolding[]> => {
  const traders = await traderModel.getActives()

  const lastestHoldings = []
  for (const trader of traders) {
    const dna = await traderDNAModel.getByPK(trader.traderDNAId)
    if (!dna) throw errorEnum.HTTP_ERRORS.NOT_FOUND

    let holding = await traderHoldingModel.getLatest(trader.id)

    let tradeDate = holding
      ? dateTool.getNextDate(holding.date, dna.tradeFrequency)
      : dateTool.getInitialDate()
    const today = dateTool.getCurrentDate()

    while (tradeDate <= today) {
      tradeDate = dateTool.getNextDate(tradeDate, dna.tradeFrequency)
      const targets = await tickerDailyModel.getByDate(tradeDate)

      const totalCash = holding ? parseFloat(holding.totalCash) : traderTool.getInitialCash()
      const holdings = holding ? holding.holdings : []

      const holdingTickerIds = holdings.map((share) => share.tickerId)
      const sellTargets = targets
        .filter((daily) => {
          if (!holdingTickerIds.includes(daily.tickerId)) return false
          return !!dnaTool.getPriceMovementSellWeights(dna, daily)
        })
        .sort((first, second) => {
          const firstWeight = dnaTool.getPriceMovementSellWeights(dna, first)
          const secondWeight = dnaTool.getPriceMovementSellWeights(dna, second)
          return firstWeight >= secondWeight ? -1 : 1
        })

      const detailsAfterSell = holdings.reduce((details, holding) => {
        const sellTarget = sellTargets.find((daily) => daily.tickerId === holding.tickerId)

        if (!sellTarget) {
          const matchedDaily = targets.find((daily) => daily.tickerId === holding.tickerId)
          const totalValue = matchedDaily
            ? holding.totalShares * parseFloat(matchedDaily.adjustedClosePrice)
            : holding.totalValue
          const newHolding = { ...holding, totalValue }
          return {
            ...details,
            totalValue: details.totalValue + totalValue,
            holdings: [...details.holdings, newHolding]
          }
        }

        const sellTotal = sellTarget ? Math.floor(holding.totalShares * dna.holdingSellPercent / 100) : 0
        const tickerPrice = sellTarget ? parseFloat(sellTarget.adjustedClosePrice) : 0
        const sellReturn = sellTotal * tickerPrice
        const totalShares = holding.totalShares - sellTotal
        const totalValue = totalShares * tickerPrice
        const newHolding = { ...holding, totalShares, totalValue }
        const newHoldings = totalShares ? [...details.holdings, newHolding] : details.holdings
        return {
          totalCash: details.totalCash + sellReturn,
          totalValue: details.totalValue + totalValue + sellReturn,
          holdings: newHoldings
        }
      }, { totalValue: totalCash, totalCash, holdings });

      const maxBuyAmount = detailsAfterSell.totalValue * dna.holdingBuyPercent / 100

      const buyTargets = targets
        .filter((daily) => !!dnaTool.getPriceMovementBuyWeights(dna, daily))
        .sort((first, second) => {
          const firstWeight = dnaTool.getPriceMovementBuyWeights(dna, first)
          const secondWeight = dnaTool.getPriceMovementBuyWeights(dna, second)
          return firstWeight >= secondWeight ? -1 : 1
        })

      const buyDetails = buyTargets.reduce((
        results: traderHoldingModel.HoldingDetails, target
      ): traderHoldingModel.HoldingDetails => {
        const { cash, tickerShares } = results
        const maxAmount = cash < maxBuyAmount ? cash : maxBuyAmount
        const sharePrice = parseInt(target.adjustedClosePrice)
        const shares = Math.floor(maxAmount / sharePrice)
        if (!shares) return results

        const totalAmount = sharePrice * shares
        const freeCash = cash - totalAmount
        const newShares = [...tickerShares, { tickerId: target.tickerId, shares }]
        const newResults = {
          total, cash: freeCash, tickerShares: newShares
        }
        return newResults
      }, { total, cash, tickerShares: [] })

      const combinedShares = [...shares, ...buyDetails.tickerShares].reduce((
        shares: traderHoldingModel.TickerShare[], share
      ) => {
        const matchedIndex = shares.findIndex((s) => s.tickerId === share.tickerId)
        if (matchedIndex === -1) return [...shares, share]
        const newShares = [...shares]
        const newShare = { ...share, shares: shares[matchedIndex].shares + share.shares }
        newShares.splice(matchedIndex, 1, newShare)
        return newShares
      }, [])

      const combinedDetails = { ...buyDetails, tickerShares: combinedShares }

      const isPositionChanged = buyDetails.cash !== cash
      if (isPositionChanged) {
        holding = await traderHoldingModel.create({
          traderId: trader.id,
          date: tradeDate,
          details: combinedDetails
        })
      }
    }
    if (holding) lastestHoldings.push(holding)
  }
  return lastestHoldings
}
