import * as actions from 'actions'
import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import { instance, mock } from 'ts-mockito'
import axios from 'axios'
import { store } from './index'
import { userSlice } from './user'

afterEach(() => {
  store.dispatch(userSlice.actions._resetForTest())
})

const emptyUser = {
  userEmail: '',
  userTraderIds: [],
  userType: constants.User.Type.Guest,
  planStartAtUTC: null,
  planEndAtUTC: null,
  access: {
    canCreateTicker: false,
    canFollowEnv: false,
    canFollowCombo: false,
    canFollowTrader: false,
    accessibleEnvIds: [],
    accessibleComboIds: [],
    accessibleTraderIds: [],
  },
}

describe('#store', () => {
  test('get default state', () => {
    expect(store.getState().user).toStrictEqual(emptyUser)
  })

  const profileType = mock<interfaces.response.TraderProfile>({})
  const traderType = mock<interfaces.traderModel.Record>({})

  const profile1 = {
    ...instance(profileType),
    trader: {
      ...instance(traderType),
      id: 1,
    },
  }

  const profile2 = {
    ...instance(profileType),
    trader: {
      ...instance(traderType),
      id: 2,
    },
  }

  const userMock = {
    email: 'test@email.com',
    type: 1,
    planStartAtUTC: '2011-01-01',
    planEndAtUTC: '2012-01-01',
    traderProfiles: [profile1, profile2],
    traderCombos: [],
    traderEnvs: [],
    tickers: [],
  }

  test('could storeFromUserOverall from fetchUserOverall', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: userMock,
        }
      })
    await store.dispatch(actions.fetchUserOverall())

    expect(store.getState().user.userEmail).toStrictEqual(userMock.email)
    expect(store.getState().user.userType).toStrictEqual(userMock.type)
    expect(store.getState().user.planStartAtUTC).toStrictEqual(userMock.planStartAtUTC)
    expect(store.getState().user.planEndAtUTC).toStrictEqual(userMock.planEndAtUTC)
    expect(store.getState().user.userTraderIds).toStrictEqual([1, 2])
  })

  test('could addTraderById from createWatchedProfile', async () => {
    jest.spyOn(axios, 'post')
      .mockImplementation(async () => {
        return {
          data: true,
        }
      })
    await store.dispatch(actions.createWatchedProfile(2))
    expect(store.getState().user.userTraderIds).toStrictEqual([2])

    await store.dispatch(actions.createWatchedProfile(2))
    expect(store.getState().user.userTraderIds).toStrictEqual([2])
  })

  test('could addTraderFromProfile from createTraderProfile', async () => {
    jest.spyOn(axios, 'post')
      .mockImplementation(async () => {
        return {
          data: {
            trader: {
              id: 3,
            },
          },
        }
      })

    await store.dispatch(actions.createTraderProfile({
      traderEnvId: 1,
      traderPattern: instance(mock<interfaces.traderPatternModel.Create>({})),
    }))
    expect(store.getState().user.userTraderIds).toStrictEqual([3])

    await store.dispatch(actions.createTraderProfile({
      traderEnvId: 1,
      traderPattern: instance(mock<interfaces.traderPatternModel.Create>({})),
    }))
    expect(store.getState().user.userTraderIds).toStrictEqual([3])
  })

  test('could removeTraderById from deleteWatchedProfile', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: userMock,
        }
      })
    await store.dispatch(actions.fetchUserOverall())
    expect(store.getState().user.userTraderIds).toStrictEqual([1, 2])

    jest.spyOn(axios, 'delete')
      .mockImplementation(async () => {
        return {
          data: true,
        }
      })
    await store.dispatch(actions.deleteWatchedProfile(1))

    expect(store.getState().user.userTraderIds).toStrictEqual([2])
  })

  test('could onCreatePaymentSuccess', async () => {
    jest.spyOn(axios, 'post')
      .mockImplementation(async () => {
        return {
          data: {
            refreshToken: '123',
            refreshExpiresIn: '111',
            accessToken: '234',
            accessExpiresIn: '222',
          },
        }
      })
    await store.dispatch(actions.createUserPayment({
      orderId: '123',
      planType: 2,
      stateCode: '',
      provinceCode: '',
    }))

    expect(store.getState().user.userType).toBe(2)
  })

  test('could logout from lockUserAccount', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: userMock,
        }
      })
    await store.dispatch(actions.fetchUserOverall())

    jest.spyOn(axios, 'put')
      .mockImplementation(async () => {
        return {
          data: true,
        }
      })
    await store.dispatch(actions.lockUserAccount())
    expect(store.getState().user).toStrictEqual(emptyUser)
  })

  test('could logout from logout', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: userMock,
        }
      })
    await store.dispatch(actions.fetchUserOverall())

    store.dispatch(actions.logout())
    expect(store.getState().user).toStrictEqual(emptyUser)
  })
})
