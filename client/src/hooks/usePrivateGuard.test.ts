import * as routerTool from 'tools/router'
import { createMemoryHistory } from 'history'
import { globalSlice } from 'stores/global'
import { renderHook } from 'test.utils'
import { store } from 'stores'
import { userSlice } from 'stores/user'
import usePrivateGuard from './usePrivateGuard'

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

    renderHook(usePrivateGuard, { history })
    expect(history.location.pathname).toBe('/test')
  })
})
