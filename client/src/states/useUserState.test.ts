import { renderHook, act } from 'test.utils'
import useUserState from './useUserState'
import * as store from 'states/store'

describe('#getUser', () => {
  test('could get guest', () => {
    const { result } = renderHook(
      useUserState,
    )
    expect(result.current.getUser()).toStrictEqual({
      hasLogin: false,
      userTraderIds: [],
      userType: 0,
      userEmail: '',
      planStartAtUTC: null,
      planEndAtUTC: null,
      canFollowEnv: false,
      canFollowCombo: false,
      canFollowTrader: false,
      accessibleEnvIds: [],
      accessibleComboIds: [],
      accessibleTraderIds: [],
    })
  })

  const basicStore = {
    resources: {
      hasLogin: true,
      userTraderIds: [1, 2, 3],
      userType: 1,
      userEmail: 'basic@test.com',
      planStartAtUTC: null,
      planEndAtUTC: null,
    },
  }

  test('could get basic', () => {
    const { result } = renderHook(
      useUserState,
      { store: basicStore },
    )
    expect(result.current.getUser()).toStrictEqual({
      hasLogin: true,
      userTraderIds: [1, 2, 3],
      userType: 1,
      userEmail: 'basic@test.com',
      planStartAtUTC: null,
      planEndAtUTC: null,
      canFollowEnv: false,
      canFollowCombo: false,
      canFollowTrader: true,
      accessibleEnvIds: [],
      accessibleComboIds: [],
      accessibleTraderIds: [1, 2, 3],
    })
  })

  test('could restrict basic', () => {
    const { result } = renderHook(
      useUserState,
      {
        store: {
          ...basicStore,
          resources: {
            ...basicStore.resources,
            userTraderIds: [1, 2, 3, 4, 5, 6, 7],
          },
          traderEnvs: {
            1: { record: { id: 1, isSystem: true } },
            2: { record: { id: 2, isSystem: false } },
          },
          traderCombos: {
            1: { identity: { id: 1, isSystem: false } },
            2: { identity: { id: 2, isSystem: true } },
          },
        },
      },
    )
    expect(result.current.getUser()).toStrictEqual({
      hasLogin: true,
      userTraderIds: [1, 2, 3, 4, 5, 6, 7],
      userType: 1,
      userEmail: 'basic@test.com',
      planStartAtUTC: null,
      planEndAtUTC: null,
      canFollowEnv: false,
      canFollowCombo: false,
      canFollowTrader: false,
      accessibleEnvIds: [],
      accessibleComboIds: [],
      accessibleTraderIds: [1, 2, 3, 4, 5],
    })
  })

  const proStore = {
    resources: {
      hasLogin: true,
      userTraderIds: [1, 2, 3, 4],
      userType: 2,
      userEmail: 'pro@test.com',
      planStartAtUTC: '2022-01-01',
      planEndAtUTC: null,
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

  test('could get pro', () => {
    const { result } = renderHook(
      useUserState,
      { store: proStore },
    )
    expect(result.current.getUser()).toStrictEqual({
      hasLogin: true,
      userTraderIds: [1, 2, 3, 4],
      userType: 2,
      userEmail: 'pro@test.com',
      planStartAtUTC: '2022-01-01',
      planEndAtUTC: null,
      canFollowEnv: true,
      canFollowCombo: true,
      canFollowTrader: true,
      accessibleEnvIds: [2],
      accessibleComboIds: [1],
      accessibleTraderIds: [1, 2, 3, 4],
    })
  })

  test('could restrict pro', () => {
    const { result } = renderHook(
      useUserState,
      {
        store: {
          ...proStore,
          resources: {
            hasLogin: true,
            userTraderIds: Array(40).fill(null).map((p, i) => i + 1),
            userType: 2,
            userEmail: 'pro@test.com',
            planStartAtUTC: '2022-01-01',
            planEndAtUTC: null,
          },
          traderEnvs: {
            1: { record: { id: 1, isSystem: false } },
            2: { record: { id: 2, isSystem: false } },
            3: { record: { id: 3, isSystem: false } },
            4: { record: { id: 4, isSystem: false } },
            5: { record: { id: 5, isSystem: false } },
          },
          traderCombos: {
            1: { identity: { id: 1, isSystem: false } },
            2: { identity: { id: 2, isSystem: false } },
            3: { identity: { id: 3, isSystem: false } },
            4: { identity: { id: 4, isSystem: false } },
            5: { identity: { id: 5, isSystem: false } },
          },
        },
      },
    )
    expect(result.current.getUser()).toStrictEqual({
      hasLogin: true,
      userTraderIds: Array(40).fill(null).map((p, i) => i + 1),
      userType: 2,
      userEmail: 'pro@test.com',
      planStartAtUTC: '2022-01-01',
      planEndAtUTC: null,
      canFollowEnv: false,
      canFollowCombo: false,
      canFollowTrader: false,
      accessibleEnvIds: [1, 2, 3],
      accessibleComboIds: [1, 2, 3],
      accessibleTraderIds: Array(30).fill(null).map((p, i) => i + 1),
    })
  })

  const premiumStore = {
    resources: {
      hasLogin: true,
      userTraderIds: [1, 2, 3, 4, 5],
      userType: 3,
      userEmail: 'premium@test.com',
      planStartAtUTC: '2022-02-01',
      planEndAtUTC: '2023-01-01',
    },
    traderEnvs: {
      1: { record: { id: 1, isSystem: true } },
      2: { record: { id: 2, isSystem: false } },
      3: { record: { id: 3, isSystem: false } },
    },
    traderCombos: {
      1: { identity: { id: 1, isSystem: false } },
      2: { identity: { id: 2, isSystem: true } },
      3: { identity: { id: 3, isSystem: false } },
    },
  }

  test('could get premium', () => {
    const { result } = renderHook(
      useUserState,
      { store: premiumStore },
    )
    expect(result.current.getUser()).toStrictEqual({
      hasLogin: true,
      userTraderIds: [1, 2, 3, 4, 5],
      userType: 3,
      userEmail: 'premium@test.com',
      planStartAtUTC: '2022-02-01',
      planEndAtUTC: '2023-01-01',
      canFollowEnv: true,
      canFollowCombo: true,
      canFollowTrader: true,
      accessibleEnvIds: [2, 3],
      accessibleComboIds: [1, 3],
      accessibleTraderIds: [1, 2, 3, 4, 5],
    })
  })

  test('could restrict premium', () => {
    const { result } = renderHook(
      useUserState,
      {
        store: {
          resources: {
            hasLogin: true,
            userTraderIds: Array(120).fill(null).map((p, i) => i + 1),
            userType: 3,
            userEmail: 'premium@test.com',
            planStartAtUTC: '2022-02-01',
            planEndAtUTC: '2023-01-01',
          },
          traderEnvs: {
            1: { record: { id: 1, isSystem: false } },
            2: { record: { id: 2, isSystem: false } },
            3: { record: { id: 3, isSystem: false } },
            4: { record: { id: 4, isSystem: false } },
            5: { record: { id: 5, isSystem: false } },
            6: { record: { id: 6, isSystem: false } },
            7: { record: { id: 7, isSystem: false } },
            8: { record: { id: 8, isSystem: false } },
            9: { record: { id: 9, isSystem: false } },
            10: { record: { id: 10, isSystem: false } },
            11: { record: { id: 11, isSystem: false } },
            12: { record: { id: 12, isSystem: false } },
          },
          traderCombos: {
            1: { identity: { id: 1, isSystem: false } },
            2: { identity: { id: 2, isSystem: false } },
            3: { identity: { id: 3, isSystem: false } },
            4: { identity: { id: 4, isSystem: false } },
            5: { identity: { id: 5, isSystem: false } },
            6: { identity: { id: 6, isSystem: false } },
            7: { identity: { id: 7, isSystem: false } },
            8: { identity: { id: 8, isSystem: false } },
            9: { identity: { id: 9, isSystem: false } },
            10: { identity: { id: 10, isSystem: false } },
            11: { identity: { id: 11, isSystem: false } },
            12: { identity: { id: 12, isSystem: false } },
          },
        },
      },
    )
    expect(result.current.getUser()).toStrictEqual({
      hasLogin: true,
      userTraderIds: Array(120).fill(null).map((p, i) => i + 1),
      userType: 3,
      userEmail: 'premium@test.com',
      planStartAtUTC: '2022-02-01',
      planEndAtUTC: '2023-01-01',
      canFollowEnv: false,
      canFollowCombo: false,
      canFollowTrader: false,
      accessibleEnvIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      accessibleComboIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      accessibleTraderIds: Array(100).fill(null).map((p, i) => i + 1),
    })
  })
})

describe('#removeUser', () => {
  test('could remove user', () => {
    const cleanUserState = jest.fn()

    // @ts-ignore
    jest.spyOn(store, 'default').mockImplementation(() => ({
      cleanUserState,
      resources: {
        userTraderIds: [],
      },
      setResources: () => {},
      traderEnvs: {},
      setTraderEnvs: () => {},
      traderCombos: {},
      setTraderCombos: () => {},
    }))

    const { result } = renderHook(
      useUserState,
    )

    act(() => result.current.removeUser())

    expect(cleanUserState).toBeCalledTimes(1)
  })
})
