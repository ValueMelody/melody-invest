<<<<<<< HEAD
import * as interfaces from '@shared/interfaces'
=======
>>>>>>> af3dd16e0a3e164ba2dfb13893d96f416ca12930
import * as constants from '@shared/constants'
import * as crudUsers from './crudUsers'
import * as databaseAdapter from 'adapters/database'
import * as emailModel from 'models/email'
import * as userModel from 'models/user'
import * as adapterEnum from 'enums/adapter'
<<<<<<< HEAD
=======
import * as errorEnum from 'enums/error'
>>>>>>> af3dd16e0a3e164ba2dfb13893d96f416ca12930
import * as emailLogic from 'logics/email'
import * as localeTool from 'tools/locale'
import * as generateTool from 'tools/generate'

beforeEach(async () => {
  databaseAdapter.initConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'email.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'email.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'user.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'user.js',
  })
})

afterEach(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#createUser', () => {
  test('could create user', async () => {
    const emailAddr = 'c@email.com'
    const password = 'abcde123'
    const returned = await crudUsers.createUser(emailAddr, password)

    const user = await userModel.getByUK(emailAddr)
    expect(returned).toStrictEqual(user)

    expect(user?.email).toBe(emailAddr)
    expect(user?.password).toBe(generateTool.buildEncryptedPassword(password))
    expect(user?.type).toBe(constants.User.Type.Basic)
    expect(user?.activationCode).toBeTruthy()
    expect(user?.activationSentAt).toBeTruthy()

    const emails = await emailModel.getAll()
    const email = emails[0]

    expect(email.sendTo).toBe(user!.email)
    expect(email.sendBy).toBe(adapterEnum.MailerConfig.Email)
    expect(email.content).toBe(emailLogic.buildActivateUserEmail(user!))
    expect(email.status).toBe(constants.Email.Status.Pending)
    expect(email.title).toBe(localeTool.getTranslation('email.activateUser'))
  })

  test('could resend activation', async () => {
    const emailAddr = 'a@email.com'
    const password = 'abcde123'
    const returned = await crudUsers.createUser(emailAddr, password)

    const user = await userModel.getByUK(emailAddr)
    expect(returned).toStrictEqual(user)

    expect(user?.email).toBe(emailAddr)
    expect(user?.password).toBe(generateTool.buildEncryptedPassword(password))
    expect(user?.type).toBe(constants.User.Type.Basic)
    expect(user?.activationCode).toBeTruthy()
    expect(user?.activationCode).not.toBe('xyz')
    expect(user?.activationSentAt).toBeTruthy()
    expect(user?.activationSentAt).not.toBe('2022-01-03')

    const emails = await emailModel.getAll()
    const email = emails[0]

    expect(email.sendTo).toBe(user!.email)
    expect(email.sendBy).toBe(adapterEnum.MailerConfig.Email)
    expect(email.content).toBe(emailLogic.buildActivateUserEmail(user!))
    expect(email.status).toBe(constants.Email.Status.Pending)
    expect(email.title).toBe(localeTool.getTranslation('email.activateUser'))
  })

  test('do nothing if already activated', async () => {
    const emailAddr = 'b@email.com'
    const password = 'abcde123'
    const returned = await crudUsers.createUser(emailAddr, password)

    const user = await userModel.getByUK(emailAddr)
    expect(returned).toStrictEqual(user)

    expect(user?.email).toBe(emailAddr)
    expect(user?.password).toBe('aabbcc')
    expect(user?.type).toBe(constants.User.Type.Basic)
    expect(user?.activationCode).toBeFalsy()
    expect(user?.activationSentAt).toBeFalsy()

    const emails = await emailModel.getAll()
    expect(emails.length).toBe(3)
  })
})

describe('#createUserToken', () => {
  jest.spyOn(generateTool, 'buildEncryptedPassword')
    .mockImplementation((password) => password)

  test('could create user token expires in 12h', async () => {
    const result = await crudUsers.createUserToken('b@email.com', 'aabbcc', false)
    expect(result.jwtToken).toBeTruthy()
    expect(result.expiresIn).toBe('12h')
  })

  test('could create user token expires in 30d', async () => {
    const result = await crudUsers.createUserToken('b@email.com', 'aabbcc', true)
    expect(result.jwtToken).toBeTruthy()
    expect(result.expiresIn).toBe('30d')
  })

  test('do not generate token if user not exists', async () => {
    await expect(async () => await crudUsers.createUserToken('c@email.com', 'aabbcc', false))
      .rejects
      .toBe(errorEnum.Custom.UserNotFound)
  })

  test('do not generate token if pass wrong password', async () => {
    await expect(async () => await crudUsers.createUserToken('b@email.com', 'aabbcc1', false))
      .rejects
      .toBe(errorEnum.Custom.UserNotFound)
  })

  test('do not generate token if user has been deleted', async () => {
    await expect(async () => await crudUsers.createUserToken('deleted@email.com', 'aabbcc123', false))
      .rejects
      .toBe(errorEnum.Custom.UserNotFound)
  })

  test('do not generate token if user has not been activated yet', async () => {
    await expect(async () => await crudUsers.createUserToken('a@email.com', 'abc', false))
      .rejects
      .toBe(errorEnum.Custom.UserNotActivated)
  })
})

