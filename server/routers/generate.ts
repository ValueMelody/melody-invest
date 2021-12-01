import { Router } from 'express'
import * as generateRNAs from '../services/generate'

const generateRouter = Router()
export default generateRouter

generateRouter.get('/base_RNAs', async (req, res) => {
  const result = await generateRNAs.generateBaseRNAs()

  return res.status(200).send({ result })
})
