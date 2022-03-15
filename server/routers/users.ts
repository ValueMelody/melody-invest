import { Router } from 'express'
import * as errorConstant from '../enums/error'
import * as crudUsers from '../services/crudUsers'
import * as verifyTool from '../tools/verify'

const usersRouter = Router()
export default usersRouter

usersRouter.post('/', async (req, res) => {
  const email = req.body.email?.trim().toLowerCase()
  const password = req.body.password?.trim()
  const isConfirmed = req.body.isConfirmed

  if (!email || !password || !isConfirmed) throw errorConstant.CUSTOM.PARAMS_MISSING
  if (email.length > 100) throw errorConstant.CUSTOM.EMAIL_TOO_LONG
  if (password.length < 10) throw errorConstant.CUSTOM.PASSWORD_TOO_SHORT

  const isEmail = verifyTool.isEmail(email)
  if (!isEmail) throw errorConstant.CUSTOM.EMAIL_WRONG_FORMAT

  const user = await crudUsers.createUser(email, password)
  return res.status(201).send(user)
})
