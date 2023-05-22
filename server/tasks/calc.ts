import * as calcIndicators from 'services/calcIndicators'
import * as calcTickers from 'services/calcTickers'
import * as calcTraders from 'services/calcTraders'

export const calcPriceMovements = async () => {
  console.info('Start calc tickers price movements')
  try {
    await calcTickers.calcAllTickersAveragePrice()
    await calcTickers.calcAllTickersPriceMovement()
    console.info('tickers price movements calculated')
  } catch (e) {
    console.error('Error occured:')
    console.error(e)
  }
}

export const calcFinancialMovements = async () => {
  console.info('Start calc tickers financial movements')
  try {
    await calcTickers.calcAllTickersQuarterlyFinancial()
    await calcTickers.calcAllTickersYearlyFinancial()
    console.info('tickers financial movements calculated')
  } catch (e) {
    console.error('Error occured:')
    console.error(e)
  }
}

export const calcIndicatorMovements = async () => {
  console.info('Start calc indicator movements')
  try {
    await calcIndicators.calcYearly()
    await calcIndicators.calcQuarterly()
    await calcIndicators.calcMonthly()
    console.info('indicator movements calculated')
  } catch (e) {
    console.error('Error occured:')
    console.error(e)
  }
}

export const calcDailyTickers = async (
  forceRecheck: boolean,
  startDate?: string,
) => {
  console.info('Start calc daily tickers')
  try {
    await calcTickers.calcDailyAvailableTickers(forceRecheck, startDate)
    console.info('daily tickers calculated')
  } catch (e) {
    console.error('Error occured:')
    console.error(e)
  }
}

export const calcTraderPerformances = async (
  forceRecheck: boolean,
  checkAll?: boolean,
) => {
  console.info('Start calc trader performances')
  try {
    await calcTraders.calcAllTraderPerformances(forceRecheck, checkAll || false)
    console.info('trader performances calculated')
  } catch (e) {
    console.error('Error occured:')
    console.error(e)
  }
}

export const calcTraderDescendants = async () => {
  console.info('Start calc trader descendants')
  try {
    await calcTraders.calcAllEnvDescendants()
    console.info('trader descendants calculated')
  } catch (e) {
    console.error('Error occured:')
    console.error(e)
  }
}

export const calcTraderAccessHashs = async () => {
  console.info('Start calc trader access hashs')
  try {
    await calcTraders.calcTraderAccessHashs()
    console.info('trader access hashs calculated')
  } catch (e) {
    console.error('Error occured:')
    console.error(e)
  }
}
