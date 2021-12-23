import * as tickerModel from '../models/ticker'
import * as tickerDailyModel from '../models/tickerDaily'

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
      if (index >= 5 && tickerDaily.weeklyAveragePrice === null) {
        const relatedDaily = tickerDailyRecords.slice(index - 5, index)
        weeklyAverage = calcAverage(relatedDaily)
        hasUpdate = true
      }

      let monthlyAverage = tickerDaily.monthlyAveragePrice
      if (index >= 20 && tickerDaily.monthlyAveragePrice === null) {
        const relatedDaily = tickerDailyRecords.slice(index - 20, index)
        monthlyAverage = calcAverage(relatedDaily)
        hasUpdate = true
      }

      let quarterlyAverage = tickerDaily.quarterlyAveragePrice
      if (index >= 80 && tickerDaily.quarterlyAveragePrice === null) {
        const relatedDaily = tickerDailyRecords.slice(index - 80, index)
        quarterlyAverage = calcAverage(relatedDaily)
        hasUpdate = true
      }

      let yearlyAverage = tickerDaily.yearlyAveragePrice
      if (index >= 320 && tickerDaily.yearlyAveragePrice === null) {
        const relatedDaily = tickerDailyRecords.slice(index - 320, index)
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

    const checkedDaily = []
    for (const tickerDaily of tickerDailyRecords) {
      const previousDaily = checkedDaily.length === 0
        ? await tickerDailyModel.getPreviousOne(ticker.id, tickerDaily.date)
        : checkedDaily[checkedDaily.length - 1]

      let dailyIncrease = 0
      let dailyDecrease = 0
      if (previousDaily) {
        const priceDiffer = parseFloat(tickerDaily.adjustedClosePrice) - parseFloat(previousDaily.adjustedClosePrice)
        dailyIncrease = priceDiffer > 0 ? previousDaily.priceDailyIncrease + 1 : 0
        dailyDecrease = priceDiffer < 0 ? previousDaily.priceDailyDecrease + 1 : 0
      }

      const updatedDaily = await tickerDailyModel.update(tickerDaily.id, {
        priceDailyIncrease: dailyIncrease,
        priceDailyDecrease: dailyDecrease
      })
      checkedDaily.push(updatedDaily)
    }
  }
  return tickers
}