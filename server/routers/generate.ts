import { Router } from 'express'
import * as generateDNAs from '../services/generate'

const generateRouter = Router()
export default generateRouter

generateRouter.get('/base_DNAs', async (req, res) => {
  const result = await generateDNAs.generateBaseDNAs()

  return res.status(200).send({ result })
})
