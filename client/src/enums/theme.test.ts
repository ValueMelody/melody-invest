import * as theme from './theme'

test('Have defined basic theme', () => {
  expect(theme.Basic).toBeDefined()
})

test('Contain export for theme', () => {
  expect(theme.theme.PrimaryColor).toBeDefined()
  expect(theme.theme.SecondaryColor).toBeDefined()
  expect(theme.theme.IncreaseColor).toBeDefined()
  expect(theme.theme.DecreaseColor).toBeDefined()
})
