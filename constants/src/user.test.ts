import * as user from './user'

describe('Type', () => {
  test('has defined user types', () => {
    expect(user.Type.Guest).toBeDefined()
    expect(user.Type.Normal).toBeDefined()
  })
})
