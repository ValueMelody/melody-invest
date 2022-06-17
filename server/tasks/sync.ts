import * as syncTickers from 'services/syncTickers'
import * as syncIndicators from 'services/syncIndicators'
import * as dateTool from 'tools/date'
import * as marketEnum from 'enums/market'

const validateDateParam = (date: string) => {
  if (!date || date.length !== 10) throw new Error('no date or wrong date provided')
}

const validateQuarterParam = (date: string) => {
  if (!date || date.length !== 7) throw new Error('no quarter or wrong quarter provided')
}

export const syncTickerPrices = async () => {
  const date = process.argv[3] || dateTool.getCurrentDate()
  validateDateParam(date)
  await syncTickers.syncAllPrices(date)
}

export const syncTickerEarnings = async () => {
  const quarter = process.argv[3] || dateTool.getCurrentQuater()
  const startTickerId = process.argv[4] ? parseInt(process.argv[4]) : null
  validateQuarterParam(quarter)
  const forceRecheck = process.argv[4] === 'true' || false
  await syncTickers.syncAllEarnings(quarter, forceRecheck, startTickerId)
}

export const syncTickerIncomes = async () => {
  const quarter = process.argv[3] || dateTool.getCurrentQuater()
  const startTickerId = process.argv[4] ? parseInt(process.argv[4]) : null
  validateQuarterParam(quarter)
  const forceRecheck = process.argv[4] === 'true' || false
  await syncTickers.syncAllIncomes(quarter, forceRecheck, startTickerId)
}

export const syncMonthlyIndicators = async () => {
  await syncIndicators.syncAllMonthlyIndicators()
}

export const syncQuarterlyIndicators = async () => {
  await syncIndicators.syncQuarterly(marketEnum.Type.GDP)
}

export const syncYearlyIndicators = async () => {
  await syncIndicators.syncAllYearlyIndicators()
}
