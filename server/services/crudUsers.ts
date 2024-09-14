import * as adapterEnum from 'enums/adapter'
import * as constants from '@shared/constants'
import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as emailAdapter from 'adapters/email'
import * as emailLogic from 'logics/email'
import * as emailModel from 'models/email'
import * as entityModel from 'models/entity'
import * as errorEnum from 'enums/error'
import * as generateTool from 'tools/generate'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as tickerModel from 'models/ticker'
import * as traderComboFollowerModel from 'models/traderComboFollower'
import * as traderComboModel from 'models/traderCombo'
import * as traderEnvFollowerModel from 'models/traderEnvFollower'
import * as traderEnvModel from 'models/traderEnv'
import * as traderFollowerModel from 'models/traderFollower'
import * as traderLogic from 'logics/trader'
import * as traderModel from 'models/trader'
import * as traderPatternModel from 'models/traderPattern'
import * as userModel from 'models/user'

export const getUserEntity = async (
  entityId: number,
): Promise<interfaces.entityModel.Record> => {
  const entity = await entityModel.getByPK(entityId)
  if (!entity) throw errorEnum.Custom.UserNotFound
  return {
    ...entity,
    dataKey: entity.dataKey ? constants.Entity.DataMarkup : null,
  }
}

export const updateUserEntity = async (
  entityId: number,
  dataSource: string,
  dataKey: string,
) => {
  await databaseAdapter.runWithTransaction(async (transaction) => {
    await entityModel.update(entityId, {
      dataSource,
      dataKey: generateTool.encodeDataKey(dataKey),
      isValidKey: null,
    }, transaction)
  })
}

export const getUserOverall = async (
  userId: number,
  entityId: number,
): Promise<interfaces.response.UserOverall> => {
  const user = await userModel.getByPK(userId)

  if (!user) throw errorEnum.Custom.UserNotFound

  const userTraders = await traderFollowerModel.getUserFollowed(userId)
  const traderIds = userTraders.map((userTrader) => userTrader.traderId)
  const traders = await traderModel.getInPKs(traderIds)
  const relatedPatternIds = traders.map((trader) => trader.traderPatternId)
  const patterns = await traderPatternModel.getInPKs(relatedPatternIds)

  const tickers = await tickerModel.getAllByEntity(entityId)

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
      name: matchedComboFollower?.name || '',
    }
  })

  return {
    traderProfiles: traders.map((trader) => traderLogic.presentTraderProfile(trader, patterns)),
    traderEnvs,
    tickers,
    traderCombos,
    email: user.email,
    type: user.type,
    planStartAtUTC: null,
    planEndAtUTC: null,
  }
}

export const createUser = async (
  email: string,
  password: string,
): Promise<interfaces.userModel.Record> => {
  const user = await userModel.getByUK(email)

  if (user && !user.activationCode) return user

  return databaseAdapter.runWithTransaction(async (transaction) => {
    const finalPass = generateTool.buildEncryptedPassword(password)
    const activationCode = generateTool.buildAccessCode()
    const activationSentAt = new Date()

    let targetUser

    if (!user) {
      const entity = await entityModel.create({
        dataKey: null, isValidKey: null,
      }, transaction)
      targetUser = await userModel.create({
        email,
        entityId: entity.id,
        password: finalPass,
        activationCode,
        activationSentAt,
        type: constants.User.Type.Basic,
      }, transaction)
    } else {
      targetUser = await userModel.update(user.id, {
        password: finalPass,
        activationCode,
        activationSentAt,
      }, transaction)
    }

    const subject = localeTool.getTranslation('email.activateUser')
    const content = emailLogic.buildActivateUserEmail(targetUser)
    try {
      const transporter = emailAdapter.initTransporter()
      const response = await transporter.sendMail({
        from: 'ValueMelody app@valuemelody.com',
        to: targetUser.email,
        subject,
        html: content,
      })

      const status = generateTool.getEmailStatus(response, targetUser.email)

      await emailModel.create({
        sendTo: targetUser.email,
        title: subject,
        content,
        status,
      }, transaction)
    } catch (e) { console.error(e) }

    return targetUser
  })
}

