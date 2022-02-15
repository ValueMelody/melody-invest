import { Router } from 'express'
import * as calcTickers from '../services/calcTickers'
import * as calcTraders from '../services/calcTraders'

const calcRouter = Router()
export default calcRouter

calcRouter.get('/tickers/average_price', async (req, res) => {
  const result = await calcTickers.calcAveragePrice()

  return res.status(200).send({ result })
})

calcRouter.get('/tickers/price_movement', async (req, res) => {
  const result = await calcTickers.calcPriceMovement()

  return res.status(200).send({ result })
})

calcRouter.get('/tickers/quarterly_financial', async (req, res) => {
  const result = await calcTickers.calcQuarterlyFinancial()

  return res.status(200).send({ result })
})

calcRouter.get('/traders/performance', async (req, res) => {
  const result = await calcTraders.calcPerformance()

  return res.status(200).send({ result })
})
