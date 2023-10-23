import * as processEmails from 'services/processEmails'
import * as email from './email'

jest.mock('services/processEmails', () => {
  const actual = jest.requireActual('services/processEmails')
  return {
    __esModule: true,
    ...actual,
  }
})

describe('#sendPendingEmails', () => {
  const sendPendingEmails = jest.fn()
  jest.spyOn(processEmails, 'sendPendingEmails')
    .mockImplementation(sendPendingEmails)

  test('could trigger target service', async () => {
    await email.sendPendingEmails()
    expect(sendPendingEmails).toBeCalledTimes(1)
    expect(sendPendingEmails).toBeCalledWith(20)
  })
})
