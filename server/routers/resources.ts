import { Router } from 'express'
import * as crudResources from '../services/crudResources'

const resourcesRouter = Router()
export default resourcesRouter

resourcesRouter.get('/top', async (req, res) => {
  const patterns = await crudResources.getTopPatterns()
  return res.status(200).send(patterns)
})
