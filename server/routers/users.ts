import { Router } from 'express'
import * as interfaces from '@shared/interfaces'
import * as errorEnum from '../enums/error'
import * as crudUsers from '../services/crudUsers'
import * as crudTraders from '../services/crudTraders'
import * as verifyTool from '../tools/verify'
import * as authMiddleware from '../middlewares/auth'

const usersRouter = Router()
export default usersRouter

// ------------------------------------------------------------ Validate --

const validateEmail = (email: string) => {
  if (!email) throw errorEnum.CUSTOM.PARAMS_MISSING
  if (email.length > 100) throw errorEnum.CUSTOM.EMAIL_TOO_LONG
  const isEmail = verifyTool.isEmail(email)
  if (!isEmail) throw errorEnum.CUSTOM.EMAIL_WRONG_FORMAT
}

const validatePassword = (password: string) => {
  if (!password) throw errorEnum.CUSTOM.PARAMS_MISSING
  if (password.length < 10) throw errorEnum.CUSTOM.PASSWORD_TOO_SHORT
}

const validateTraderId = (traderId: number) => {
  if (!traderId) throw errorEnum.DEFAULT.FORBIDDEN
}

// ------------------------------------------------------------ Get --

usersRouter.get('/overall', authMiddleware.normalUser, async (req, res) => {
  const auth: interfaces.reqs.Auth = req.body.auth
  const overall = await crudUsers.getUserOverall(auth.id)
  return res.status(200).send(overall)
})

// ------------------------------------------------------------ Post --

usersRouter.post('/token', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase()
  const password = req.body.password?.trim()
  const remember = req.body.remember

  validateEmail(email)
  validatePassword(password)

  const userToken = await crudUsers.createUserToken(email, password, remember)
  return res.status(201).send(userToken)
})

usersRouter.post('/', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase()
  const password = req.body.password?.trim()
  const isConfirmed = req.body.isConfirmed

  if (!isConfirmed) throw errorEnum.CUSTOM.PARAMS_MISSING
  validateEmail(email)
  validatePassword(password)

  const user = await crudUsers.createUser(email, password)
  return res.status(201).send(user)
})

usersRouter.post('/traders/:trader_id', authMiddleware.normalUser, async (req, res) => {
  const traderId = parseInt(req.params.trader_id)
  validateTraderId(traderId)

  const auth: interfaces.reqs.Auth = req.body.auth
  await crudTraders.createFollowedTrader(auth.id, traderId)
  return res.status(201).send()
})

// ------------------------------------------------------------ Put --

usersRouter.put('/password', authMiddleware.normalUser, async (req, res) => {
  const currentPassword = req.body.currentPassword?.trim()
  const newPassword = req.body.newPassword?.trim()

  validatePassword(currentPassword)
  validatePassword(newPassword)

  const auth: interfaces.reqs.Auth = req.body.auth
  await crudUsers.updatePassword(auth.id, currentPassword, newPassword)
  return res.status(204).send()
})

// ------------------------------------------------------------ Delete --

usersRouter.delete('/traders/:trader_id', authMiddleware.normalUser, async (req, res) => {
  const traderId = parseInt(req.params.trader_id)
  validateTraderId(traderId)

  const auth: interfaces.reqs.Auth = req.body.auth
  await crudTraders.deleteFollowedTrader(auth.id, traderId)
  return res.status(204).send()
})
