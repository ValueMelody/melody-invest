import * as user from './user'

describe('#Type', () => {
  test('has defined user types', () => {
    expect(user.Type.Guest).toBeDefined()
    expect(user.Type.Basic).toBeDefined()
    expect(user.Type.Pro).toBeDefined()
    expect(user.Type.Premium).toBeDefined()
  })
})

describe('#BillingTax', () => {
  expect(user.BillingTax.State.CA.Province).toBeInstanceOf(Object)
  expect(user.BillingTax.State.Other).toBeInstanceOf(Object)
})

describe('#PlanLimit', () => {
  expect(user.PlanLimit.Guest).toBeDefined()
  expect(user.PlanLimit.Basic).toBeDefined()
  expect(user.PlanLimit.Pro).toBeDefined()
  expect(user.PlanLimit.Premium).toBeDefined()
})
