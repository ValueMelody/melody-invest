import * as tickerModel from '../models/ticker'
import * as tickerDailyModel from '../models/tickerDaily'
import * as dateTool from '../tools/date'

export const calculateDaily = async (): Promise<tickerModel.Ticker[]> => {
  const tickers = await tickerModel.getAll()

  for (const ticker of tickers) {
    const lastCheckedDate = ticker.lastDailyChecked ?? dateTool.getInitialDate()

    const tickerDailyRecords = await tickerDailyModel.getNextAll(ticker.id, lastCheckedDate)
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
        dailyIncrease = priceDiffer > 0 ? previousDaily.priceDailyIncrease + 1 : previousDaily.priceDailyIncrease
        dailyDecrease = priceDiffer < 0 ? previousDaily.priceDailyDecrease + 1 : previousDaily.priceDailyDecrease
      }

      const updatedDaily = await tickerDailyModel.update(tickerDaily.id, {
        priceDailyIncrease: dailyIncrease,
        priceDailyDecrease: dailyDecrease
      })
      checkedDaily.push(updatedDaily)
    }
    const newestRecord = checkedDaily[checkedDaily.length - 1]
    await tickerModel.update(ticker.id, {
      lastDailyChecked: newestRecord.date
    })
  }
  return tickers
}
