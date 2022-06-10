import * as common from './common'

describe('#Config', () => {
  test('Have defined config enums', () => {
    expect(common.Config.DefaultEnvId).toBeDefined()
    expect(common.Config.OverallEnvId).toBeDefined()
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
