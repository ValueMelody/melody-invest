import * as common from './common'

describe('#Config', () => {
  test('Have defined config enums', () => {
    expect(common.Config.DefaultEnvId).toBeDefined()
    expect(common.Config.OverallEnvId).toBeDefined()
  })
})

describe('#Env', () => {
  test('Have defined env enums', () => {
    expect(common.Env.ServerHost).toBeDefined()
    expect(common.Env.ServerType).toBeDefined()
    expect(common.Env.Theme).toBeDefined()
    expect(common.Env.PayPalClientId).toBeDefined()
    expect(common.Env.PayPalProPlanId).toBeDefined()
    expect(common.Env.PayPalPremiumPlanId).toBeDefined()
    expect(common.Env.ContactEmail).toBeDefined()
  })
})

describe('#Plan', () => {
  test('Have defined plan enums', () => {
    expect(common.Plan.Basic.Title).toBeDefined()
    expect(common.Plan.Basic.Price).toBeDefined()
    expect(common.Plan.Basic.Services).toBeDefined()
    expect(common.Plan.Pro.Title).toBeDefined()
    expect(common.Plan.Pro.Price).toBeDefined()
    expect(common.Plan.Pro.Services).toBeDefined()
    expect(common.Plan.Premium.Title).toBeDefined()
    expect(common.Plan.Premium.Price).toBeDefined()
    expect(common.Plan.Premium.Services).toBeDefined()
  })
})
