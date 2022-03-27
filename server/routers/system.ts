import { Router } from 'express'
import * as crudSystems from '../services/crudSystems'

const systemRouter = Router()
export default systemRouter

systemRouter.get('/defaults', async (req, res) => {
  const defaults = await crudSystems.getDefaults()
  return res.status(200).send(defaults)
})