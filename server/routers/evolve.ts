import { Router } from 'express'
import * as evolveDNAs from '../services/evolveDNAs'
import * as evolveTraders from '../services/evolveTraders'

const evolveRouter = Router()
export default evolveRouter

evolveRouter.get('/random_DNAs', async (req, res) => {
  const result = await evolveDNAs.generateRandomDNAs()

  return res.status(200).send({ result })
})

evolveRouter.get('/env/:id', async (req, res) => {
  const envId = parseInt(req.params.id)

  const result = await evolveTraders.updateEnvTrades(envId)

  return res.status(200).send({ result })
})
