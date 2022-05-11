import * as email from './email'

describe('#Type', () => {
  test('Have defined email type', () => {
    expect(email.Type.UserActivation).toBeDefined()
  })
})
