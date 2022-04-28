import { Router } from 'express'
import * as calcTraders from '../services/calcTraders'
import * as calcTraderPatterns from '../services/calcTraderPatterns'

const calcRouter = Router()
export default calcRouter

calcRouter.get('/traders/descendants', async (req, res) => {
  const result = await calcTraders.calcAllEnvDescendants()

  return res.status(200).send({ result })
})

calcRouter.get('/trader_patterns/hash_code', async (req, res) => {
  const result = await calcTraderPatterns.calcHashCode()

  return res.status(200).send({ result })
})
