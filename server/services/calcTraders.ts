import * as traderModel from '../models/trader'
import * as tradeDNAModel from '../models/tradeDNA'
import * as tickerDailyModel from '../models/tickerDaily'
import * as dateTool from '../tools/date'
import * as dnaTool from '../tools/dna'
import * as errorEnum from '../enums/error'

export const calcPerformance = async () => {
  const traders = await traderModel.getActives()

  for (const trader of traders) {
    const dna = await tradeDNAModel.getByPK(trader.tradeDNAId)
    if (!dna) throw errorEnum.HTTP_ERRORS.NOT_FOUND

    let tradeDate = trader.lastTradeDate
      ? dateTool.getNextDate(trader.lastTradeDate, dna.tradeFrequency)
      : dateTool.getInitialDate()
    const today = dateTool.getCurrentDate()

    while (tradeDate <= today) {
      tradeDate = dateTool.getNextDate(tradeDate, dna.tradeFrequency)
      const targets = await tickerDailyModel.getByDate(tradeDate)
      const buyTargets = targets.filter((tickerDaily) => {
        const metBuyGene = dnaTool.isTickerMetBuyGene(tickerDaily, dna)
        return metBuyGene
      })
    }
  }
}
