import * as common from './common'

test('Have defined config enums', () => {
  expect(common.Config.DefaultEnvId).toBeDefined()
  expect(common.Config.OverallEnvId).toBeDefined()
})
