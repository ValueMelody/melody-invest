import * as interfaces from '@shared/interfaces'
import * as traderPatternModel from '../../models/traderPattern'
import * as traderHoldingModel from '../../models/traderHolding'
import * as dailyTickersModel from '../../models/dailyTickers'
import * as tickerDailyModel from '../../models/tickerDaily'
import * as traderLogic from '../../logics/trader'
import * as holdingLogic from '../../logics/holding'
import * as generateTool from '../../tools/generate'
import * as dateTool from '../../tools/date'
import * as runTool from '../../tools/run'

const buildComboDetail = async (
  traders: interfaces.traderModel.Record[],
): Promise<{
  traderIds: number[];
  profiles: interfaces.traderRes.TraderProfile[];
  holdings: interfaces.traderHoldingModel.Detail[];
  totalValue: number | null;
  oneYearTrends: number[];
}> => {
  const relatedPatterns = await traderPatternModel.getPublicByTraders(traders)
  const profiles = traders.map((trader) => traderLogic.presentTraderProfile(trader, relatedPatterns))

  const traderIds = traders.map((trader) => trader.id)
  const holdings = await traderHoldingModel.getAllByTraderIds(traderIds)
  const holdingsByTraders = traderLogic.groupHoldingRecordsByTraders(holdings)
  const holdingsByDates = traderLogic.gatherTraderHoldingRecordsByDate(
    traderIds, holdings, holdingsByTraders,
  )

  const aggregatedHoldings = Object.keys(holdingsByDates)
    .map((date) => traderLogic.mergeHoldingsByDate(
      date,
      holdingsByDates[date],
      holdingLogic.getInitialCash(),
    ))
  const sortedHoldings = aggregatedHoldings.sort((prev, curr) => curr.date < prev.date ? -1 : 1)

  const latestDate = await dailyTickersModel.getLatestDate()
  const prices = await tickerDailyModel.getNearestPricesByDate(latestDate)
  const totalValue = sortedHoldings.length
    ? holdingLogic.getHoldingTotalValue(sortedHoldings[0], prices)
    : null

  const twelveMonths = generateTool
    .getNumbersInRange(1, 12)
    .map((month) => dateTool.getPreviousDate(latestDate, month * 30))
  const oneYearValue = await runTool.asyncMap(twelveMonths, async (date: string) => {
    const prices = await tickerDailyModel.getNearestPricesByDate(date)
    const holding = sortedHoldings.find((holding) => holding.date <= date)
    const value = holding ? holdingLogic.getHoldingTotalValue(holding, prices) : null
    return value
  })
  const oneYearTrends = oneYearValue
    .filter((num) => num !== null)
    .reverse()

  return {
    traderIds,
    profiles,
    holdings: sortedHoldings,
    oneYearTrends,
    totalValue,
  }
}

export default buildComboDetail
