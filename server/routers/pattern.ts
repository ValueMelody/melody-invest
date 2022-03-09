import { Router } from 'express'
import * as crudPatterns from '../services/crudPatterns'

const patternRouter = Router()
export default patternRouter

patternRouter.get('/top', async (req, res) => {
  const patterns = await crudPatterns.getTopPatterns()
  return res.status(200).send({ patterns })
})
