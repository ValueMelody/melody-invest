import { Router } from 'express'
import { syncTicket } from '../services/sync'

const syncRouter = Router()
export default syncRouter

syncRouter.get('/ticket/:region/:symbol', async (req, res) => {
  const region = req.params.region
  const symbol = req.params.symbol
  const result = await syncTicket(region, symbol)

  return res.status(200).send({
    result
  })
})
