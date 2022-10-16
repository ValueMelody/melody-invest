import * as email from './email'
import * as processEmails from 'services/processEmails'

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
