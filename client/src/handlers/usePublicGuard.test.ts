import { createMemoryHistory } from 'history'
import { renderHook } from 'test.utils'
import usePublicGuard from './usePublicGuard'
import * as routerTool from 'tools/router'
import { store } from 'stores'
import { userSlice } from 'stores/user'

afterEach(() => {
  jest.clearAllMocks()
})

describe('#usePublicGuard', () => {
  test('should not trigger public guard when not login', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })

    renderHook(usePublicGuard, { history })
    expect(history.location.pathname).toBe('/test')
  })

  test('could trigger public guard when login', () => {
    store.dispatch(userSlice.actions._updateForTest({
      hasLogin: true,
      userTraderIds: [1, 2, 3],
      userType: 1,
      userEmail: 'basic@test.com',
      planStartAtUTC: null,
      planEndAtUTC: null,
    }))

    const history = createMemoryHistory({ initialEntries: ['/test'] })

    renderHook(usePublicGuard, { history })
    expect(history.location.pathname).toBe(routerTool.dashboardRoute())
  })
})
