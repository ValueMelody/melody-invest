import { Router } from 'express'
import * as interfaces from '@shared/interfaces'
import * as errorEnum from '../enums/error'
import * as crudUsers from '../services/crudUsers'
import * as verifyTool from '../tools/verify'
import * as authMiddleware from '../middlewares/auth'

const usersRouter = Router()
export default usersRouter

// ------------------------------------------------------------ Validate --

const validateEmail = (email: string) => {
  if (!email) throw errorEnum.Custom.MissingParams
  if (email.length > 100) throw errorEnum.Custom.EmailTooLong
  const isEmail = verifyTool.isEmail(email)
  if (!isEmail) throw errorEnum.Custom.EmailWrongFormat
}

const validatePassword = (password: string) => {
  if (!password) throw errorEnum.Custom.MissingParams
  if (password.length < 10) throw errorEnum.Custom.PasswordTooShort
}

// ------------------------------------------------------------ Get --

usersRouter.get('/overall', authMiddleware.normalUser, async (req, res) => {
  const auth: interfaces.request.Auth = req.body.auth
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

  if (!isConfirmed) throw errorEnum.Custom.MissingParams
  validateEmail(email)
  validatePassword(password)

  const user = await crudUsers.createUser(email, password)
  return res.status(201).send(user)
})

// ------------------------------------------------------------ Put --

usersRouter.put('/password', authMiddleware.normalUser, async (req, res) => {
  const currentPassword = req.body.currentPassword?.trim()
  const newPassword = req.body.newPassword?.trim()

  validatePassword(currentPassword)
  validatePassword(newPassword)

  const auth: interfaces.request.Auth = req.body.auth
  await crudUsers.updatePassword(auth.id, currentPassword, newPassword)
  return res.status(204).send()
})
