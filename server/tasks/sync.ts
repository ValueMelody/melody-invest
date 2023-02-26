import * as marketEnum from 'enums/market'
import * as syncIndicators from 'services/syncIndicators'
import * as syncTickers from 'services/syncTickers'

const validateDateParam = (date: string) => {
  if (!date || date.length !== 10) throw new Error('no date or wrong date provided')
}

const validateQuarterParam = (date: string) => {
  if (!date || date.length !== 7) throw new Error('no quarter or wrong quarter provided')
}

export const syncTickerPrices = async (date: string) => {
  console.info('Start sync ticker prices')
  validateDateParam(date)

  try {
    const notes = await syncTickers.syncAllPrices(date)

    notes.forEach((note) => console.info(note))

    console.info('ticker prices synced')
  } catch (e) {
    console.error('Error occured:')
    console.error(e)
  }
}

export const syncTickerEarnings = async (
  quarter: string,
  forceRecheck: boolean,
  startTickerId: number | null,
) => {
  validateQuarterParam(quarter)
  try {
    console.info('Start sync ticker earnings')
    await syncTickers.syncAllEarnings(quarter, forceRecheck, startTickerId)
    console.info('ticker earnings synced')
  } catch (e) {
    console.error('Error occured:')
    console.error(e)
  }
}

export const syncTickerIncomes = async (
  quarter: string,
  forceRecheck: boolean,
  startTickerId: number | null,
) => {
  validateQuarterParam(quarter)
  try {
    console.info('Start sync ticker incomes')
    await syncTickers.syncAllIncomes(quarter, forceRecheck, startTickerId)
    console.info('ticker incomes synced')
  } catch (e) {
    console.error('Error occured:')
    console.error(e)
  }
}

export const syncEconomyIndicators = async () => {
  try {
    console.info('Start economy indicators')
    await syncIndicators.syncAllMonthlyIndicators()
    await syncIndicators.syncQuarterly(marketEnum.Type.GDP)
    await syncIndicators.syncAllYearlyIndicators()
    console.info('economy indicators synced')
  } catch (e) {
    console.error('Error occured:')
    console.error(e)
  }
}
