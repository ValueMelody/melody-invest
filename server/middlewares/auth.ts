import * as interfaces from '@shared/interfaces'
import { Request, Response, NextFunction } from 'express'
import * as errorEnum from '../enums/error'
import * as generateTool from '../tools/generate'

const getAuth = (req: Request): interfaces.reqs.Auth | null => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return null
  const auth = generateTool.decodeJWT(token)
  return auth
}

export const guestOrUser = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req)
  req.body.auth = auth
  next()
}

export const normalUser = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req)
  if (!auth) throw errorEnum.Default.Forbidden
  req.body.auth = auth
  next()
}
