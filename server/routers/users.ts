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

  if (!email || !password || !isConfirmed) throw errorConstant.HTTP_ERRORS.FORBIDDEN
  if (email.length > 100) throw errorConstant.HTTP_ERRORS.FORBIDDEN
  if (password.length < 10) throw errorConstant.HTTP_ERRORS.FORBIDDEN

  const isEmail = verifyTool.isEmail(email)
  if (!isEmail) throw errorConstant.HTTP_ERRORS.FORBIDDEN

  const user = await crudUsers.createUser(email, password)
  return res.status(201).send(user)
})
