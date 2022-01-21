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

      const total = holding ? holding.detail.total : traderTool.getInitialCash()
      const cash = holding ? holding.detail.cash : traderTool.getInitialCash()
      const singleTransactionMax = total * dna.holdingBuyPercent

      let freeCash = cash
      const targetsBuyAmount = buyTargets.map((target) => {
        const buyAmount = freeCash < singleTransactionMax ? freeCash : singleTransactionMax
        freeCash -= buyAmount
        return buyAmount
      })

      console.log(buyTargets)
    }
  }
}
