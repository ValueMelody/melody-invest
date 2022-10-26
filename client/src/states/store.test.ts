import axios from 'axios'
import { createMemoryHistory } from 'history'
import { renderHook, act } from 'test.utils'
import store from './store'
import * as localeTool from 'tools/locale'
import * as storageAdapter from 'adapters/storage'
import * as routerEnum from 'enums/router'

describe('#common', () => {
  test('could setCommon', () => {
    const { result } = renderHook(store, { disableStore: true })
    expect(result.current.common).toStrictEqual({
      isLoading: false,
      messages: [],
      activeChartIndex: 0,
    })

    const newState = {
      isLoading: true,
      messages: ['msg1', 'msg2', 'msg3'],
      activeChartIndex: 1,
    }
    // @ts-ignore
    act(() => result.current.setCommon(newState))
    expect(result.current.common).toStrictEqual(newState)
  })
})

describe('#resources', () => {
  test('could setResources', () => {
    const { result } = renderHook(store, { disableStore: true })
    expect(result.current.resources).toStrictEqual({
      tickerIdentities: {},
      tickerCategories: {},
      hasLogin: false,
      userTraderIds: [],
      userType: 0,
      userEmail: '',
      planStartAtUTC: null,
      planEndAtUTC: null,
      overallTopTraderProfiles: null,
      privacyPolicy: null,
      termsPolicy: null,
    })

    const newState = {
      tickerIdentities: {
        1: 'ticker1',
      },
      tickerCategories: {
        1: 'category1',
      },
      hasLogin: true,
      userTraderIds: [1, 2, 3, 4],
      userType: 1,
      userEmail: 'test@email.com',
      planStartAtUTC: '2000-01-01',
      planEndAtUTC: '2001-01-01',
      overallTopTraderProfiles: [1, 2, 3],
      privacyPolicy: 'This is privacy policy',
      termsPolicy: 'This is terms policy',
    }
    // @ts-ignore
    act(() => result.current.setResources(newState))
    expect(result.current.resources).toStrictEqual(newState)
  })
})

describe('#traderProfiles', () => {
  test('could setTraderProfiles', () => {
    const { result } = renderHook(store, { disableStore: true })
    expect(result.current.traderProfiles).toStrictEqual({})

    const newState = {
      1: 'profile1',
      2: 'profile2',
    }
    // @ts-ignore
    act(() => result.current.setTraderProfiles(newState))
    expect(result.current.traderProfiles).toStrictEqual(newState)
  })
})

describe('#traderBehaviors', () => {
  test('could setTraderBehaviors', () => {
    const { result } = renderHook(store, { disableStore: true })
    expect(result.current.traderBehaviors).toStrictEqual({})

    const newState = {
      1: 'behavior1',
      2: 'behavior2',
    }
    // @ts-ignore
    act(() => result.current.setTraderBehaviors(newState))
    expect(result.current.traderBehaviors).toStrictEqual(newState)
  })
})

describe('#traderTickers', () => {
  test('could setTraderTickers', () => {
    const { result } = renderHook(store, { disableStore: true })
    expect(result.current.traderTickers).toStrictEqual({})

    const newState = {
      1: 'ticker1',
      2: 'ticker2',
    }
    // @ts-ignore
    act(() => result.current.setTraderTickers(newState))
    expect(result.current.traderTickers).toStrictEqual(newState)
  })
})

describe('#traderEnvs', () => {
  test('could setTraderEnvs', () => {
    const { result } = renderHook(store, { disableStore: true })
    expect(result.current.traderEnvs).toStrictEqual({})

    const newState = {
      1: 'env1',
      2: 'env2',
    }
    // @ts-ignore
    act(() => result.current.setTraderEnvs(newState))
    expect(result.current.traderEnvs).toStrictEqual(newState)
  })
})

describe('#traderCombos', () => {
  test('could setTraderCombos', () => {
    const { result } = renderHook(store, { disableStore: true })
    expect(result.current.traderCombos).toStrictEqual({})

    const newState = {
      1: 'combo1',
      2: 'combo2',
    }
    // @ts-ignore
    act(() => result.current.setTraderCombos(newState))
    expect(result.current.traderCombos).toStrictEqual(newState)
  })
})

describe('#loading', () => {
  test('could change loading', () => {
    const { result } = renderHook(store, { disableStore: true })
    expect(result.current.common.isLoading).toBe(false)

    act(() => result.current.startLoading())
    expect(result.current.common.isLoading).toBe(true)

    act(() => result.current.stopLoading())
    expect(result.current.common.isLoading).toBe(false)
  })
})

