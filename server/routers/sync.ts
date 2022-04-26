import { Router } from 'express'
import * as syncIndicators from '../services/syncIndicators'
import * as marketEnum from '../enums/market'
import * as errorEnum from '../enums/error'

const syncRouter = Router()
export default syncRouter

syncRouter.get('/indicators/quarterly/:type', async (req, res) => {
  const type = req.params.type

  let result
  switch (type) {
    case 'gdp':
      result = await syncIndicators.syncQuarterly(marketEnum.Type.GDP)
      break
    default:
      throw errorEnum.Default.NotFound
  }

  return res.status(200).send({ result })
})

syncRouter.get('/indicators/yearly/:type', async (req, res) => {
  const type = req.params.type

  let result
  switch (type) {
    case 'inflation':
      result = await syncIndicators.syncYearly(
        marketEnum.Type.Inflation,
        { valueLength: 5 },
      )
      break
    case 'gdp':
      result = await syncIndicators.syncYearly(marketEnum.Type.GDP)
      break
    default:
      throw errorEnum.Default.NotFound
  }

  return res.status(200).send({
    result,
  })
})
