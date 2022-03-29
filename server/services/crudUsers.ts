import * as interfaces from '@shared/interfaces'
import * as databaseAdapter from '../adapters/database'
import * as userModel from '../models/user'
import * as traderModel from '../models/trader'
import * as traderPatternModel from '../models/traderPattern'
import * as traderFollowerModel from '../models/traderFollower'
import * as generateTool from '../tools/generate'
import * as presentTool from '../tools/present'
import * as errorEnum from '../enums/error'
import * as userEnum from '../enums/user'

export const getUserOverall = async (userId: number): Promise<interfaces.userRes.UserOverall> => {
  const user = await userModel.getByPK(userId)

  if (!user) throw errorEnum.CUSTOM.USER_NOT_FOUND

  const userTraders = await traderFollowerModel.getUserFollowed(userId)
  const traderIds = userTraders.map((userTrader) => userTrader.traderId)
  const traders = await traderModel.getInPKs(traderIds)
  const relatedPatternIds = traders.map((trader) => trader.traderPatternId)
  const patterns = await traderPatternModel.getInPKs(relatedPatternIds)
  const relatedPatterns = patterns.map(({ hashCode, ...publicPattern }) => publicPattern)

  return {
    traderProfiles: traders.map((trader) => presentTool.combineTraderAndPattern(trader, relatedPatterns)),
    email: user.email,
  }
}

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
        type: userEnum.TYPE.NORMAL,
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
  const jwtToken = generateTool.encodeJWT({ id: user.id, email }, expiresIn)
  return { jwtToken, expiresIn, userType: user.type }
}

export const updatePassword = async (
  userId: number, currentPassword: string, newPassword: string,
) => {
  const user = await userModel.getByPK(userId)
  if (!user) throw errorEnum.CUSTOM.USER_NOT_FOUND
  const encryptedCurrentPassword = generateTool.buildEncryptedPassword(currentPassword)
  if (user.password !== encryptedCurrentPassword) throw errorEnum.CUSTOM.USER_NOT_FOUND
  const encryptedNewPassword = generateTool.buildEncryptedPassword(newPassword)

  const transaction = await databaseAdapter.createTransaction()
  try {
    await userModel.update(userId, { password: encryptedNewPassword }, transaction)
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
