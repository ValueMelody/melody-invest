import * as user from './user'

describe('Type', () => {
  test('has defined user types', () => {
    expect(user.Type.Guest).toBeDefined()
    expect(user.Type.Basic).toBeDefined()
    expect(user.Type.Pro).toBeDefined()
    expect(user.Type.Premium).toBeDefined()
  })
})
