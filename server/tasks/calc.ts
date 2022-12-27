import * as calcIndicators from 'services/calcIndicators'
import * as calcTickers from 'services/calcTickers'
import * as calcTraders from 'services/calcTraders'

export const calcPriceMovements = async () => {
  await calcTickers.calcAllTickersAveragePrice()
  await calcTickers.calcAllTickersPriceMovement()
}

export const calcFinancialMovements = async () => {
  await calcTickers.calcAllTickersQuarterlyFinancial()
  await calcTickers.calcAllTickersYearlyFinancial()
}

export const calcIndicatorMovements = async () => {
  const forceRecheck = process.argv[3] === 'true' || false
  await calcIndicators.calcYearly()
  await calcIndicators.calcQuarterly()
  await calcIndicators.calcMonthly(forceRecheck)
}

export const calcDailyTickers = async () => {
  console.info('Start calc daily tickers')
  try {
    const forceRecheck = process.argv[3] === 'true' || false
    await calcTickers.calcDailyAvailableTickers(forceRecheck)
    console.info('daily tickers calculated')
  } catch (e) {
    console.error('Error occured:')
    console.error(e)
  }
}

export const calcTraderPerformances = async () => {
  console.info('Start calc trader performances')
  try {
    const forceRecheck = process.argv[3] === 'true' || false
    await calcTraders.calcAllTraderPerformances(forceRecheck)
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