describe('#messages', () => {
  test('could change messages', () => {
    const { result } = renderHook(store, { disableStore: true })
    expect(result.current.common.messages).toStrictEqual([])

    act(() => result.current.addMessage({ id: 1 }))
    expect(result.current.common.messages).toStrictEqual([{ id: 1 }])
    act(() => result.current.addMessage({ id: 2 }))
    expect(result.current.common.messages).toStrictEqual([{ id: 1 }, { id: 2 }])

    act(() => result.current.removeMessage(2))
    expect(result.current.common.messages).toStrictEqual([{ id: 1 }])
    act(() => result.current.removeMessage(1))
    expect(result.current.common.messages).toStrictEqual([])
  })
})

describe('#cleanUserState', () => {
  test('could clean user state', () => {
    const state = {
      resources: {
        hasLogin: true,
        userTraderIds: [1, 2, 3, 4],
        userType: 2,
        userEmail: 'pro@test.com',
        planStartAtUTC: '2022-02-01',
        planEndAtUTC: '2023-01-01',
      },
      traderEnvs: {
        1: { record: { id: 1, isSystem: true } },
        2: { record: { id: 2, isSystem: false } },
      },
      traderCombos: {
        1: { identity: { id: 1, isSystem: false } },
        2: { identity: { id: 2, isSystem: true } },
      },
    }

    const { result } = renderHook(store, { disableStore: true })
    act(() => result.current.setResources(state.resources))
    act(() => result.current.setTraderEnvs(state.traderEnvs))
    act(() => result.current.setTraderCombos(state.traderCombos))

    axios.defaults.headers.common.Authorization = 'Bearer 123ABC'
    expect(axios.defaults.headers.common.Authorization).toBe('Bearer 123ABC')
    storageAdapter.set('authToken', '123456')
    expect(storageAdapter.get('authToken')).toBe('123456')

    expect(result.current.resources).toStrictEqual(state.resources)
    expect(result.current.traderEnvs).toStrictEqual(state.traderEnvs)
    expect(result.current.traderCombos).toStrictEqual(state.traderCombos)

    act(() => result.current.cleanUserState())

    expect(result.current.resources).toStrictEqual({
      hasLogin: false,
      userTraderIds: [],
      userType: 0,
      userEmail: '',
      planStartAtUTC: null,
      planEndAtUTC: null,
    })
    expect(result.current.traderEnvs).toStrictEqual({ 1: { record: { id: 1, isSystem: true } } })
    expect(result.current.traderCombos).toStrictEqual({ 2: { identity: { id: 2, isSystem: true } } })

    expect(axios.defaults.headers.common.Authorization).toBe('')
    expect(storageAdapter.get('authToken')).toBe(null)
  })
})

describe('#showRequestError', () => {
  test('do not show error if there is no message', () => {
    const { result } = renderHook(store, { disableStore: true })
    act(() => result.current.showRequestError())
    expect(result.current.common.messages.length).toBe(0)
  })

  test('do not show error if message is empty', () => {
    const { result } = renderHook(store, { disableStore: true })
    act(() => result.current.showRequestError({ message: '' }))
    expect(result.current.common.messages.length).toBe(0)
  })

  test('could show error', () => {
    const history = createMemoryHistory({ initialEntries: ['/user'] })
    const { result } = renderHook(store, { history, disableStore: true })

    act(() => result.current.setResources({ hasLogin: true }))

    expect(result.current.common.messages.length).toBe(0)
    expect(result.current.resources.hasLogin).toBe(true)

    act(() => result.current.showRequestError({
      message: 'error message 1',
    }))

    expect(result.current.common.messages.length).toBe(1)
    expect(result.current.common.messages[0].type).toBe('error')
    expect(result.current.common.messages[0].title).toBe('error message 1')
    expect(history.location.pathname).toBe('/user')
    expect(result.current.resources.hasLogin).toBe(true)
  })

  test('could logout user on 401 error', () => {
    const history = createMemoryHistory({ initialEntries: ['/user'] })
    const unAuthorizedError = localeTool.t('error.401')

    const { result } = renderHook(store, { history, disableStore: true })

    act(() => result.current.setResources({ hasLogin: true }))

    expect(result.current.common.messages.length).toBe(0)
    expect(result.current.resources.hasLogin).toBe(true)

    act(() => result.current.showRequestError({
      message: unAuthorizedError,
    }))

    expect(result.current.common.messages.length).toBe(1)
    expect(result.current.common.messages[0].type).toBe('error')
    expect(result.current.common.messages[0].title).toBe(unAuthorizedError)
    expect(history.location.pathname).toBe(routerEnum.Nav.SignIn)
    expect(result.current.resources.hasLogin).toBe(false)
  })
})
