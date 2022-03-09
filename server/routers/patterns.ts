import { Router } from 'express'
import * as crudPatterns from '../services/crudPatterns'

const patternsRouter = Router()
export default patternsRouter

patternsRouter.get('/top', async (req, res) => {
  const patterns = await crudPatterns.getTopPatterns()
  return res.status(200).send(patterns)
})
