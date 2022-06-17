import * as interfaces from '@shared/interfaces'
import { Request, Response, NextFunction } from 'express'
import * as errorEnum from 'enums/error'
import * as generateTool from 'tools/generate'

const getAuth = (req: Request): interfaces.request.Auth | null => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return null
  try {
    const auth = generateTool.decodeJWT(token)
    return auth
  } catch (e) {
    throw errorEnum.Default.Unauthorized
  }
}

export const guestOrUser = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req)
  req.body.auth = auth
  next()
}

export const normalUser = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req)
  if (!auth) throw errorEnum.Default.Unauthorized
  req.body.auth = auth
  next()
}
