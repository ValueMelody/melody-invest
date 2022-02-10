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

      const totalCash = holding ? holding.totalCash : traderTool.getInitialCash()
      const holdings = holding ? holding.holdings : []
      const holdingTickerIds = holdings.map((share) => share.tickerId)

      const sellTickerIds = targets
        .filter((target) => {
          return holdingTickerIds.includes(target.tickerId) &&
            dnaTool.getPriceMovementSellWeights(dna, target)
        })
        .sort((first, second) => {
          const firstWeight = dnaTool.getPriceMovementSellWeights(dna, first)
          const secondWeight = dnaTool.getPriceMovementSellWeights(dna, second)
          return firstWeight >= secondWeight ? -1 : 1
        })
        .map((target) => target.tickerId)

      let hasTransaction = false

      const initialHolding: traderHoldingModel.Holding[] = []
      const detailsAfterSell = holdings.reduce((details, holding) => {
        const shouldSell = sellTickerIds.includes(holding.tickerId)
        const matchedDaily = targets.find((daily) => daily.tickerId === holding.tickerId)
        const sharesSold = matchedDaily && Math.floor(holding.shares * dna.holdingSellPercent / 100)

        if (shouldSell && sharesSold) {
          hasTransaction = true
          const tickerPrice = parseFloat(matchedDaily.adjustedClosePrice)
          const cashEarned = sharesSold * tickerPrice
          const shares = holding.shares - sharesSold
          const value = shares * tickerPrice
          const holdingDetail = { ...holding, shares, value }
          const holdings = shares ? [...details.holdings, holdingDetail] : details.holdings
          return {
            totalCash: details.totalCash + cashEarned,
            totalValue: details.totalValue + cashEarned + value,
            holdings
          }
        }

        const value = matchedDaily
          ? holding.shares * parseFloat(matchedDaily.adjustedClosePrice)
          : holding.value
        const holdingDetail = { ...holding, value }
        return {
          totalCash: details.totalCash,
          totalValue: details.totalValue + value,
          holdings: [...details.holdings, holdingDetail]
        }
      }, { totalValue: totalCash, totalCash, holdings: initialHolding })

      const maxBuyAmount = detailsAfterSell.totalValue * dna.holdingBuyPercent / 100

      const buyTargets = targets
        .filter((daily) => !!dnaTool.getPriceMovementBuyWeights(dna, daily))
        .sort((first, second) => {
          const firstWeight = dnaTool.getPriceMovementBuyWeights(dna, first)
          const secondWeight = dnaTool.getPriceMovementBuyWeights(dna, second)
          return firstWeight >= secondWeight ? -1 : 1
        })

      const detailsAfterBuy = buyTargets.reduce((details, target) => {
        const maxCash = details.totalCash < maxBuyAmount ? details.totalCash : maxBuyAmount
        const sharePrice = parseInt(target.adjustedClosePrice)
        const sharesBought = Math.floor(maxCash / sharePrice)

        if (!sharesBought) return details
        hasTransaction = true

        const cashSpent = sharePrice * sharesBought
        const totalCash = details.totalCash - cashSpent
        const holdingIndex = details.holdings.findIndex((holding) => holding.tickerId === target.tickerId)
        const isNewHolding = holdingIndex === -1
        const shares = isNewHolding ? sharesBought : sharesBought + details.holdings[holdingIndex].shares
        const value = sharePrice * shares
        const holdingDetail = { tickerId: target.tickerId, shares, value }
        const holdings = isNewHolding
          ? [...details.holdings, holdingDetail]
          : details.holdings.map((holding, index) => index === holdingIndex ? holdingDetail : holding)
        return { totalCash, holdings }
      }, {
        totalCash: detailsAfterSell.totalCash,
        holdings: detailsAfterSell.holdings
      })

      if (hasTransaction) {
        holding = await traderHoldingModel.create({
          traderId: trader.id,
          date: tradeDate,
          totalValue: detailsAfterSell.totalValue,
          totalCash: detailsAfterBuy.totalCash,
          holdings: detailsAfterBuy.holdings
        })
      }
    }
    if (holding) lastestHoldings.push(holding)
  }
  return lastestHoldings
}
