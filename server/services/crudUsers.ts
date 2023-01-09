import * as adapterEnum from 'enums/adapter'
import * as constants from '@shared/constants'
import * as databaseAdapter from 'adapters/database'
import * as dateTool from 'tools/date'
import * as emailLogic from 'logics/email'
import * as emailModel from 'models/email'
import * as errorEnum from 'enums/error'
import * as generateTool from 'tools/generate'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as paymentAdapter from 'adapters/payment'
import * as traderComboFollowerModel from 'models/traderComboFollower'
import * as traderComboModel from 'models/traderCombo'
import * as traderEnvFollowerModel from 'models/traderEnvFollower'
import * as traderEnvModel from 'models/traderEnv'
import * as traderFollowerModel from 'models/traderFollower'
import * as traderLogic from 'logics/trader'
import * as traderModel from 'models/trader'
import * as traderPatternModel from 'models/traderPattern'
import * as userModel from 'models/user'
import * as userPaymentModel from 'models/userPayment'
import { Knex } from 'knex'
import moment from 'moment'

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

  const planStartAtUTC = null
  const planEndAtUTC = null
  const userType = user.type
  // if (user.type === constants.User.Type.Pro || user.type === constants.User.Type.Premium) {
  //   let subscription = await userSubscriptionModel.getUserActive(user.id)
  //   if (!subscription) subscription = await userSubscriptionModel.getUserLatest(user.id)
  //   planStartAtUTC = subscription?.startAtUTC || null
  //   planEndAtUTC = subscription?.endAtUTC || null

  //   const planIsEnd = !!planEndAtUTC && dateTool.toUTCFormat(moment()) > planEndAtUTC
  //   if (planIsEnd) {
  //     userType = constants.User.Type.Basic
  //     planStartAtUTC = null
  //     planEndAtUTC = null
  //   }
  // }

  return {
    traderProfiles: traders.map((trader) => traderLogic.presentTraderProfile(trader, relatedPatterns)),
    traderEnvs,
    traderCombos,
    email: user.email,
    type: userType,
    planStartAtUTC,
    planEndAtUTC,
  }
}

const generateActivationEmail = async (
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
  email: string,
  password: string,
) => {
  let user = await userModel.getByUK(email)

  return databaseAdapter.runWithTransaction(async (transaction) => {
    if (user && user.activationCode) {
      user = await userModel.update(user.id, {
        password: generateTool.buildEncryptedPassword(password),
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

    return user
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
    { id: user.id, email, type: user.type },
    refreshExpiresIn,
  )
}

export const refreshAccessToken = async (
  id: number,
  email: string,
  type: number,
): Promise<interfaces.response.AccessToken> => {
  const auth = { id, email, type }
  const accessExpiresIn = adapterEnum.HostConfig.AccessExpiresIn
  const accessExpiresInUTC = dateTool.toTokenExpiresInISO(accessExpiresIn)
  const accessToken = generateTool.encodeJWT(auth, accessExpiresIn)
  return {
    accessExpiresIn: accessExpiresInUTC,
    accessToken,
  }
}

export const createPayment = async (
  userId: number,
  orderId: string,
  planType: number,
  stateCode: string | null,
  provinceCode: string | null,
): Promise<interfaces.response.UserToken> => {
  const detail = await paymentAdapter.getOrderDetail(orderId)
  const paymentAmount = detail?.purchase_units[0]?.amount?.value
  const paymentCurrency = detail?.purchase_units[0]?.amount?.currency
  const planPrice = planType === constants.User.Type.Pro
    ? constants.User.PlanPrice.Pro
    : constants.User.PlanPrice.Premium
  const paidOneMonth = paymentAmount === planPrice.OneMonthPrice
  const paidThreeMonths = paymentAmount === planPrice.ThreeMonthsPrice
  const paidSixMonths = paymentAmount === planPrice.SixMonthsPrice
  const paidOneYear = paymentAmount === planPrice.OneYearPrice
  const isCorrectCurrency = paymentCurrency === 'CAD'

  const isCorrectPayment = isCorrectCurrency && (paidOneMonth || paidThreeMonths || paidSixMonths || paidOneYear)
  if (!isCorrectPayment) throw errorEnum.Custom.OrderFailed

  const updatedUser = await databaseAdapter.runWithTransaction(async (transaction) => {
    const updatedUser = await userModel.update(userId, {
      type: planType,
    }, transaction)

    await userPaymentModel.create({
      userId,
      orderId,
      price: paymentAmount,
      tax: paymentAmount,
      stateCode,
      provinceCode,
      startAtUTC: dateTool.toUTCFormat(moment()),
      endAtUTC: dateTool.toUTCFormat(moment()),
    }, transaction)

    return updatedUser
  })

  const refreshExpiresIn = '12h'
  return buildUserToken(
    { id: userId, email: updatedUser.email, type: updatedUser.type },
    refreshExpiresIn,
  )
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

    const content = emailLogic.buildResetPasswordEmail(updatedUser)
    await emailModel.create({
      sendTo: updatedUser.email,
      sendBy: adapterEnum.MailerConfig.Email,
      title: localeTool.getTranslation('email.resetPassword'),
      content,
      status: constants.Email.Status.Pending,
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
