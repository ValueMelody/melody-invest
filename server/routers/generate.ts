import { Router } from 'express'
import * as generate from '../services/generate'

const generateRouter = Router()
export default generateRouter

generateRouter.get('/DNAs', async (req, res) => {
  const result = await generate.generateAllDNAs()

  return res.status(200).send({ result })
})
