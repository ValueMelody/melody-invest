import { Router } from 'express'
import * as crudTraders from '../services/crudTraders'
import * as errorEnums from '../enums/error'

const tradersRouter = Router()
export default tradersRouter

tradersRouter.get('/top', async (req, res) => {
  const patterns = await crudTraders.getTopPatterns()
  return res.status(200).send(patterns)
})

tradersRouter.get('/:id/:access_code', async (req, res) => {
  const id = parseInt(req.params.id)
  const accessCode = req.params.access_code
  const hasValidParam = id && accessCode && accessCode.length === 16
  if (!hasValidParam) throw errorEnums.HTTP_ERRORS.FORBIDDEN
  const trader = await crudTraders.getTrader(id, accessCode)
  return res.status(200).send(trader)
})
