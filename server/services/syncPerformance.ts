import * as tickerModel from '../models/ticker'
import * as tickerDailyModel from '../models/tickerDaily'

export const calcAveragePrice = async (): Promise<tickerModel.Ticker[]> => {
  const tickers = await tickerModel.getAll()

  for (const ticker of tickers) {
    const tickerDailyRecords = await tickerDailyModel.getAll(ticker.id)
    if (!tickerDailyRecords.length) continue

    let index = -1
    for (const tickerDaily of tickerDailyRecords) {
      index++
      if (tickerDaily.weeklyAveragePrice !== null && index < 5) continue

      const relatedDaily = tickerDailyRecords.slice(index - 5, index)
      const relatedTotal = relatedDaily.reduce((total, daily) => {
        const price = parseFloat(daily.adjustedClosePrice)
        return total + price
      }, 0)
      const avgTotal = relatedTotal / 5
      await tickerDailyModel.update(tickerDaily.id, {
        weeklyAveragePrice: avgTotal.toFixed(2)
      })
    }
  }
  return tickers
}

export const calculateDaily = async (): Promise<tickerModel.Ticker[]> => {
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
