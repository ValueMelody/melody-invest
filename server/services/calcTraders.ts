import * as traderModel from '../models/trader'
import * as traderDNAModel from '../models/traderDNA'
import * as traderHoldingModel from '../models/traderHolding'
import * as tickerDailyModel from '../models/tickerDaily'
import * as dateTool from '../tools/date'
import * as dnaTool from '../tools/dna'
import * as traderTool from '../tools/trader'
import * as errorEnum from '../enums/error'

export const calcPerformance = async () => {
  const traders = await traderModel.getActives()

  for (const trader of traders) {
    const dna = await traderDNAModel.getByPK(trader.traderDNAId)
    if (!dna) throw errorEnum.HTTP_ERRORS.NOT_FOUND

    const holding = await traderHoldingModel.getLatest(trader.id)

    let tradeDate = holding
      ? dateTool.getNextDate(holding.date, dna.tradeFrequency)
      : dateTool.getInitialDate()
    const today = dateTool.getCurrentDate()

    while (tradeDate <= today) {
      tradeDate = dateTool.getNextDate(tradeDate, dna.tradeFrequency)
      const targets = await tickerDailyModel.getByDate(tradeDate)
      const buyTargets = targets
        .filter((daily) => dnaTool.getPriceMovementBuyWeights(dna, daily))
        .sort((first, second) => {
          const firstWeight = dnaTool.getPriceMovementBuyWeights(dna, first)
          const secondWeight = dnaTool.getPriceMovementBuyWeights(dna, second)
          return firstWeight >= secondWeight ? -1 : 1
        })

      const total = holding ? holding.details.total : traderTool.getInitialCash()
      const cash = holding ? holding.details.cash : traderTool.getInitialCash()
      const singleTransactionMax = total * dna.holdingBuyPercent / 100

      const buyDetails = buyTargets.reduce((
        results: traderHoldingModel.HoldingDetails, target
      ): traderHoldingModel.HoldingDetails => {
        const { cash, tickerShares } = results
        const maxAmount = cash < singleTransactionMax ? cash : singleTransactionMax
        const sharePrice = parseInt(target.adjustedClosePrice)
        const shares = Math.floor(maxAmount / sharePrice)
        const totalAmount = sharePrice * shares
        const freeCash = cash - totalAmount
        const newShares = [...tickerShares, { tickerId: target.tickerId, shares }]
        const result = {
          total, cash: freeCash, tickerShares: newShares
        }
        return result
      }, { total, cash, tickerShares: [] })

      console.log(buyDetails)
    }
  }
}
