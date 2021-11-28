import { Router } from 'express'
import * as generateRNAs from '../services/generate'

const generateRouter = Router()
export default generateRouter

generateRouter.get('/rnas', async (req, res) => {
  const result = await generateRNAs.generateAllRNAs()

  return res.status(200).send({ result })
})
