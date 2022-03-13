import { Router } from 'express'
import * as crudTickers from '../services/crudTickers'

const tickerProfilesRouter = Router()
export default tickerProfilesRouter

tickerProfilesRouter.get('/identities', async (req, res) => {
  const names = await crudTickers.getTickerIdentities()
  return res.status(200).send(names)
})
