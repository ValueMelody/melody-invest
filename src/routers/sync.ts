import { Router } from 'express'
import * as syncTicketService from '../services/syncTicket'

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
    const forceCheckQuarterly = req.query.forceQuarterly === 'true'
    const result = await syncTicketService.syncEarnings(
      region,
      symbol,
      forceCheckQuarterly
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
