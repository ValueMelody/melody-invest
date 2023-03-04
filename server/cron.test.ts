import * as cacheTask from 'tasks/cache'
import * as cron from './cron'
import * as emailTask from 'tasks/email'

jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}))

jest.mock('tasks/calc', () => ({
  ...jest.requireActual('tasks/calc'),
  __esModule: true,
}))

jest.mock('tasks/cache', () => ({
  ...jest.requireActual('tasks/cache'),
  __esModule: true,
}))

jest.mock('tasks/email', () => ({
  ...jest.requireActual('tasks/email'),
  __esModule: true,
}))

describe('#generateCaches', () => {
  test('call expected functions', async () => {
    const generateSystemCaches = jest.fn()
    jest.spyOn(cacheTask, 'generateSystemCaches').mockImplementation(generateSystemCaches)
    await cron.generateCaches()
    expect(generateSystemCaches).toBeCalledTimes(1)
  })
})

describe('#sendEmails', () => {
  test('call expected functions', async () => {
    const sendPendingEmails = jest.fn()
    jest.spyOn(emailTask, 'sendPendingEmails').mockImplementation(sendPendingEmails)
    await cron.sendEmails()
    expect(sendPendingEmails).toBeCalledTimes(1)
  })
})
