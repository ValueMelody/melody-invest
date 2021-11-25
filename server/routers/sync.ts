import { Router } from 'express'
import * as syncTickets from '../services/syncTickets'
import * as syncIndicators from '../services/syncIndicators'
import * as marketEnum from '../enums/market'
import * as errorEnum from '../enums/error'

const syncRouter = Router()
export default syncRouter

syncRouter.get('/tickets/:type/:region/:symbol', async (req, res) => {
  const region = req.params.region
  const symbol = req.params.symbol
  const type = req.params.type
  const forceRecheck = req.query.forceRecheck === 'true'

  let result
  switch (type) {
    case 'prices':
      result = await syncTickets.syncPrices(region, symbol)
      break
    case 'earnings':
      result = await syncTickets.syncEarnings(region, symbol, forceRecheck)
      break
    case 'incomes':
      result = await syncTickets.syncIncomes(region, symbol, forceRecheck)
      break
    default:
      throw errorEnum.HTTP_ERRORS.FORBIDDEN
  }

  return res.status(200).send({ result })
})

syncRouter.get('/batch_tickets/:type', async (req, res) => {
  const type = req.params.type
  const date = String(req.query.date)
  const quarter = String(req.query.quarter)
  const year = String(req.query.year)
  const forceRecheck = req.query.forceRecheck === 'true'

  let result
  switch (type) {
    case 'prices':
      result = await syncTickets.syncAllPrices(date)
      break
    case 'earnings':
      result = await syncTickets.syncAllEarnings(year, quarter, forceRecheck)
      break
    case 'incomes':
      result = await syncTickets.syncAllIncomes(year, quarter, forceRecheck)
      break
    default:
      throw errorEnum.HTTP_ERRORS.FORBIDDEN
  }

  return res.status(200).send({ result })
})

syncRouter.get('/indicators/monthly/:type', async (req, res) => {
  const type = req.params.type

  let result
  switch (type) {
    case 'funds_rate':
      result = await syncIndicators.syncMonthly(marketEnum.TYPES.FUNDS_RATE)
      break
    case 'thirty_years_treasury':
      result = await syncIndicators.syncMonthly(
        marketEnum.TYPES.TREASURY_YIELD,
        { isThirtyYearsTreasury: true }
      )
      break
    case 'ten_years_treasury':
      result = await syncIndicators.syncMonthly(
        marketEnum.TYPES.TREASURY_YIELD,
        { isTenYearsTreasury: true }
      )
      break
    case 'cpi':
      result = await syncIndicators.syncMonthly(marketEnum.TYPES.CPI)
      break
    case 'inflation_expectation':
      result = await syncIndicators.syncMonthly(marketEnum.TYPES.INFLATION_EXPECTATION)
      break
    case 'consumer_sentiment':
      result = await syncIndicators.syncMonthly(marketEnum.TYPES.CONSUMER_SENTIMENT)
      break
    case 'durable_goods':
      result = await syncIndicators.syncMonthly(marketEnum.TYPES.DURABLE_GOODS)
      break
    case 'retail_sales':
      result = await syncIndicators.syncMonthly(marketEnum.TYPES.RETAIL_SALES)
      break
    case 'unemployment_rate':
      result = await syncIndicators.syncMonthly(marketEnum.TYPES.UNEMPLOYMENT_RATE)
      break
    case 'nonfarm_payroll':
      result = await syncIndicators.syncMonthly(marketEnum.TYPES.NONFARM_PAYROLL)
      break
    default:
      throw errorEnum.HTTP_ERRORS.FORBIDDEN
  }

  return res.status(200).send({
    result
  })
})

syncRouter.get('/indicators/quarterly/:type', async (req, res) => {
  const type = req.params.type

  let result
  switch (type) {
    case 'gdp':
      result = await syncIndicators.syncQuarterly(marketEnum.TYPES.GDP)
      break
    default:
      throw errorEnum.HTTP_ERRORS.FORBIDDEN
  }

  return res.status(200).send({
    result
  })
})

syncRouter.get('/indicators/yearly/:type', async (req, res) => {
  const type = req.params.type

  let result
  switch (type) {
    case 'inflation':
      result = await syncIndicators.syncYearly(
        marketEnum.TYPES.INFLATION,
        { valueLength: 5 }
      )
      break
    case 'gdp':
      result = await syncIndicators.syncYearly(marketEnum.TYPES.GDP)
      break
    default:
      throw errorEnum.HTTP_ERRORS.FORBIDDEN
  }

  return res.status(200).send({
    result
  })
})