describe('#generateResetCode', () => {
  test('could generate reset token', async () => {
    const emailAddr = 'a@email.com'
    await crudUsers.generateResetCode(emailAddr)
    const user = await userModel.getByUK(emailAddr)
    expect(user?.resetCode).toBeTruthy()
    expect(user?.resetSentAt).toBeTruthy()

    const emails = await emailModel.getAll()
    const email = emails[0]
    expect(email.sendTo).toBe(emailAddr)
    expect(email.sendBy).toBe(adapterEnum.MailerConfig.Email)
    expect(email.title).toBe(localeTool.getTranslation('email.resetPassword'))
    expect(email.content).toBe(emailLogic.buildResetPasswordEmail(user!))
    expect(email.status).toBe(constants.Email.Status.Pending)
  })

  test('do nothing if user not exists', async () => {
    const update = jest.fn()
    const spy = jest.spyOn(userModel, 'update')
      .mockImplementation(async () => update())
    await crudUsers.generateResetCode('null@email.com')
    expect(update).toBeCalledTimes(0)
    spy.mockRestore()
  })
})

describe('#updatePassword', () => {
  jest.spyOn(generateTool, 'buildEncryptedPassword')
    .mockImplementation((password) => password)

  test('could update password', async () => {
    await crudUsers.updatePassword(1, 'abc', 'abc123')
    const user = await userModel.getByPK(1)
    expect(user?.password).toBe('abc123')
  })

  test('throw error if can not find by user id or password', async () => {
    await expect(async () => await crudUsers.updatePassword(10, 'abc', 'abc123'))
      .rejects
      .toBe(errorEnum.Custom.UserNotFound)

    await expect(async () => await crudUsers.updatePassword(1, '123', 'abc123'))
      .rejects
      .toBe(errorEnum.Custom.UserNotFound)
  })
})

describe('#resetPassword', () => {
  jest.spyOn(generateTool, 'buildEncryptedPassword')
    .mockImplementation((password) => password)

  test('could reset password and activation status, reset status, deletedAt', async () => {
    const transaction = await databaseAdapter.createTransaction()
    await userModel.update(1, {
      resetCode: 'xxx',
      resetSentAt: new Date(),
      activationCode: 'yyy',
      activationSentAt: new Date(),
      deletedAt: new Date(),
    }, transaction)
    await transaction.commit()
    await crudUsers.resetPassword('a@email.com', '123456', 'xxx')
    const user = await userModel.getByPK(1)
    expect(user?.activationCode).toBeNull()
    expect(user?.activationSentAt).toBeNull()
    expect(user?.resetCode).toBeNull()
    expect(user?.resetSentAt).toBeNull()
    expect(user?.deletedAt).toBeNull()
    expect(user?.password).toBe('123456')
  })

  test('do nothing if user or reset code not match', async () => {
    const transaction = await databaseAdapter.createTransaction()
    await userModel.update(1, {
      resetCode: 'xxx',
      resetSentAt: new Date(),
    }, transaction)
    await transaction.commit()

    const update = jest.fn()
    const spy = jest.spyOn(userModel, 'update')
      .mockImplementation(async () => update())

    await crudUsers.resetPassword('null@email.com', '123456', 'xxx')
    expect(update).toBeCalledTimes(0)

    await crudUsers.resetPassword('a@email.com', '123456', 'yyy')
    expect(update).toBeCalledTimes(0)

    spy.mockRestore()
  })

  test('do nothing if password is the same for active user', async () => {
    const transaction = await databaseAdapter.createTransaction()
    await userModel.update(1, {
      password: '123456',
      resetCode: 'xxx',
      resetSentAt: new Date(),
      activationCode: null,
      activationSentAt: null,
      deletedAt: null,
    }, transaction)
    await transaction.commit()

    const update = jest.fn()
    const spy = jest.spyOn(userModel, 'update')
      .mockImplementation(async () => update())

    await crudUsers.resetPassword('a@email.com', '123456', 'xxx')
    expect(update).toBeCalledTimes(0)

    spy.mockRestore()
  })
})

describe('#lockAccess', () => {
  test('could lock user access', async () => {
    await crudUsers.lockAccess(1)

    const user = await userModel.getByPK(1)
    expect(user?.deletedAt).toBeTruthy()
  })
})

describe('#activateUser', () => {
  test('could activate user', async () => {
    await crudUsers.activateUser('xyz')
    const user = await userModel.getByPK(1)
    expect(user?.activationCode).toBeNull()
    expect(user?.activationSentAt).toBeNull()
  })

  test('do nothing if can not find user', async () => {
    const update = jest.fn()
    const spy = jest.spyOn(userModel, 'update')
      .mockImplementation(async () => update())

    await crudUsers.activateUser('123xyz')
    expect(update).toBeCalledTimes(0)
    spy.mockRestore()
  })
})
