import * as cacheTask from 'tasks/cache'
import * as calcTask from 'tasks/calc'
import * as cron from './cron'
import * as emailTask from 'tasks/email'

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

describe('#calcTraders', () => {
  test('call expected functions', async () => {
    const calcTraderPerformances = jest.fn()
    const calcTraderDescendants = jest.fn()
    jest.spyOn(calcTask, 'calcTraderPerformances').mockImplementation(calcTraderPerformances)
    jest.spyOn(calcTask, 'calcTraderDescendants').mockImplementation(calcTraderDescendants)
    await cron.calcTraders()
    expect(calcTraderPerformances).toBeCalledTimes(1)
    expect(calcTraderPerformances).toBeCalledWith(false)
    expect(calcTraderDescendants).toBeCalledTimes(1)
  })
})

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
