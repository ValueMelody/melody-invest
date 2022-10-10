import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import * as crudUsers from './crudUsers'
import * as databaseAdapter from 'adapters/database'
import * as emailModel from 'models/email'
import * as adapterEnum from 'enums/adapter'
import * as emailLogic from 'logics/email'
import * as localeTool from 'tools/locale'

beforeAll(async () => {
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
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#generateActivationEmail', () => {
  test('could generate activation email', async () => {
    // @ts-ignore
    const user: interfaces.userModel.Record = { email: 'test@email.com', activationCode: '123' }
    const transaction = await databaseAdapter.createTransaction()
    await crudUsers.generateActivationEmail(user, transaction)
    await transaction.commit()

    const emails = await emailModel.getAll()
    const email = emails[emails.length - 1]

    expect(email.sendTo).toBe(user.email)
    expect(email.sendBy).toBe(adapterEnum.MailerConfig.Email)
    expect(email.content).toBe(emailLogic.buildActivateUserEmail(user))
    expect(email.status).toBe(constants.Email.Status.Pending)
    expect(email.title).toBe(localeTool.getTranslation('email.activateUser'))
  })
})
