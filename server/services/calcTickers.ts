import * as tickerModel from '../models/ticker'
import * as tickerDailyModel from '../models/tickerDaily'
import * as tickerQuarterlyModel from '../models/tickerQuarterly'
import * as geneEnums from '../enums/gene'

const calcAverage = (
  dailyRecords: tickerDailyModel.Record[],
): number => {
  const total = dailyRecords.reduce((total, daily) => total + daily.adjustedClosePrice, 0)
  return total / dailyRecords.length
}

export const calcAveragePrice = async (): Promise<tickerModel.Record[]> => {
  const tickers = await tickerModel.getAll()

  for (const ticker of tickers) {
    const tickerDailyRecords = await tickerDailyModel.getAll(ticker.id)
    if (!tickerDailyRecords.length) continue

    let index = -1
    for (const tickerDaily of tickerDailyRecords) {
      index++
      let hasUpdate = false

      let weeklyAverage = tickerDaily.weeklyAveragePrice
      if (index >= geneEnums.DAYS.WEEK && tickerDaily.weeklyAveragePrice === null) {
        const relatedDaily = tickerDailyRecords.slice(index - geneEnums.DAYS.WEEK, index)
        weeklyAverage = calcAverage(relatedDaily)
        hasUpdate = true
      }

      let monthlyAverage = tickerDaily.monthlyAveragePrice
      if (index >= geneEnums.DAYS.MONTH && tickerDaily.monthlyAveragePrice === null) {
        const relatedDaily = tickerDailyRecords.slice(index - geneEnums.DAYS.MONTH, index)
        monthlyAverage = calcAverage(relatedDaily)
        hasUpdate = true
      }

      let quarterlyAverage = tickerDaily.quarterlyAveragePrice
      if (index >= geneEnums.DAYS.QUARTER && tickerDaily.quarterlyAveragePrice === null) {
        const relatedDaily = tickerDailyRecords.slice(index - geneEnums.DAYS.QUARTER, index)
        quarterlyAverage = calcAverage(relatedDaily)
        hasUpdate = true
      }

      let yearlyAverage = tickerDaily.yearlyAveragePrice
      if (index >= geneEnums.DAYS.YEAR && tickerDaily.yearlyAveragePrice === null) {
        const relatedDaily = tickerDailyRecords.slice(index - geneEnums.DAYS.YEAR, index)
        yearlyAverage = calcAverage(relatedDaily)
        hasUpdate = true
      }

      if (hasUpdate) {
        await tickerDailyModel.update(tickerDaily.id, {
          weeklyAveragePrice: weeklyAverage ? Math.floor(weeklyAverage) : weeklyAverage,
          monthlyAveragePrice: monthlyAverage ? Math.floor(monthlyAverage) : null,
          quarterlyAveragePrice: quarterlyAverage ? Math.floor(quarterlyAverage) : null,
          yearlyAveragePrice: yearlyAverage ? Math.floor(yearlyAverage) : null,
        })
      }
    }
  }
  return tickers
}

