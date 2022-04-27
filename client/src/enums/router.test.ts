import * as router from './router'

describe('#Nav', () => {
  test('Have defined nav enums', () => {
    expect(router.Nav.SignUp).toBeDefined()
    expect(router.Nav.SignIn).toBeDefined()
    expect(router.Nav.Setting).toBeDefined()
    expect(router.Nav.Traders).toBeDefined()
    expect(router.Nav.Behaviors).toBeDefined()
    expect(router.Nav.Tickers).toBeDefined()
    expect(router.Nav.Dashboard).toBeDefined()
    expect(router.Nav.NotFound).toBeDefined()
  })
})

describe('#Endpoint', () => {
  test('Have defined endpoint enums', () => {
    expect(router.Endpoint.Systems).toBeDefined()
    expect(router.Endpoint.Users).toBeDefined()
    expect(router.Endpoint.Traders).toBeDefined()
  })
})
