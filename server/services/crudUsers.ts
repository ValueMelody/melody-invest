import jwt from 'jsonwebtoken'
import * as interfaces from '@shared/interfaces'
import * as databaseAdapter from '../adapters/database'
import * as userModel from '../models/user'
import * as generateTool from '../tools/generate'
import * as errorEnum from '../enums/error'

export const createUser = async (
  email: string, password: string,
) => {
  let user = await userModel.getByUK(email)

  const transaction = await databaseAdapter.createTransaction()
  try {
    if (user && user.activationCode) {
      user = await userModel.update(user.id, {
        activationCode: generateTool.buildActivationCode(),
        activationSentAt: new Date(),
      }, transaction)
    }

    if (!user) {
      user = await userModel.create({
        email,
        password: generateTool.buildEncryptedPassword(password),
        activationCode: generateTool.buildActivationCode(),
        activationSentAt: new Date(),
      }, transaction)
    }

    await transaction.commit()

    return user
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const createUserToken = async (
  email: string, password: string, remember: boolean,
): Promise<interfaces.userRes.UserToken> => {
  const encryptedPassword = generateTool.buildEncryptedPassword(password)
  const user = await userModel.getByUK(email)
  if (!user || user.password !== encryptedPassword) throw errorEnum.CUSTOM.USER_NOT_FOUND
  if (user.activationCode) throw errorEnum.CUSTOM.USER_NOT_ACTIVATED

  const expiresIn = remember ? '30d' : '12h'
  const token = jwt.sign({ email, password }, process.env.TOKEN_SECRET!, { expiresIn })
  return { token, expiresIn }
}
