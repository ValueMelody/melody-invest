import * as syncTickers from '../services/syncTickers'
import * as dateTool from '../tools/date'

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
  validateQuarterParam(quarter)
  const forceRecheck = process.argv[4] === 'true' || false
  await syncTickers.syncAllEarnings(quarter, forceRecheck)
}

export const syncTickerIncomes = async () => {
  const quarter = process.argv[3] || dateTool.getCurrentQuater()
  validateQuarterParam(quarter)
  const forceRecheck = process.argv[4] === 'true' || false
  await syncTickers.syncAllIncomes(quarter, forceRecheck)
}