export const calcPriceMovement = async (): Promise<tickerModel.Record[]> => {
  const tickers = await tickerModel.getAll()

  for (const ticker of tickers) {
    const tickerDailyRecords = await tickerDailyModel.getAll(ticker.id)
    if (!tickerDailyRecords.length) continue

    const checkedDaily: tickerDailyModel.Record[] = []
    for (const tickerDaily of tickerDailyRecords) {
      let dailyIncrease = tickerDaily.priceDailyIncrease
      let dailyDecrease = tickerDaily.priceDailyDecrease
      if (checkedDaily.length > 0) {
        const previousDaily = checkedDaily[checkedDaily.length - 1]
        const priceDiffer = tickerDaily.adjustedClosePrice - previousDaily.adjustedClosePrice
        const perviousIncrease = previousDaily.priceDailyIncrease || 0
        const previousDecrease = previousDaily.priceDailyDecrease || 0
        dailyIncrease = priceDiffer > 0 ? perviousIncrease + 1 : 0
        dailyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      let weeklyIncrease = tickerDaily.priceWeeklyIncrease
      let weeklyDecrease = tickerDaily.priceWeeklyDecrease
      if (checkedDaily.length > geneEnums.DAYS.WEEK) {
        const previousDaily = checkedDaily[checkedDaily.length - geneEnums.DAYS.WEEK]
        const priceDiffer = tickerDaily.weeklyAveragePrice! - previousDaily.weeklyAveragePrice!
        const previousIncrease = previousDaily.priceWeeklyIncrease || 0
        const previousDecrease = previousDaily.priceWeeklyDecrease || 0
        weeklyIncrease = priceDiffer > 0 ? previousIncrease + 1 : 0
        weeklyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      let monthlyIncrease = tickerDaily.priceMonthlyIncrease
      let monthlyDecrease = tickerDaily.priceMonthlyDecrease
      if (checkedDaily.length > geneEnums.DAYS.MONTH) {
        const previousMonthly = checkedDaily[checkedDaily.length - geneEnums.DAYS.MONTH]
        const priceDiffer = tickerDaily.monthlyAveragePrice! - previousMonthly.monthlyAveragePrice!
        const previousIncrease = previousMonthly.priceMonthlyIncrease || 0
        const previousDecrease = previousMonthly.priceMonthlyDecrease || 0
        monthlyIncrease = priceDiffer > 0 ? previousIncrease + 1 : 0
        monthlyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      let quarterlyIncrease = tickerDaily.priceQuarterlyIncrease
      let quarterlyDecrease = tickerDaily.priceQuarterlyDecrease
      if (checkedDaily.length > geneEnums.DAYS.QUARTER) {
        const previousQuarterly = checkedDaily[checkedDaily.length - geneEnums.DAYS.QUARTER]
        const priceDiffer = tickerDaily.quarterlyAveragePrice! - previousQuarterly.quarterlyAveragePrice!
        const previousIncrease = previousQuarterly.priceQuarterlyIncrease || 0
        const previousDecrease = previousQuarterly.priceQuarterlyDecrease || 0
        quarterlyIncrease = priceDiffer > 0 ? previousIncrease + 1 : 0
        quarterlyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      let yearlyIncrease = tickerDaily.priceYearlyIncrease
      let yearlyDecrease = tickerDaily.priceYearlyDecrease
      if (checkedDaily.length > geneEnums.DAYS.YEAR) {
        const previousYearly = checkedDaily[checkedDaily.length - geneEnums.DAYS.YEAR]
        const priceDiffer = tickerDaily.yearlyAveragePrice! - previousYearly.yearlyAveragePrice!
        const previousIncrease = previousYearly.priceYearlyIncrease || 0
        const previousDecrease = previousYearly.priceYearlyDecrease || 0
        yearlyIncrease = priceDiffer > 0 ? previousIncrease + 1 : 0
        yearlyDecrease = priceDiffer < 0 ? previousDecrease + 1 : 0
      }

      const hasUpdate = tickerDaily.priceDailyIncrease !== dailyIncrease ||
        tickerDaily.priceDailyDecrease !== dailyDecrease ||
        tickerDaily.priceWeeklyIncrease !== weeklyIncrease ||
        tickerDaily.priceWeeklyDecrease !== weeklyDecrease ||
        tickerDaily.priceMonthlyIncrease !== monthlyIncrease ||
        tickerDaily.priceMonthlyDecrease !== monthlyDecrease ||
        tickerDaily.priceQuarterlyIncrease !== quarterlyIncrease ||
        tickerDaily.priceQuarterlyDecrease !== quarterlyDecrease ||
        tickerDaily.priceYearlyIncrease !== yearlyIncrease ||
        tickerDaily.priceYearlyDecrease !== yearlyDecrease

      const daily = hasUpdate
        ? await tickerDailyModel.update(tickerDaily.id, {
          priceDailyIncrease: dailyIncrease,
          priceDailyDecrease: dailyDecrease,
          priceWeeklyIncrease: weeklyIncrease,
          priceWeeklyDecrease: weeklyDecrease,
          priceMonthlyIncrease: monthlyIncrease,
          priceMonthlyDecrease: monthlyDecrease,
          priceQuarterlyIncrease: quarterlyIncrease,
          priceQuarterlyDecrease: quarterlyDecrease,
          priceYearlyIncrease: yearlyIncrease,
          priceYearlyDecrease: yearlyDecrease,
        })
        : tickerDaily
      checkedDaily.push(daily)
    }
  }
  return tickers
}

export const calcQuarterlyFinancial = async (): Promise<tickerModel.Record[]> => {
  const tickers = await tickerModel.getAll()

  for (const ticker of tickers) {
    const tickerQuarterlyRecords = await tickerQuarterlyModel.getAll(ticker.id)
    if (!tickerQuarterlyRecords.length) continue

    const checkedQuarterly: tickerQuarterlyModel.Record[] = []
    for (const tickerQuarterly of tickerQuarterlyRecords) {
      const lastRecord = checkedQuarterly.length ? checkedQuarterly[checkedQuarterly.length - 1] : null

      let epsContinuousBeats = tickerQuarterly.epsContinuousBeats
      let epsContinuousMiss = tickerQuarterly.epsContinuousMiss
      if (tickerQuarterly.eps !== null && tickerQuarterly.estimatedEPS !== null) {
        const isBeats = tickerQuarterly.eps >= tickerQuarterly.estimatedEPS
        const previousBeats = lastRecord?.epsContinuousBeats || 0
        const previousMiss = lastRecord?.epsContinuousBeats || 0
        epsContinuousBeats = isBeats ? previousBeats + 1 : 1
        epsContinuousMiss = !isBeats ? previousMiss + 1 : 1
      }

      let revenueContinuousIncrease = tickerQuarterly.revenueContinuousIncrease
      let revenueContinuousDecrease = tickerQuarterly.revenueContinuousDecrease
      if (tickerQuarterly.totalRevenue !== null && lastRecord && lastRecord?.totalRevenue !== null) {
        const isIncrease = tickerQuarterly.totalRevenue > lastRecord.totalRevenue
        const isDecrease = tickerQuarterly.totalRevenue < lastRecord.totalRevenue
        const lastIncrease = lastRecord.revenueContinuousIncrease || 0
        const lastDecrease = lastRecord.revenueContinuousDecrease || 0
        revenueContinuousIncrease = isIncrease ? lastIncrease + 1 : 0
        revenueContinuousDecrease = isDecrease ? lastDecrease + 1 : 0
      }

      let profitContinuousIncrease = tickerQuarterly.profitContinuousIncrease
      let profitContinuousDecrease = tickerQuarterly.profitContinuousDecrease
      if (tickerQuarterly.grossProfit !== null && lastRecord && lastRecord?.grossProfit !== null) {
        const isIncrease = tickerQuarterly.grossProfit > lastRecord.grossProfit
        const isDecrease = tickerQuarterly.grossProfit < lastRecord.grossProfit
        const lastIncrease = lastRecord.profitContinuousIncrease || 0
        const lastDecrease = lastRecord.profitContinuousDecrease || 0
        profitContinuousIncrease = isIncrease ? lastIncrease + 1 : 0
        profitContinuousDecrease = isDecrease ? lastDecrease + 1 : 0
      }

      let incomeContinuousIncrease = tickerQuarterly.incomeContinuousIncrease
      let incomeContinuousDecrease = tickerQuarterly.incomeContinuousDecrease
      if (tickerQuarterly.netIncome !== null && lastRecord && lastRecord?.netIncome !== null) {
        const isIncrease = tickerQuarterly.netIncome > lastRecord.netIncome
        const isDecrease = tickerQuarterly.netIncome < lastRecord.netIncome
        const lastIncrease = lastRecord.incomeContinuousIncrease || 0
        const lastDecrease = lastRecord.incomeContinuousDecrease || 0
        incomeContinuousIncrease = isIncrease ? lastIncrease + 1 : 0
        incomeContinuousDecrease = isDecrease ? lastDecrease + 1 : 0
      }

      const hasUpdate =
        tickerQuarterly.epsContinuousBeats !== epsContinuousBeats ||
        tickerQuarterly.epsContinuousMiss !== epsContinuousMiss ||
        tickerQuarterly.revenueContinuousIncrease !== revenueContinuousIncrease ||
        tickerQuarterly.revenueContinuousDecrease !== revenueContinuousDecrease ||
        tickerQuarterly.profitContinuousIncrease !== profitContinuousIncrease ||
        tickerQuarterly.profitContinuousDecrease !== profitContinuousDecrease ||
        tickerQuarterly.incomeContinuousIncrease !== incomeContinuousIncrease ||
        tickerQuarterly.incomeContinuousDecrease !== incomeContinuousDecrease

      const quarterly = hasUpdate
        ? await tickerQuarterlyModel.update(tickerQuarterly.id, {
          epsContinuousBeats,
          epsContinuousMiss,
          revenueContinuousIncrease,
          revenueContinuousDecrease,
          profitContinuousIncrease,
          profitContinuousDecrease,
          incomeContinuousIncrease,
          incomeContinuousDecrease,
        })
        : tickerQuarterly

      checkedQuarterly.push(quarterly)
    }
  }
  return tickers
}
