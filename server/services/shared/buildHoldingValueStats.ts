import * as interfaces from '@shared/interfaces'
import * as tickerDailyModel from '../../models/tickerDaily'
import * as holdingLogic from '../../logics/holding'
import * as dateTool from '../../tools/date'
import * as runTool from '../../tools/run'
import * as generateTool from '../../tools/generate'

const calHoldingValueByDate = async (
  date: string,
  holdings: interfaces.traderHoldingModel.Detail[],
): Promise<number | null> => {
  const prices = await tickerDailyModel.getNearestPricesByDate(date)
  const holding = holdings.find((holding) => holding.date <= date)
  const value = holding ? holdingLogic.getHoldingTotalValue(holding, prices) : null
  return value
}

const buildHoldingValueStats = async (
  startDate: string,
  endDate: string,
  initialValue: number,
  holdings: interfaces.traderHoldingModel.Detail[],
): Promise<{
  totalValue: number | null;
  totalDays: number,
  grossPercentNumber: number | null;
  yearlyPercentNumber: number | null;
  pastWeekPercentNumber: number | null;
  pastMonthPercentNumber: number | null;
  pastQuarterPercentNumber: number | null;
  pastYearPercentNumber: number | null;
  oneYearTrends: number[];
  oneDecadeTrends: number[];
}> => {
  const totalValue = await calHoldingValueByDate(endDate, holdings)
  const totalDays = dateTool.getDurationCount(startDate, endDate)
  const grossPercentNumber = totalValue
    ? generateTool.getChangePercent(totalValue, initialValue)
    : null

  const pastWeek = dateTool.getPreviousDate(endDate, 7)
  const pastWeekValue = await calHoldingValueByDate(pastWeek, holdings)

  const twelveMonths = generateTool.getNumbersInRange(1, 12)
  const pastMonthValues = await runTool.asyncMap(twelveMonths, async (month: number) => {
    const date = dateTool.getPreviousDate(endDate, month * 30)
    const value = await calHoldingValueByDate(date, holdings)
    return value
  })

  const pastWeekPercentNumber = totalValue && pastWeekValue
    ? generateTool.getChangePercent(totalValue, pastWeekValue)
    : null
  const pastMonthPercentNumber = totalValue && pastMonthValues[0]
    ? generateTool.getChangePercent(totalValue, pastMonthValues[0])
    : null
  const pastQuarterPercentNumber = totalValue && pastMonthValues[2]
    ? generateTool.getChangePercent(totalValue, pastMonthValues[2])
    : null
  const pastYearPercentNumber = totalValue && pastMonthValues[11]
    ? generateTool.getChangePercent(totalValue, pastMonthValues[11])
    : null

  const oneYearTrends = pastMonthValues.filter((num) => num !== null).reverse()

  const tenYears = generateTool.getNumbersInRange(1, 10)
  const tenYearValues = await runTool.asyncMap(tenYears, async (year: number) => {
    const date = dateTool.getPreviousDate(endDate, year * 365)
    const value = await calHoldingValueByDate(date, holdings)
    return value
  })
  const oneDecadeTrends = tenYearValues.filter((num) => num !== null).reverse()

  return {
    totalValue,
    totalDays,
    grossPercentNumber: grossPercentNumber,
    yearlyPercentNumber: grossPercentNumber ? Math.floor(grossPercentNumber * 365 / totalDays) : null,
    pastWeekPercentNumber,
    pastMonthPercentNumber,
    pastQuarterPercentNumber,
    pastYearPercentNumber,
    oneYearTrends,
    oneDecadeTrends,
  }
}

export default buildHoldingValueStats