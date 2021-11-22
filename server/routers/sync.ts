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

syncRouter.get('/indicator/gdp/:interval', async (req, res) => {
  try {
    const interval = req.params.interval

    const isAllowedInterval = Object.values(marketEnum.GDP_INTERVAL).includes(interval)
    if (!isAllowedInterval) throw errorEnum.HTTP_ERRORS.FORBIDDEN

    const result = await syncIndicatorService.syncRealGDP(interval)

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.error(e)
    throw e
  }
})

syncRouter.get('/indicator/funds_rate', async (req, res) => {
  try {
    const result = await syncIndicatorService.syncMonthlyIndicators(marketEnum.TYPES.FUNDS_RATE)

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.error(e)
    throw e
  }
})

syncRouter.get('/indicator/treasury_yield/thirty_years', async (req, res) => {
  try {
    const result = await syncIndicatorService.syncMonthlyIndicators(
      marketEnum.TYPES.TREASURY_YIELD,
      { isThirtyYearsTreasury: true }
    )

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.error(e)
    throw e
  }
})

syncRouter.get('/indicator/treasury_yield/ten_years', async (req, res) => {
  try {
    const result = await syncIndicatorService.syncMonthlyIndicators(
      marketEnum.TYPES.TREASURY_YIELD,
      { isTenYearsTreasury: true }
    )

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.error(e)
    throw e
  }
})

syncRouter.get('/indicator/cpi', async (req, res) => {
  try {
    const result = await syncIndicatorService.syncMonthlyIndicators(marketEnum.TYPES.CPI)

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.error(e)
    throw e
  }
})

syncRouter.get('/indicator/inflation', async (req, res) => {
  try {
    const result = await syncIndicatorService.syncInflation()

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.error(e)
    throw e
  }
})

syncRouter.get('/indicator/inflation_expectation', async (req, res) => {
  try {
    const result = await syncIndicatorService.syncMonthlyIndicators(marketEnum.TYPES.INFLATION_EXPECTATION)

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.error(e)
    throw e
  }
})

syncRouter.get('/indicator/consumer_sentiment', async (req, res) => {
  try {
    const result = await syncIndicatorService.syncMonthlyIndicators(marketEnum.TYPES.CONSUMER_SENTIMENT)

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.error(e)
    throw e
  }
})

syncRouter.get('/indicator/retail_sales', async (req, res) => {
  try {
    const result = await syncIndicatorService.syncMonthlyIndicators(marketEnum.TYPES.RETAIL_SALES)

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.error(e)
    throw e
  }
})

syncRouter.get('/indicator/durable_goods', async (req, res) => {
  try {
    const result = await syncIndicatorService.syncMonthlyIndicators(marketEnum.TYPES.DURABLE_GOODS)

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.error(e)
    throw e
  }
})
