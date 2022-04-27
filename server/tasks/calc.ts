import * as calcTickers from '../services/calcTickers'

export const calcPriceMovements = async () => {
  await calcTickers.calcAllTickersAveragePrice()
  await calcTickers.calcAllTickersPriceMovement()
}
