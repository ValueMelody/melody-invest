import * as user from './user'

describe('#Type', () => {
  test('has defined user types', () => {
    expect(user.Type.Guest).toBeDefined()
    expect(user.Type.Basic).toBeDefined()
    expect(user.Type.Pro).toBeDefined()
    expect(user.Type.Premium).toBeDefined()
  })
})

describe('#SubscriptionStatus', () => {
  expect(user.SubscriptionStatus.Active).toBeDefined()
  expect(user.SubscriptionStatus.Suspended).toBeDefined()
  expect(user.SubscriptionStatus.Cancelled).toBeDefined()
})
