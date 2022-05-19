import * as email from './email'

describe('Status', () => {
  test('has defined email status', () => {
    expect(email.Status.Pending).toBeDefined()
    expect(email.Status.Sending).toBeDefined()
    expect(email.Status.Completed).toBeDefined()
    expect(email.Status.Failed).toBeDefined()
  })
})
