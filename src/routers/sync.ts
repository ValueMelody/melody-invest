import { Router } from 'express'
import * as syncTicketService from '../services/syncTicket'
import * as syncIndicatorService from '../services/syncIndicator'
import * as marketEnum from '../enums/market'

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

    const result = interval === marketEnum.INTERVAL.QUARTERLY
      ? await syncIndicatorService.syncGdpQuarterly()
      : await syncIndicatorService.syncGdpYearly()

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.error(e)
    throw e
  }
})
