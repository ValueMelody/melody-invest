import { Router } from 'express'
import * as syncService from '../services/sync'

const syncRouter = Router()
export default syncRouter

syncRouter.get('/ticket/:region/:symbol/prices', async (req, res) => {
  const region = req.params.region
  const symbol = req.params.symbol
  const result = await syncService.syncTicketPrices(region, symbol)

  return res.status(200).send({
    result
  })
})

syncRouter.get('/ticket/:region/:symbol/earnings', async (req, res) => {

})
