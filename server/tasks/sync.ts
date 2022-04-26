import * as syncTickers from '../services/syncTickers'

const validateDateParam = (date: string) => {
  if (!date || date.length !== 10) throw new Error('no date or wrong date provided')
}

export const syncTickerPrices = async () => {
  const date = process.argv[3]
  validateDateParam(date)
  await syncTickers.syncAllPrices(date)
}
