import * as email from './email'

describe('#initTransporter', () => {
  test('could initial transporter', () => {
    const transporter = email.initTransporter()
    expect(transporter).toBeDefined()
    expect(transporter.sendMail).toBeDefined()
  })
})
