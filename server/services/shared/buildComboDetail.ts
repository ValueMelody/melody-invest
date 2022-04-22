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

const calHoldingValueByDate = async (
  date: string,
  holdings: interfaces.traderHoldingModel.Detail[],
): Promise<number | null> => {
  const prices = await tickerDailyModel.getNearestPricesByDate(date)
  const holding = holdings.find((holding) => holding.date <= date)
  const value = holding ? holdingLogic.getHoldingTotalValue(holding, prices) : null
  return value
}

const calTrendValues = async (
  dates: string[],
  holdings: interfaces.traderHoldingModel.Detail[],
) => {
  const values = await runTool.asyncMap(
    dates,
    async (date: string) => await calHoldingValueByDate(date, holdings),
  )
  const trends = values
    .filter((num) => num !== null)
    .reverse()
  return trends
}

const buildComboDetail = async (
  traders: interfaces.traderModel.Record[],
): Promise<{
  traderIds: number[];
  detail: interfaces.response.ComboDetail;
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
  const oneYearTrends = await calTrendValues(twelveMonths, sortedHoldings)

  const tenYears = generateTool
    .getNumbersInRange(1, 10)
    .map((year) => dateTool.getPreviousDate(latestDate, year * 365))
  const oneDecadeTrends = await calTrendValues(tenYears, sortedHoldings)

  return {
    traderIds,
    detail: {
      profiles,
      holdings: sortedHoldings.slice(0, 20),
      totalValue,
      oneYearTrends,
      oneDecadeTrends,
    },
  }
}

export default buildComboDetail
