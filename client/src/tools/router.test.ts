import * as routerTool from './router'

describe('#tickerListRoute', () => {
  test('could get correct url for ticker list route', () => {
    expect(routerTool.tickerListRoute()).toBe('/tickers')
  })
})

describe('#behaviorListRoute', () => {
  test('could get correct url for behavior list route', () => {
    expect(routerTool.behaviorListRoute()).toBe('/behaviors')
  })
})

describe('#behaviorDetailRoute', () => {
  test('could get correct url for behavior detail route', () => {
    expect(routerTool.behaviorDetailRoute(1, 'priceDailyIncreaseBuy')).toBe('/behaviors/priceDailyIncreaseBuy/envs/1')
    expect(routerTool.behaviorDetailRoute(2, 'priceDailyIncreaseSell')).toBe('/behaviors/priceDailyIncreaseSell/envs/2')
  })
})

describe('#profileDetailRoute', () => {
  test('could get correct url for profile detail route', () => {
    expect(routerTool.profileDetailRoute(1, 'aaa')).toBe('/traders/profiles/1/aaa')
    expect(routerTool.profileDetailRoute(2, 'bbb')).toBe('/traders/profiles/2/bbb')
  })
})

describe('#profileBuildRoute', () => {
  test('could get correct url for profile build route', () => {
    expect(routerTool.profileBuildRoute()).toBe('/traders/profiles/build')
  })
})

describe('#comboBuildRoute', () => {
  test('could get correct url for combo build route', () => {
    expect(routerTool.comboBuildRoute()).toBe('/traders/combos/build')
  })
})

describe('#comboDetailRoute', () => {
  test('could get correct url for combo detail route', () => {
    expect(routerTool.comboDetailRoute(1)).toBe('/traders/combos/1')
    expect(routerTool.comboDetailRoute(2)).toBe('/traders/combos/2')
  })
})

describe('#envDetailRoute', () => {
  test('could get correct url for env detail route', () => {
    expect(routerTool.envDetailRoute(1)).toBe('/traders/envs/1')
    expect(routerTool.envDetailRoute(2)).toBe('/traders/envs/2')
  })
})

describe('#envBuildRoute', () => {
  test('could get correct url for env build route', () => {
    expect(routerTool.envBuildRoute()).toBe('/traders/envs/build')
  })
})

describe('#dashboardRoute', () => {
  test('could get correct url for dashboard route', () => {
    expect(routerTool.dashboardRoute()).toBe('/dashboard')
  })
})

describe('#signInRoute', () => {
  test('could get correct url for sign in route', () => {
    expect(routerTool.signInRoute()).toBe('/sign-in')
  })
})

describe('#settingRoute', () => {
  test('could get correct url for setting route', () => {
    expect(routerTool.settingRoute()).toBe('/setting')
  })
})

describe('#notFoundRoute', () => {
  test('could get correct url for not found route', () => {
    expect(routerTool.notFoundRoute()).toBe('/404')
  })
})

describe('#signUpRoute', () => {
  test('could get correct url for sign up route', () => {
    expect(routerTool.signUpRoute()).toBe('/sign-up')
  })
})

describe('#forgotRoute', () => {
  test('could get correct url for forgot password route', () => {
    expect(routerTool.forgotRoute()).toBe('/forgot-password')
  })
})

describe('#resetRoute', () => {
  test('could get correct url for reset password route', () => {
    expect(routerTool.resetRoute()).toBe('/reset-password')
  })
})

describe('#pricingRoute', () => {
  test('could get correct url for pricing route', () => {
    expect(routerTool.pricingRoute()).toBe('/pricing')
  })
})

describe('#privacyRoute', () => {
  test('could get correct url for privacy route', () => {
    expect(routerTool.privacyRoute()).toBe('/privacy')
  })
})

describe('#termsRoute', () => {
  test('could get correct url for terms route', () => {
    expect(routerTool.termsRoute()).toBe('/terms')
  })
})
