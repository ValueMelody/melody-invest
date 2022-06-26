import { createMemoryHistory } from 'history'
import { renderHook } from 'test.utils'
import usePrivateGuard from './usePrivateGuard'
import * as routerTool from 'tools/router'

describe('#usePrivateGuard', () => {
  test('could trigger private guard when not login', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })

    renderHook(usePrivateGuard, { history })
    expect(history.location.pathname).toBe(routerTool.signInRoute())
  })

  test('should not trigger private guard when login', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })

    const store = {
      resources: {
        hasLogin: true,
        userTraderIds: [1, 2, 3],
        userType: 1,
        userEmail: 'basic@test.com',
        planStartAtUTC: null,
        planEndAtUTC: null,
      },
    }

    renderHook(usePrivateGuard, { history, store })
    expect(history.location.pathname).toBe('/test')
  })
})
