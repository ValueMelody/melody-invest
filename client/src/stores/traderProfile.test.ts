import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import { instance, mock } from 'ts-mockito'
import axios from 'axios'
import { store } from './index'
import { traderProfileSlice } from './traderProfile'

afterEach(() => {
  store.dispatch(traderProfileSlice.actions._resetForTest())
})

const traderType = mock<interfaces.traderModel.Record>({})
const profileType = mock<interfaces.response.TraderProfile>({})

describe('#store', () => {
  test('get default state', () => {
    expect(store.getState().traderProfile).toStrictEqual({
      base: {},
      detail: {},
    })
  })

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

  const profile3 = {
    ...instance(profileType),
    trader: {
      ...instance(traderType),
      id: 3,
    },
  }

  const topProfiles = {
    yearly: [profile1, profile2],
    pastYear: [profile1],
    pastQuarter: [profile2],
    pastMonth: [profile3],
    pastWeek: [profile3],
  }

  test('could storeFromDetailTops from fetchTraderEnvDetail', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: {
            topProfiles,
          },
        }
      })
    await store.dispatch(actions.fetchTraderEnvDetail(1))

    expect(store.getState().traderProfile.base).toStrictEqual({
      1: profile1,
      2: profile2,
      3: profile3,
    })
  })

  test('could storeFromDetailTops from fetchTraderBehaviorDetail', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: {
            topProfiles,
          },
        }
      })
    await store.dispatch(actions.fetchTraderBehaviorDetail({
      envId: 1, behavior: 'epsQuarterlyBeatBuy',
    }))

    expect(store.getState().traderProfile.base).toStrictEqual({
      1: profile1,
      2: profile2,
      3: profile3,
    })
  })

  test('could storeFromComboDetail from fetchTraderComboDetail', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: {
            profiles: [profile1, profile2, profile3],
          },
        }
      })
    await store.dispatch(actions.fetchTraderComboDetail(1))

    expect(store.getState().traderProfile.base).toStrictEqual({
      1: profile1,
      2: profile2,
      3: profile3,
    })
  })

  test('could storeFromUserOverall from fetchUserOverall', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: {
            traderProfiles: [profile1, profile2],
            traderCombos: [],
            traderEnvs: [],
          },
        }
      })
    await store.dispatch(actions.fetchUserOverall())

    expect(store.getState().traderProfile.base).toStrictEqual({
      1: profile1,
      2: profile2,
    })
  })

  test('could storeFromTraderProfile from fetchTraderProfile', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: profile2,
        }
      })
    await store.dispatch(actions.fetchTraderProfile({
      id: 2,
      accessCode: 'ABC',
    }))

    expect(store.getState().traderProfile.base).toStrictEqual({
      2: profile2,
    })
  })

  test('could storeFromTraderProfile from createTraderProfile', async () => {
    jest.spyOn(axios, 'post')
      .mockImplementation(async () => {
        return {
          data: profile3,
        }
      })
    await store.dispatch(actions.createTraderProfile({
      traderEnvId: 1,
      traderPattern: instance(mock<interfaces.traderPatternModel.Create>({})),
    }))

    expect(store.getState().traderProfile.base).toStrictEqual({
      3: profile3,
    })
  })

  test('could storeFromProfileDetail from fetchTraderProfileDetail', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: {
            profileEnvs: [],
            holdings: [],
          },
        }
      })
    await store.dispatch(actions.fetchTraderProfileDetail({
      id: 1,
      accessCode: 'ABC',
    }))

    expect(store.getState().traderProfile.detail).toStrictEqual({
      1: {
        profileEnvs: [],
        holdings: [],
      },
    })
  })
})
