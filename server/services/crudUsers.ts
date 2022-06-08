import { Knex } from 'knex'
import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as databaseAdapter from '../adapters/database'
import * as userModel from '../models/user'
import * as emailModel from '../models/email'
import * as traderModel from '../models/trader'
import * as traderEnvModel from '../models/traderEnv'
import * as traderEnvFollowerModel from '../models/traderEnvFollower'
import * as traderPatternModel from '../models/traderPattern'
import * as traderFollowerModel from '../models/traderFollower'
import * as traderComboModel from '../models/traderCombo'
import * as traderComboFollowerModel from '../models/traderComboFollower'
import * as generateTool from '../tools/generate'
import * as localeTool from '../tools/locale'
import * as errorEnum from '../enums/error'
import * as adapterEnum from '../enums/adapter'
import * as traderLogic from '../logics/trader'
import * as emailLogic from '../logics/email'

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

export const generateActivationEmail = async (
  user: interfaces.userModel.Record,
  transaction: Knex.Transaction,
) => {
  const content = emailLogic.buildActivateUserEmail(user)
  await emailModel.create({
    sendTo: user.email,
    sendBy: adapterEnum.MailerConfig.Email,
    title: localeTool.getTranslation('email.activateUser'),
    content,
    status: constants.Email.Status.Pending,
  }, transaction)
}

export const createUser = async (
  email: string, password: string,
) => {
  let user = await userModel.getByUK(email)

  const transaction = await databaseAdapter.createTransaction()
  try {
    if (user && user.activationCode) {
      user = await userModel.update(user.id, {
        activationCode: generateTool.buildAccessCode(),
        activationSentAt: new Date(),
      }, transaction)
      await generateActivationEmail(user, transaction)
    }

    if (!user) {
      user = await userModel.create({
        email,
        password: generateTool.buildEncryptedPassword(password),
        activationCode: generateTool.buildAccessCode(),
        activationSentAt: new Date(),
        type: constants.User.Type.Basic,
      }, transaction)
      await generateActivationEmail(user, transaction)
    }

    await transaction.commit()

    return user
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const createUserToken = async (
  email: string,
  password: string,
  remember: boolean,
): Promise<interfaces.response.UserToken> => {
  const encryptedPassword = generateTool.buildEncryptedPassword(password)
  const user = await userModel.getByUK(email)
  if (!user || user.password !== encryptedPassword) throw errorEnum.Custom.UserNotFound
  if (user.activationCode) throw errorEnum.Custom.UserNotActivated

  const expiresIn = remember ? '30d' : '12h'
  const jwtToken = generateTool.encodeJWT({ id: user.id, email }, expiresIn)
  return { jwtToken, expiresIn, userType: user.type }
}

export const generateResetCode = async (
  email: string,
) => {
  const user = await userModel.getByUK(email)
  if (!user) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    const updatedUser = await userModel.update(user.id, {
      resetCode: generateTool.buildAccessCode(),
      resetSentAt: new Date(),
    }, transaction)

    const content = emailLogic.buildResetPasswordEmail(updatedUser)
    await emailModel.create({
      sendTo: updatedUser.email,
      sendBy: adapterEnum.MailerConfig.Email,
      title: localeTool.getTranslation('email.resetPassword'),
      content,
      status: constants.Email.Status.Pending,
    }, transaction)

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const updatePassword = async (
  userId: number,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await userModel.getByPK(userId)
  if (!user) throw errorEnum.Custom.UserNotFound
  const encryptedCurrentPassword = generateTool.buildEncryptedPassword(currentPassword)
  if (user.password !== encryptedCurrentPassword) throw errorEnum.Custom.UserNotFound
  const encryptedNewPassword = generateTool.buildEncryptedPassword(newPassword)

  const transaction = await databaseAdapter.createTransaction()
  try {
    await userModel.update(userId, { password: encryptedNewPassword }, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const resetPassword = async (
  email: string,
  password: string,
  resetCode: string,
) => {
  const user = await userModel.getByUK(email)
  if (!user || user.resetCode !== resetCode) return

  const encryptedNewPassword = generateTool.buildEncryptedPassword(password)
  if (user.password === encryptedNewPassword && user.activationCode === null) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    await userModel.update(user.id, {
      password: encryptedNewPassword,
      resetCode: null,
      resetSentAt: null,
      activationCode: null,
    }, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export const activateUser = async (
  code: string,
) => {
  const user = await userModel.getByActivationCode(code)
  if (!user) return

  const transaction = await databaseAdapter.createTransaction()
  try {
    await userModel.update(user.id, {
      activationCode: null,
    }, transaction)
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
