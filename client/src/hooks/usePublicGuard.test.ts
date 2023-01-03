import * as routerTool from 'tools/router'
import { createMemoryHistory } from 'history'
import { globalSlice } from 'stores/global'
import { renderHook } from 'test.utils'
import { store } from 'stores'
import usePublicGuard from './usePublicGuard'
import { userSlice } from 'stores/user'

afterEach(() => {
  jest.clearAllMocks()
  store.dispatch(globalSlice.actions._resetForTest())
})

describe('#usePublicGuard', () => {
  test('could trigger public guard when login', () => {
    store.dispatch(globalSlice.actions._updateForTest({
      refreshToken: '123',
    }))
    store.dispatch(userSlice.actions._updateForTest({
      userTraderIds: [1, 2, 3],
      userType: 1,
      userEmail: 'basic@test.com',
      planStartAtUTC: null,
      planEndAtUTC: null,
    }))

    const history = createMemoryHistory({ initialEntries: ['/test'] })

    renderHook(usePublicGuard, { history, initStore: store })
    expect(history.location.pathname).toBe(routerTool.dashboardRoute())
  })

  test('should not trigger public guard when not login', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })

    renderHook(usePublicGuard, { history, initStore: store })
    expect(history.location.pathname).toBe('/test')
  })
})
