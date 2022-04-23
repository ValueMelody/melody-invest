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
  const totalValue = await calHoldingValueByDate(latestDate, sortedHoldings)

  const tenYears = generateTool
    .getNumbersInRange(1, 10)
    .map((year) => dateTool.getPreviousDate(latestDate, year * 365))
  const tenYearValues = await runTool.asyncMap(
    tenYears,
    async (date: string) => await calHoldingValueByDate(date, sortedHoldings),
  )
  const oneDecadeTrends = tenYearValues.filter((num) => num !== null).reverse()

  const twelveMonths = generateTool
    .getNumbersInRange(1, 12)
    .map((month) => dateTool.getPreviousDate(latestDate, month * 30))
  const twelveMonthValues = await runTool.asyncMap(
    twelveMonths,
    async (date: string) => await calHoldingValueByDate(date, sortedHoldings),
  )

  const pastWeekDate = dateTool.getPreviousDate(latestDate, 7)
  const pastWeekValue = await calHoldingValueByDate(pastWeekDate, sortedHoldings)
  const pastWeekPercentNumber = totalValue && pastWeekValue
    ? generateTool.getChangePercent(totalValue, pastWeekValue)
    : null
  const pastMonthPercentNumber = totalValue && twelveMonthValues[0]
    ? generateTool.getChangePercent(totalValue, twelveMonthValues[0])
    : null
  const pastQuarterPercentNumber = totalValue && twelveMonthValues[2]
    ? generateTool.getChangePercent(totalValue, twelveMonthValues[2])
    : null
  const pastYearPercentNumber = totalValue && twelveMonthValues[11]
    ? generateTool.getChangePercent(totalValue, twelveMonthValues[11])
    : null

  const oneYearTrends = twelveMonthValues.filter((num) => num !== null).reverse()

  const initialValue = holdingLogic.getInitialCash() * traderIds.length
  const grossPercent = totalValue ? generateTool.getChangePercent(totalValue, initialValue) : null
  const totalDays = dateTool.getDurationCount(sortedHoldings[sortedHoldings.length - 1].date, latestDate)
  const yearlyPercentNumber = grossPercent ? Math.floor(grossPercent * 365 / totalDays) : null

  return {
    traderIds,
    detail: {
      profiles,
      holdings: sortedHoldings.slice(0, 20),
      totalValue,
      oneYearTrends,
      oneDecadeTrends,
      yearlyPercentNumber,
      pastWeekPercentNumber,
      pastMonthPercentNumber,
      pastQuarterPercentNumber,
      pastYearPercentNumber,
    },
  }
}

export default buildComboDetail
