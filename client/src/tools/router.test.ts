import * as routerTool from './router'

test('could get correct url for ticker list route', () => {
  expect(routerTool.tickerListRoute()).toBe('/tickers')
})

test('could get correct url for ticker detail route', () => {
  expect(routerTool.tickerDetailRoute(1, 2)).toBe('/tickers/2/envs/1')
  expect(routerTool.tickerDetailRoute(2, 3)).toBe('/tickers/3/envs/2')
})

test('could get correct url for behavior list route', () => {
  expect(routerTool.behaviorListRoute()).toBe('/behaviors')
})

test('could get correct url for behavior detail route', () => {
  expect(routerTool.behaviorDetailRoute(1, 'priceDailyIncreaseBuy')).toBe('/behaviors/priceDailyIncreaseBuy/envs/1')
  expect(routerTool.behaviorDetailRoute(2, 'priceDailyIncreaseSell')).toBe('/behaviors/priceDailyIncreaseSell/envs/2')
})

test('could get correct url for profile detail route', () => {
  expect(routerTool.profileDetailRoute(1, 'aaa')).toBe('/traders/profiles/1/aaa')
  expect(routerTool.profileDetailRoute(2, 'bbb')).toBe('/traders/profiles/2/bbb')
})

test('could get correct url for profile build route', () => {
  expect(routerTool.profileBuildRoute()).toBe('/traders/profiles/build')
})

test('could get correct url for top combos route', () => {
  expect(routerTool.topCombosRoute()).toBe('/traders/combos/tops')
})

test('could get correct url for env detail route', () => {
  expect(routerTool.envDetailRoute(1)).toBe('/traders/envs/1')
  expect(routerTool.envDetailRoute(2)).toBe('/traders/envs/2')
})

test('could get correct url for env build route', () => {
  expect(routerTool.envBuildRoute()).toBe('/traders/envs/build')
})

test('could get correct url for dashboard route', () => {
  expect(routerTool.dashboardRoute()).toBe('/dashboard')
})

test('could get correct url for top profiles route', () => {
  expect(routerTool.topProfilesRoute()).toBe('/traders/profiles/tops')
})

test('could get correct url for sign in route', () => {
  expect(routerTool.signInRoute()).toBe('/sign-in')
})

test('could get correct url for setting route', () => {
  expect(routerTool.settingRoute()).toBe('/setting')
})

test('could get correct url for not found route', () => {
  expect(routerTool.notFoundRoute()).toBe('/404')
})