const buildUserToken = (
  auth: interfaces.request.Auth,
  refreshExpiresIn: '30d' | '12h',
): interfaces.response.UserToken => {
  const accessExpiresIn = adapterEnum.HostConfig.AccessExpiresIn
  const accessExpiresInUTC = dateTool.toTokenExpiresInISO(accessExpiresIn)
  const accessToken = generateTool.encodeJWT(auth, accessExpiresIn)
  const refreshExpiresInUTC = dateTool.toTokenExpiresInISO(refreshExpiresIn)
  const isRefreshToken = true
  const refreshToken = generateTool.encodeJWT(auth, refreshExpiresIn, isRefreshToken)
  return {
    refreshToken,
    refreshExpiresIn: refreshExpiresInUTC,
    accessToken,
    accessExpiresIn: accessExpiresInUTC,
  }
}

export const createUserToken = async (
  email: string,
  password: string,
  remember: boolean,
): Promise<interfaces.response.UserToken> => {
  const encryptedPassword = generateTool.buildEncryptedPassword(password)
  const user = await userModel.getByUK(email)
  if (!user || user.password !== encryptedPassword || !!user.deletedAt) throw errorEnum.Custom.UserNotFound
  if (user.activationCode) throw errorEnum.Custom.UserNotActivated

  const refreshExpiresIn = remember ? '30d' : '12h'
  return buildUserToken(
    { id: user.id, entityId: user.entityId, email, type: user.type },
    refreshExpiresIn,
  )
}

export const refreshAccessToken = async (
  id: number,
  entityId: number,
  email: string,
  type: number,
): Promise<interfaces.response.AccessToken> => {
  const auth = { id, entityId, email, type }
  const accessExpiresIn = adapterEnum.HostConfig.AccessExpiresIn
  const accessExpiresInUTC = dateTool.toTokenExpiresInISO(accessExpiresIn)
  const accessToken = generateTool.encodeJWT(auth, accessExpiresIn)
  return {
    accessExpiresIn: accessExpiresInUTC,
    accessToken,
  }
}

export const generateResetCode = async (
  email: string,
) => {
  const user = await userModel.getByUK(email)
  if (!user) return

  await databaseAdapter.runWithTransaction(async (transaction) => {
    const updatedUser = await userModel.update(user.id, {
      resetCode: generateTool.buildAccessCode(),
      resetSentAt: new Date(),
    }, transaction)

    const subject = localeTool.getTranslation('email.resetPassword')
    const content = emailLogic.buildResetPasswordEmail(updatedUser)
    const transporter = emailAdapter.initTransporter()
    const response = await transporter.sendMail({
      from: 'ValueMelody app@valuemelody.com',
      to: updatedUser.email,
      subject,
      html: content,
    })

    const status = await generateTool.getEmailStatus(response, updatedUser.email)

    await emailModel.create({
      sendTo: updatedUser.email,
      title: subject,
      content,
      status,
    }, transaction)
  })
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

  await databaseAdapter.runWithTransaction(async (transaction) => {
    await userModel.update(
      userId,
      { password: encryptedNewPassword },
      transaction,
    )
  })
}

export const resetPassword = async (
  email: string,
  password: string,
  resetCode: string,
) => {
  const user = await userModel.getByUK(email)
  if (!user || user.resetCode !== resetCode) return

  const encryptedNewPassword = generateTool.buildEncryptedPassword(password)
  if (user.password === encryptedNewPassword && !user.deletedAt && !user.activationCode) return

  await databaseAdapter.runWithTransaction(async (transaction) => {
    await userModel.update(user.id, {
      password: encryptedNewPassword,
      resetCode: null,
      resetSentAt: null,
      activationCode: null,
      activationSentAt: null,
      deletedAt: null,
    }, transaction)
  })
}

export const lockAccess = async (
  userId: number,
) => {
  await databaseAdapter.runWithTransaction(async (transaction) => {
    await userModel.update(userId, {
      deletedAt: new Date(),
    }, transaction)
  })
}

export const activateUser = async (
  code: string,
) => {
  const user = await userModel.getByActivationCode(code)
  if (!user) return

  await databaseAdapter.runWithTransaction(async (transaction) => {
    await userModel.update(user.id, {
      activationCode: null,
      activationSentAt: null,
    }, transaction)
  })
}
