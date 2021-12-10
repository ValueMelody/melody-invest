import * as traderModel from '../models/trader'
import * as tradeDNAModel from '../models/tradeDNA'
import * as dateTool from '../tools/date'
import * as errorEnum from '../enums/error'

export const updateEnvTrades = async (
  envId: number
) => {
  const traders = await traderModel.getActiveByEnv(envId)

  for (const trader of traders) {
    const dna = await tradeDNAModel.getByPK(trader.tradeDNAId)
    if (!dna) throw errorEnum.HTTP_ERRORS.NOT_FOUND

    let tradeDate = trader.lastTradeDate ?? dateTool.getInitialDate()
    const today = dateTool.getCurrentDate()

    while (tradeDate <= today) {
      tradeDate = tradeDate + dna.tradeFrequency
    }
  }
}
