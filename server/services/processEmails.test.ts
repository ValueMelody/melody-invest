import * as constants from '@shared/constants'
import * as processEmail from './processEmails'
import * as databaseAdapter from 'adapters/database'
import * as emailAdapter from 'adapters/email'
import { SendMailOptions } from 'nodemailer'
import * as runTool from 'tools/run'
import * as emailModel from 'models/email'

const emailMocks = [
  {
    id: '5ed6d4c8-c159-4588-b966-364a4bdbd3a1',
    sendTo: 'a@company.com',
    sendBy: 'test@email.com',
    title: 'activation email',
    content: 'This is an activation email',
    status: 2,
    response: { completed: true },
    createdAt: '2019-01-01',
    sentAt: '2019-01-02',
  },
  {
    id: '5ed6d4c8-c159-4588-b966-364a4bdbd3a2',
    sendTo: 'a@company.com',
    sendBy: 'test@email.com',
    title: 'activation email',
    content: 'This is an activation email',
    status: 2,
    response: { completed: true },
    createdAt: '2019-01-02',
    sentAt: '2019-01-02',
  },
  {
    id: '5ed6d4c8-c159-4588-b966-364a4bdbd3a3',
    sendTo: 'a@company.com',
    sendBy: 'test@email.com',
    title: 'activation email',
    content: 'This is an activation email',
    status: 2,
    response: { completed: true },
    createdAt: '2019-01-03',
    sentAt: '2019-01-02',
  },
  {
    id: '5ed6d4c8-c159-4588-b966-364a4bdbd3a4',
    sendTo: 'a@company.com',
    sendBy: 'test@email.com',
    title: 'activation email',
    content: 'This is an activation email',
    status: 2,
    response: { completed: true },
    createdAt: '2019-01-04',
    sentAt: '2019-01-02',
  },
]

beforeEach(async () => {
  databaseAdapter.initConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'email.js',
  })
})

afterEach(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

const sendMail = jest.fn()

const initTransporterMock = () => {
  return {
    sendMail: async (options: SendMailOptions) => {
      sendMail()
      return {
        accepted: [options.to],
      }
    },
  }
}

jest.spyOn(emailAdapter, 'initTransporter')
  // @ts-ignore
  .mockImplementation(initTransporterMock)

describe('#processEmail', () => {
  test('Do not send sent emails', async () => {
    const transaction = await databaseAdapter.createTransaction()
    await runTool.asyncForEach(emailMocks, async (mock: any) => {
      await emailModel.create(mock, transaction)
    })
    await transaction.commit()

    const createdEmails = await emailModel.getAll()
    expect(createdEmails.length).toBe(4)

    await processEmail.sendPendingEmails(3)
    expect(sendMail).toBeCalledTimes(0)
  })

  test('could sent emails', async () => {
    const pendingMocks = emailMocks.map((mock) => ({
      ...mock,
      status: constants.Email.Status.Pending,
      sentAt: null,
    }))

    const transaction = await databaseAdapter.createTransaction()
    await runTool.asyncForEach(pendingMocks, async (mock: any) => {
      await emailModel.create(mock, transaction)
    })
    await transaction.commit()

    const createdEmails = await emailModel.getAll()
    expect(createdEmails.length).toBe(4)
    expect(createdEmails[0].status).toBe(constants.Email.Status.Pending)
    expect(createdEmails[1].status).toBe(constants.Email.Status.Pending)
    expect(createdEmails[2].status).toBe(constants.Email.Status.Pending)
    expect(createdEmails[3].status).toBe(constants.Email.Status.Pending)

    await processEmail.sendPendingEmails(3)
    expect(sendMail).toBeCalledTimes(3)

    const updatedEmails = await emailModel.getAll()
    expect(updatedEmails.length).toBe(4)
    expect(updatedEmails[0].status).toBe(constants.Email.Status.Completed)
    expect(updatedEmails[1].status).toBe(constants.Email.Status.Completed)
    expect(updatedEmails[2].status).toBe(constants.Email.Status.Completed)
    expect(updatedEmails[3].status).toBe(constants.Email.Status.Pending)
  })
})
