import * as authMiddleware from 'middlewares/auth'
import * as constants from '@shared/constants'
import * as crudUsers from 'services/crudUsers'
import * as errorEnum from 'enums/error'
import * as interfaces from '@shared/interfaces'
import * as verifyTool from 'tools/verify'
import { Request, Response, Router } from 'express'

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

const validateAccessCode = (code: string) => {
  if (!code || code.length !== 64) throw errorEnum.Custom.WrongAccessCode
}

export const getOverall = async (req: Request, res: Response) => {
  const auth: interfaces.request.Auth = req.body.auth
  const overall = await crudUsers.getUserOverall(auth.id)
  return res.status(200).send(overall)
}

export const createToken = async (req: Request, res: Response) => {
  const email = req.body.email?.trim().toLowerCase()
  const password = req.body.password?.trim()
  const remember = req.body.remember

  validateEmail(email)
  validatePassword(password)

  const userToken = await crudUsers.createUserToken(email, password, remember)
  return res.status(201).send(userToken)
}

export const createUser = async (req: Request, res: Response) => {
  const email = req.body.email?.trim().toLowerCase()
  const password = req.body.password?.trim()
  const isConfirmed = req.body.isConfirmed

  if (!isConfirmed) throw errorEnum.Custom.MissingParams
  validateEmail(email)
  validatePassword(password)

  const user = await crudUsers.createUser(email, password)
  return res.status(201).send(user)
}

export const createPayment = async (req: Request, res: Response) => {
  const orderId = req.body.orderId?.trim()
  const planType = Number(req.body.planType)
  const stateCode = req.body.stateCode || null
  const provinceCode = req.body.provinceCode || null

  const isCorrectPlanType = planType === constants.User.Type.Pro || planType === constants.User.Type.Premium
  if (!orderId || !isCorrectPlanType) throw errorEnum.Default.Forbidden

  const auth: interfaces.request.Auth = req.body.auth
  const userToken = await crudUsers.createPayment(auth.id, orderId, planType, stateCode, provinceCode)
  return res.status(201).send(userToken)
}

export const createReset = async (req: Request, res: Response) => {
  const email = req.body.email?.trim().toLowerCase()
  validateEmail(email)

  await crudUsers.generateResetCode(email)
  return res.status(201).send()
}

export const updatePassword = async (req: Request, res: Response) => {
  const currentPassword = req.body.currentPassword?.trim()
  const newPassword = req.body.newPassword?.trim()

  validatePassword(currentPassword)
  validatePassword(newPassword)

  const auth: interfaces.request.Auth = req.body.auth
  await crudUsers.updatePassword(auth.id, currentPassword, newPassword)
  return res.status(204).send()
}

export const lockUser = async (req: Request, res: Response) => {
  const auth: interfaces.request.Auth = req.body.auth
  await crudUsers.lockAccess(auth.id)
  return res.status(204).send()
}

export const activateUser = async (req: Request, res: Response) => {
  const token = req.body.token?.trim()

  validateAccessCode(token)

  await crudUsers.activateUser(token)
  return res.status(204).send()
}

export const resetPassword = async (req: Request, res: Response) => {
  const email = req.body.email?.trim().toLowerCase()
  const password = req.body.password?.trim()
  const resetCode = req.body.resetCode.trim()
  validateEmail(email)
  validatePassword(password)
  validateAccessCode(resetCode)

  await crudUsers.resetPassword(email, password, resetCode)
  return res.status(204).send()
}

export const refreshToken = async (req: Request, res: Response) => {
  const auth: interfaces.request.Auth = req.body.auth
  const tokens = await crudUsers.refreshAccessToken(auth.id, auth.email, auth.type)
  return res.status(200).send(tokens)
}

export const attachRoutes = (router: Router) => {
  router.get('/overall', authMiddleware.normalUser, getOverall)
  router.post('/token', createToken)
  router.post('/', createUser)
  router.post('/payment', authMiddleware.normalUser, createPayment)
  router.post('/reset', createReset)
  router.put('/password', authMiddleware.normalUser, updatePassword)
  router.put('/lock', authMiddleware.normalUser, lockUser)
  router.put('/activate', activateUser)
  router.put('/reset', resetPassword)
  router.put('/token', authMiddleware.authByRefreshToken, refreshToken)
}
