import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as crudUsers from './crudUsers'
import * as databaseAdapter from 'adapters/database'
import * as emailModel from 'models/email'
import * as userModel from 'models/user'
import * as adapterEnum from 'enums/adapter'
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
