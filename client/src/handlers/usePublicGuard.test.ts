import { createMemoryHistory } from 'history'
import { renderHook } from 'test.utils'
import usePublicGuard from './usePublicGuard'
import * as routerTool from 'tools/router'

describe('#usePublicGuard', () => {
  test('could trigger public guard when login', () => {
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

    renderHook(usePublicGuard, { history, store })
    expect(history.location.pathname).toBe(routerTool.dashboardRoute())
  })

  test('should not trigger public guard when not login', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })

    renderHook(usePublicGuard, { history })
    expect(history.location.pathname).toBe('/test')
  })
})
