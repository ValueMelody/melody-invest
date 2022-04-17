import { Router } from 'express'
import * as calcTickers from '../services/calcTickers'
import * as calcTraders from '../services/calcTraders'
import * as calcTraderPatterns from '../services/calcTraderPatterns'
import * as calcIndicators from '../services/calcIndicators'

const calcRouter = Router()
export default calcRouter

calcRouter.get('/tickers/average_price', async (req, res) => {
  const result = await calcTickers.calcAllTickersAveragePrice()

  return res.status(200).send({ result })
})

calcRouter.get('/tickers/price_movement', async (req, res) => {
  const result = await calcTickers.calcAllTickersPriceMovement()

  return res.status(200).send({ result })
})

calcRouter.get('/tickers/quarterly_financial', async (req, res) => {
  const result = await calcTickers.calcAllTickersQuarterlyFinancial()

  return res.status(200).send({ result })
})

calcRouter.get('/tickers/daily_available', async (req, res) => {
  const forceRecheck = req.query.forceRecheck === 'true'
  await calcTickers.calcDailyAvailableTickers(forceRecheck)

  return res.status(200).send({ success: true })
})

calcRouter.get('/tickers/yearly_financial', async (req, res) => {
  const result = await calcTickers.calcAllTickersYearlyFinancial()

  return res.status(200).send({ result })
})

calcRouter.get('/indicators/yearly', async (req, res) => {
  const result = await calcIndicators.calcYearly()

  return res.status(200).send({ result })
})

calcRouter.get('/indicators/quarterly', async (req, res) => {
  const result = await calcIndicators.calcQuarterly()

  return res.status(200).send({ result })
})

calcRouter.get('/indicators/monthly', async (req, res) => {
  const result = await calcIndicators.calcMonthly()

  return res.status(200).send({ result })
})

calcRouter.get('/traders/performance', async (req, res) => {
  const forceRecheck = req.query.forceRecheck === 'true'

  const result = await calcTraders.calcAllTradersPerformance(forceRecheck)

  return res.status(200).send({ result })
})

calcRouter.get('/traders/descendants', async (req, res) => {
  const result = await calcTraders.calcAllEnvDescendants()

  return res.status(200).send({ result })
})

calcRouter.get('/trader_patterns/hash_code', async (req, res) => {
  const result = await calcTraderPatterns.calcHashCode()

  return res.status(200).send({ result })
})
