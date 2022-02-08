import * as tickerModel from '../models/ticker'
import * as tickerDailyModel from '../models/tickerDaily'
import * as geneEnums from '../enums/gene'

const calcAverage = (
  dailyRecords: tickerDailyModel.TickerDaily[]
): string => {
  const total = dailyRecords.reduce((total, daily) => {
    const price = parseFloat(daily.adjustedClosePrice)
    return total + price
  }, 0)
  const avgTotal = total / dailyRecords.length
  return avgTotal.toFixed(2)
}

export const calcAveragePrice = async (): Promise<tickerModel.Ticker[]> => {
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
          weeklyAveragePrice: weeklyAverage,
          monthlyAveragePrice: monthlyAverage,
          quarterlyAveragePrice: quarterlyAverage,
          yearlyAveragePrice: yearlyAverage
        })
      }
    }
  }
  return tickers
}

export const calcPriceMovement = async (): Promise<tickerModel.Ticker[]> => {
  const tickers = await tickerModel.getAll()

  for (const ticker of tickers) {
    const tickerDailyRecords = await tickerDailyModel.getAll(ticker.id)
    if (!tickerDailyRecords.length) continue

    const checkedDaily: tickerDailyModel.TickerDaily[] = []
    for (const tickerDaily of tickerDailyRecords) {
      let dailyIncrease = tickerDaily.priceDailyIncrease
      let dailyDecrease = tickerDaily.priceDailyDecrease
      if (checkedDaily.length > 0) {
        const previousDaily = checkedDaily[checkedDaily.length - 1]
        const priceDiffer = parseFloat(tickerDaily.adjustedClosePrice) - parseFloat(previousDaily.adjustedClosePrice)
        dailyIncrease = priceDiffer > 0 ? previousDaily.priceDailyIncrease + 1 : 0
        dailyDecrease = priceDiffer < 0 ? previousDaily.priceDailyDecrease + 1 : 0
      }

      let weeklyIncrease = tickerDaily.priceWeeklyIncrease
      let weeklyDecrease = tickerDaily.priceWeeklyDecrease
      if (checkedDaily.length > geneEnums.DAYS.WEEK) {
        const previousDaily = checkedDaily[checkedDaily.length - geneEnums.DAYS.WEEK]
        const priceDiffer = parseFloat(tickerDaily.weeklyAveragePrice) - parseFloat(previousDaily.weeklyAveragePrice)
        weeklyIncrease = priceDiffer > 0 ? previousDaily.priceWeeklyIncrease + 1 : 0
        weeklyDecrease = priceDiffer < 0 ? previousDaily.priceWeeklyDecrease + 1 : 0
      }

      let monthlyIncrease = tickerDaily.priceMonthlyIncrease
      let monthlyDecrease = tickerDaily.priceMonthlyDecrease
      if (checkedDaily.length > geneEnums.DAYS.MONTH) {
        const previousMonthly = checkedDaily[checkedDaily.length - geneEnums.DAYS.MONTH]
        const priceDiffer = parseFloat(tickerDaily.monthlyAveragePrice) - parseFloat(previousMonthly.monthlyAveragePrice)
        monthlyIncrease = priceDiffer > 0 ? previousMonthly.priceMonthlyIncrease + 1 : 0
        monthlyDecrease = priceDiffer < 0 ? previousMonthly.priceMonthlyDecrease + 1 : 0
      }

      let quarterlyIncrease = tickerDaily.priceQuarterlyIncrease
      let quarterlyDecrease = tickerDaily.priceQuarterlyDecrease
      if (checkedDaily.length > geneEnums.DAYS.QUARTER) {
        const previousQuarterly = checkedDaily[checkedDaily.length - geneEnums.DAYS.QUARTER]
        const priceDiffer = parseFloat(tickerDaily.quarterlyAveragePrice) - parseFloat(previousQuarterly.quarterlyAveragePrice)
        quarterlyIncrease = priceDiffer > 0 ? previousQuarterly.priceQuarterlyIncrease + 1 : 0
        quarterlyDecrease = priceDiffer < 0 ? previousQuarterly.priceQuarterlyDecrease + 1 : 0
      }

      let yearlyIncrease = tickerDaily.priceYearlyIncrease
      let yearlyDecrease = tickerDaily.priceYearlyDecrease
      if (checkedDaily.length > geneEnums.DAYS.YEAR) {
        const previousYearly = checkedDaily[checkedDaily.length - geneEnums.DAYS.YEAR]
        const priceDiffer = parseFloat(tickerDaily.yearlyAveragePrice) - parseFloat(previousYearly.yearlyAveragePrice)
        yearlyIncrease = priceDiffer > 0 ? previousYearly.priceYearlyIncrease + 1 : 0
        yearlyDecrease = priceDiffer < 0 ? previousYearly.priceYearlyDecrease + 1 : 0
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
          priceYearlyDecrease: yearlyDecrease
        })
        : tickerDaily
      checkedDaily.push(daily)
    }
  }
  return tickers
}
