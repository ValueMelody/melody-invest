import { Router } from 'express'
import * as interfaces from '@shared/interfaces'
import * as errorEnum from '../enums/error'
import * as crudUsers from '../services/crudUsers'
import * as crudTraders from '../services/crudTraders'
import * as verifyTool from '../tools/verify'
import * as authMiddleware from '../middlewares/auth'

const usersRouter = Router()
export default usersRouter

const validEmailAndPassword = (email: string, password: string) => {
  if (!email || !password) throw errorEnum.CUSTOM.PARAMS_MISSING
  if (email.length > 100) throw errorEnum.CUSTOM.EMAIL_TOO_LONG
  if (password.length < 10) throw errorEnum.CUSTOM.PASSWORD_TOO_SHORT
  const isEmail = verifyTool.isEmail(email)
  if (!isEmail) throw errorEnum.CUSTOM.EMAIL_WRONG_FORMAT
}

usersRouter.post('/token', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase()
  const password = req.body.password?.trim()
  const remember = req.body.remember

  validEmailAndPassword(email, password)

  const userToken = await crudUsers.createUserToken(email, password, remember)
  return res.status(201).send(userToken)
})

usersRouter.post('/', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase()
  const password = req.body.password?.trim()
  const isConfirmed = req.body.isConfirmed

  if (!isConfirmed) throw errorEnum.CUSTOM.PARAMS_MISSING
  validEmailAndPassword(email, password)

  const user = await crudUsers.createUser(email, password)
  return res.status(201).send(user)
})

usersRouter.get('/overall', authMiddleware.normalUser, async (req, res) => {
  const auth: interfaces.common.Auth = req.body.auth
  const overall = await crudUsers.getUserOverall(auth.id)
  return res.status(200).send(overall)
})

const validTraderId = (traderId: number) => {
  if (!traderId) throw errorEnum.DEFAULT.FORBIDDEN
}

usersRouter.post('/traders/:trader_id', authMiddleware.normalUser, async (req, res) => {
  const traderId = parseInt(req.params.trader_id)
  validTraderId(traderId)

  const auth: interfaces.common.Auth = req.body.auth
  await crudTraders.createFollowedTrader(auth.id, traderId)
  return res.status(201).send()
})

usersRouter.delete('/traders/:trader_id', authMiddleware.normalUser, async (req, res) => {
  const traderId = parseInt(req.params.trader_id)
  validTraderId(traderId)

  const auth: interfaces.common.Auth = req.body.auth
  await crudTraders.deleteFollowedTrader(auth.id, traderId)
  return res.status(204).send()
})
