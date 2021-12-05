import { Router } from 'express'
import * as evolveDNAs from '../services/evolveDNAs'

const evolveRouter = Router()
export default evolveRouter

evolveRouter.get('/random_DNAs', async (req, res) => {
  const result = await evolveDNAs.generateRandomDNAs()

  return res.status(200).send({ result })
})
