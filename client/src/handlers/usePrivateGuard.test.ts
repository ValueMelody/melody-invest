import { createMemoryHistory } from 'history'
import { renderHook } from 'test.utils'
import usePrivateGuard from './usePrivateGuard'
import * as routerTool from 'tools/router'
import { store } from 'stores'
import { userSlice } from 'stores/user'

afterEach(() => {
  jest.clearAllMocks()
})

describe('#usePrivateGuard', () => {
  test('could trigger private guard when not login', () => {
    const history = createMemoryHistory({ initialEntries: ['/test'] })

    renderHook(usePrivateGuard, { history })
    expect(history.location.pathname).toBe(routerTool.signInRoute())
  })

  test('should not trigger private guard when login', () => {
    store.dispatch(userSlice.actions._updateForTest({
      hasLogin: true,
      userTraderIds: [1, 2, 3],
      userType: 1,
      userEmail: 'basic@test.com',
      planStartAtUTC: null,
      planEndAtUTC: null,
    }))
    const history = createMemoryHistory({ initialEntries: ['/test'] })

    renderHook(usePrivateGuard, { history })
    expect(history.location.pathname).toBe('/test')
  })
})
