import * as errorEnum from 'enums/error'
import * as generateTool from 'tools/generate'
import * as interfaces from '@shared/interfaces'
import { NextFunction, Request, Response } from 'express'

const getAuth = (
  req: Request,
  isRefreshToken: boolean = false,
): interfaces.request.Auth | null => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return null
  try {
    const auth = generateTool.decodeJWT(token, isRefreshToken)
    return auth
  } catch (e) {
    throw errorEnum.Default.Unauthorized
  }
}

export const authByRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  const isRefreshToken = true
  const auth = getAuth(req, isRefreshToken)
  req.body.auth = auth
  next()
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
