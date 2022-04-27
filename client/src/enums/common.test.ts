import * as common from './common'

describe('#Config', () => {
  test('Have defined config enums', () => {
    expect(common.Config.DefaultEnvId).toBeDefined()
    expect(common.Config.OverallEnvId).toBeDefined()
  })
})
