import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as databaseAdapter from '../adapters/database'
import * as userModel from '../models/user'
import * as traderModel from '../models/trader'
import * as traderEnvModel from '../models/traderEnv'
import * as traderEnvFollowerModel from '../models/traderEnvFollower'
import * as traderPatternModel from '../models/traderPattern'
import * as traderFollowerModel from '../models/traderFollower'
import * as traderComboModel from '../models/traderCombo'
import * as traderComboFollowerModel from '../models/traderComboFollower'
import * as generateTool from '../tools/generate'
import * as errorEnum from '../enums/error'
import * as emailEnum from '../enums/email'
import * as traderLogic from '../logics/trader'

export const getUserOverall = async (
  userId: number,
): Promise<interfaces.response.UserOverall> => {
  const user = await userModel.getByPK(userId)

  if (!user) throw errorEnum.Custom.UserNotFound

  const userTraders = await traderFollowerModel.getUserFollowed(userId)
  const traderIds = userTraders.map((userTrader) => userTrader.traderId)
  const traders = await traderModel.getInPKs(traderIds)
  const relatedPatternIds = traders.map((trader) => trader.traderPatternId)
  const patterns = await traderPatternModel.getInPKs(relatedPatternIds)
  const relatedPatterns = patterns.map(({ hashCode, ...publicPattern }) => publicPattern)

  const envFollowers = await traderEnvFollowerModel.getUserFollowed(userId)
  const envIds = envFollowers.map((envFollower) => envFollower.traderEnvId)
  const envs = await traderEnvModel.getInPKs(envIds)
  const traderEnvs = envs.map((env) => {
    const matchedEnvFollower = envFollowers.find((envFollower) => envFollower.traderEnvId === env.id)
    return {
      ...env,
      name: matchedEnvFollower?.name || '',
    }
  })

  const comboFollowers = await traderComboFollowerModel.getUserFollowed(userId)
  const comboIds = comboFollowers.map((comboFollower) => comboFollower.traderComboId)
  const combos = await traderComboModel.getInPKs(comboIds)
  const traderCombos = combos.map((combo) => {
    const matchedComboFollower = comboFollowers.find((comboFollower) => comboFollower.traderComboId === combo.id)
    return {
      ...combo,
      isSystem: false,
      name: matchedComboFollower?.name || '',
    }
  })

  return {
    traderProfiles: traders.map((trader) => traderLogic.presentTraderProfile(trader, relatedPatterns)),
    traderEnvs,
    traderCombos,
    email: user.email,
  }
}

const generateEmail = async (
  user: interfaces.userModel.Record,
) => {
  const content = generateTool.generateEmail(
    emailEnum.Type.UserActivation,
  )
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
        type: constants.User.Type.Normal,
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
): Promise<interfaces.response.UserToken> => {
  const encryptedPassword = generateTool.buildEncryptedPassword(password)
  const user = await userModel.getByUK(email)
  if (!user || user.password !== encryptedPassword) throw errorEnum.Custom.UserNotFound
  if (user.activationCode) throw errorEnum.Custom.UserNotActivated

  const expiresIn = remember ? '30d' : '12h'
  const jwtToken = generateTool.encodeJWT({ id: user.id, email }, expiresIn)
  return { jwtToken, expiresIn, userType: user.type }
}

export const updatePassword = async (
  userId: number, currentPassword: string, newPassword: string,
) => {
  const user = await userModel.getByPK(userId)
  if (!user) throw errorEnum.Custom.UserNotFound
  const encryptedCurrentPassword = generateTool.buildEncryptedPassword(currentPassword)
  if (user.password !== encryptedCurrentPassword) throw errorEnum.Custom.UserNotFound
  const encryptedNewPassword = generateTool.buildEncryptedPassword(newPassword)

  const transaction = await databaseAdapter.createTransaction()
  try {
    await userModel.update(userId, { password: encryptedNewPassword }, transaction)
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
