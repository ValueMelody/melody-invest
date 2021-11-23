import { Router } from 'express'
import * as syncTicketService from '../services/syncTicket'
import * as syncIndicatorService from '../services/syncIndicator'
import * as marketEnum from '../enums/market'
import * as errorEnum from '../enums/error'

const syncRouter = Router()
export default syncRouter

syncRouter.get('/ticket/:region/:symbol/prices', async (req, res) => {
  try {
    const region = req.params.region
    const symbol = req.params.symbol
    const result = await syncTicketService.syncPrices(region, symbol)

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.log(e)
  }
})

syncRouter.get('/ticket/:region/:symbol/earnings', async (req, res) => {
  try {
    const region = req.params.region
    const symbol = req.params.symbol
    const forceRecheck = req.query.forceRecheck === 'true'
    const result = await syncTicketService.syncEarnings(
      region,
      symbol,
      forceRecheck
    )

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.error(e)
    throw e
  }
})

syncRouter.get('/ticket/:region/:symbol/incomes', async (req, res) => {
  try {
    const region = req.params.region
    const symbol = req.params.symbol
    const forceRecheck = req.query.forceRecheck === 'true'
    const result = await syncTicketService.syncIncomes(
      region,
      symbol,
      forceRecheck
    )

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.error(e)
    throw e
  }
})

syncRouter.get('/ticket/earnings', async (req, res) => {
  try {
    const year = String(req.query.year)
    const quarter = String(req.query.quarter)
    const result = await syncTicketService.syncAllEarnings(year, quarter)

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.error(e)
    throw e
  }
})

syncRouter.get('/ticket/incomes', async (req, res) => {
  try {
    const year = String(req.query.year)
    const quarter = String(req.query.quarter)
    const result = await syncTicketService.syncAllIncomes(year, quarter)

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.error(e)
    throw e
  }
})

syncRouter.get('/ticket/prices', async (req, res) => {
  try {
    const date = String(req.query.date)
    const result = await syncTicketService.syncAllPrices(date)

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.error(e)
    throw e
  }
})

syncRouter.get('/indicator/monthly/:type', async (req, res) => {
  const type = req.params.type

  let result
  switch (type) {
    case 'funds_rate':
      result = await syncIndicatorService.syncMonthlyIndicators(marketEnum.TYPES.FUNDS_RATE)
      break
    case 'thirty_years_treasury':
      result = await syncIndicatorService.syncMonthlyIndicators(
        marketEnum.TYPES.TREASURY_YIELD,
        { isThirtyYearsTreasury: true }
      )
      break
    case 'ten_years_treasury':
      result = await syncIndicatorService.syncMonthlyIndicators(
        marketEnum.TYPES.TREASURY_YIELD,
        { isTenYearsTreasury: true }
      )
      break
    case 'cpi':
      result = await syncIndicatorService.syncMonthlyIndicators(marketEnum.TYPES.CPI)
      break
    case 'inflation_expectation':
      result = await syncIndicatorService.syncMonthlyIndicators(marketEnum.TYPES.INFLATION_EXPECTATION)
      break
    case 'consumer_sentiment':
      result = await syncIndicatorService.syncMonthlyIndicators(marketEnum.TYPES.CONSUMER_SENTIMENT)
      break
    case 'durable_goods':
      result = await syncIndicatorService.syncMonthlyIndicators(marketEnum.TYPES.DURABLE_GOODS)
      break
    case 'retail_sales':
      result = await syncIndicatorService.syncMonthlyIndicators(marketEnum.TYPES.RETAIL_SALES)
      break
    default:
      throw errorEnum.HTTP_ERRORS.FORBIDDEN
  }

  return res.status(200).send({
    result
  })
})

syncRouter.get('/indicator/quarterly/:type', async (req, res) => {
  const type = req.params.type

  let result
  switch (type) {
    case 'gdp':
      result = await syncIndicatorService.syncQuarterlyIndicators(marketEnum.TYPES.GDP)
      break
    default:
      throw errorEnum.HTTP_ERRORS.FORBIDDEN
  }

  return res.status(200).send({
    result
  })
})

syncRouter.get('/indicator/yearly/:type', async (req, res) => {
  const type = req.params.type

  let result
  switch (type) {
    case 'inflation':
      result = await syncIndicatorService.syncYearlyIndicators(
        marketEnum.TYPES.INFLATION,
        { valueLength: 5 }
      )
      break
    case 'gdp':
      result = await syncIndicatorService.syncYearlyIndicators(marketEnum.TYPES.GDP)
      break
    default:
      throw errorEnum.HTTP_ERRORS.FORBIDDEN
  }

  return res.status(200).send({
    result
  })
})
