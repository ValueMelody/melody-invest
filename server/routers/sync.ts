import { Router } from 'express'
import * as syncTicketService from '../services/syncTicket'

const syncRouter = Router()
export default syncRouter

syncRouter.get('/ticket/:region/:symbol/prices', async (req, res) => {
  try {
    const region = req.params.region
    const symbol = req.params.symbol
    const result = await syncTicketService.syncTicketPrices(region, symbol)

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
    const result = await syncTicketService.syncTicketEarnings(region, symbol)

    return res.status(200).send({
      result
    })
  } catch (e) {
    console.log(e)
  }
})
