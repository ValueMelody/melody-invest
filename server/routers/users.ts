import { Router } from 'express'
import * as errorConstant from '../enums/error'
import * as crudUsers from '../services/crudUsers'
import * as verifyTool from '../tools/verify'

const usersRouter = Router()
export default usersRouter

const validEmailAndPassword = (email: string, password: string) => {
  if (!email || !password) throw errorConstant.CUSTOM.PARAMS_MISSING
  if (email.length > 100) throw errorConstant.CUSTOM.EMAIL_TOO_LONG
  if (password.length < 10) throw errorConstant.CUSTOM.PASSWORD_TOO_SHORT
  const isEmail = verifyTool.isEmail(email)
  if (!isEmail) throw errorConstant.CUSTOM.EMAIL_WRONG_FORMAT
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

  if (!isConfirmed) throw errorConstant.CUSTOM.PARAMS_MISSING
  validEmailAndPassword(email, password)

  const user = await crudUsers.createUser(email, password)
  return res.status(201).send(user)
})
