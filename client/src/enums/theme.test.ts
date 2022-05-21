import * as theme from './theme'

describe('#Basic', () => {
  test('Have defined basic theme', () => {
    expect(theme.Basic.PrimaryColor).toBeDefined()
    expect(theme.Basic.SecondaryColor).toBeDefined()
    expect(theme.Basic.IncreaseColor).toBeDefined()
    expect(theme.Basic.DecreaseColor).toBeDefined()
  })
})

describe('#theme', () => {
  test('Contain export for theme', () => {
    expect(theme.theme).toStrictEqual(theme.Basic)
  })
})
