import * as calcTickers from '../services/calcTickers'
import * as calcIndicators from '../services/calcIndicators'

export const calcPriceMovements = async () => {
  await calcTickers.calcAllTickersAveragePrice()
  await calcTickers.calcAllTickersPriceMovement()
}

export const calcFinancialMovements = async () => {
  await calcTickers.calcAllTickersQuarterlyFinancial()
  await calcTickers.calcAllTickersYearlyFinancial()
}

export const calcIndicatorMovements = async () => {
  await calcIndicators.calcYearly()
  await calcIndicators.calcQuarterly()
  await calcIndicators.calcMonthly()
}
