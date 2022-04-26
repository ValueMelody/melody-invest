import { Router } from 'express'
import * as syncTickers from '../services/syncTickers'
import * as syncIndicators from '../services/syncIndicators'
import * as marketEnum from '../enums/market'
import * as errorEnum from '../enums/error'

const syncRouter = Router()
export default syncRouter

syncRouter.get('/tickers/:type/:region/:symbol', async (req, res) => {
  const region = req.params.region
  const symbol = req.params.symbol
  const type = req.params.type
  const forceRecheck = req.query.forceRecheck === 'true'

  let result
  switch (type) {
    case 'earnings':
      result = await syncTickers.syncEarnings(region, symbol, forceRecheck)
      break
    case 'incomes':
      result = await syncTickers.syncIncomes(region, symbol, forceRecheck)
      break
    default:
      throw errorEnum.Default.NotFound
  }

  return res.status(200).send({ result })
})

syncRouter.get('/batch_tickers/:type', async (req, res) => {
  const type = req.params.type
  const quarter = String(req.query.quarter)
  const year = String(req.query.year)
  const forceRecheck = req.query.forceRecheck === 'true'

  let result
  switch (type) {
    case 'earnings':
      result = await syncTickers.syncAllEarnings(year, quarter, forceRecheck)
      break
    case 'incomes':
      result = await syncTickers.syncAllIncomes(year, quarter, forceRecheck)
      break
    default:
      throw errorEnum.Default.NotFound
  }

  return res.status(200).send({ result })
})

syncRouter.get('/indicators/monthly/:type', async (req, res) => {
  const type = req.params.type

  let result
  switch (type) {
    case 'funds_rate':
      result = await syncIndicators.syncMonthly(marketEnum.Type.FundsRate)
      break
    case 'thirty_years_treasury':
      result = await syncIndicators.syncMonthly(
        marketEnum.Type.TreasuryYield,
        { isThirtyYearsTreasury: true },
      )
      break
    case 'ten_years_treasury':
      result = await syncIndicators.syncMonthly(
        marketEnum.Type.TreasuryYield,
        { isTenYearsTreasury: true },
      )
      break
    case 'cpi':
      result = await syncIndicators.syncMonthly(marketEnum.Type.CPI)
      break
    case 'inflation_expectation':
      result = await syncIndicators.syncMonthly(marketEnum.Type.InflationExpectation)
      break
    case 'consumer_sentiment':
      result = await syncIndicators.syncMonthly(marketEnum.Type.ConsumerSentiment)
      break
    case 'durable_goods':
      result = await syncIndicators.syncMonthly(marketEnum.Type.DurableGoods)
      break
    case 'retail_sales':
      result = await syncIndicators.syncMonthly(marketEnum.Type.RetailSales)
      break
    case 'unemployment_rate':
      result = await syncIndicators.syncMonthly(marketEnum.Type.UnemploymentRate)
      break
    case 'nonfarm_payroll':
      result = await syncIndicators.syncMonthly(marketEnum.Type.NonfarmPayroll)
      break
    default:
      throw errorEnum.Default.NotFound
  }

  return res.status(200).send({ result })
})

syncRouter.get('/indicators/quarterly/:type', async (req, res) => {
  const type = req.params.type

  let result
  switch (type) {
    case 'gdp':
      result = await syncIndicators.syncQuarterly(marketEnum.Type.GDP)
      break
    default:
      throw errorEnum.Default.NotFound
  }

  return res.status(200).send({ result })
})

syncRouter.get('/indicators/yearly/:type', async (req, res) => {
  const type = req.params.type

  let result
  switch (type) {
    case 'inflation':
      result = await syncIndicators.syncYearly(
        marketEnum.Type.Inflation,
        { valueLength: 5 },
      )
      break
    case 'gdp':
      result = await syncIndicators.syncYearly(marketEnum.Type.GDP)
      break
    default:
      throw errorEnum.Default.NotFound
  }

  return res.status(200).send({
    result,
  })
})
