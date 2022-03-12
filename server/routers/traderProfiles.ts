import { Router } from 'express'
import * as crudTraderStats from '../services/crudTraderProfiles'
import * as errorEnums from '../enums/error'

const traderProfilesRouter = Router()
export default traderProfilesRouter

traderProfilesRouter.get('/top', async (req, res) => {
  const patterns = await crudTraderStats.getTopPatterns()
  return res.status(200).send(patterns)
})

traderProfilesRouter.get('/:id/:access_code', async (req, res) => {
  const id = parseInt(req.params.id)
  const accessCode = req.params.access_code
  const hasValidParam = id && accessCode && accessCode.length === 16
  if (!hasValidParam) throw errorEnums.HTTP_ERRORS.FORBIDDEN
  const trader = await crudTraderStats.getTraderStat(id, accessCode)
  return res.status(200).send(trader)
})
