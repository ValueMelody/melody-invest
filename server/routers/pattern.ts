import { Router } from 'express'

const patternRouter = Router()
export default patternRouter

patternRouter.get('/top', async (req, res) => {
  return res.status(200).send({ result: 'success' })
})
