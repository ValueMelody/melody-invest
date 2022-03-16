import { Request, Response, NextFunction } from 'express'
import * as errorEnum from '../enums/error'
import * as generateTool from '../tools/generate'

export const normalUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) throw errorEnum.DEFAULT.UNAUTHORIZED
  const auth = generateTool.decodeJWT(token)
  if (!auth) throw errorEnum.DEFAULT.UNAUTHORIZED
  req.body.auth = auth
  next()
}
