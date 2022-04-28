import * as calcTickers from '../services/calcTickers'
import * as calcIndicators from '../services/calcIndicators'
import * as calcTraders from '../services/calcTraders'

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
  const forceRecheck = process.argv[3] === 'true' || false
  await calcTickers.calcDailyAvailableTickers(forceRecheck)
}

export const calcTraderPerformances = async () => {
  const forceRecheck = process.argv[3] === 'true' || false
  await calcTraders.calcAllTraderPerformances(forceRecheck)
}
