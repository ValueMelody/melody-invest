import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import { instance, mock } from 'ts-mockito'
import axios from 'axios'
import { store } from './index'
import { traderEnvSlice } from './traderEnv'

afterEach(() => {
  store.dispatch(traderEnvSlice.actions._resetForTest())
})

const envType = mock<interfaces.traderEnvModel.Record>({})

describe('#store', () => {
  test('get default state', () => {
    expect(store.getState().traderEnv).toStrictEqual({
      base: {},
      detail: {},
    })
  })

  const detail = {
    topProfiles: {
      yearly: [],
      pastYear: [],
      pastQuarter: [],
      pastMonth: [],
      pastWeek: [],
    },
  }

  test('could storeFromUserOverall', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: {
            traderEnvs: [
              { ...instance(envType), id: 4 },
            ],
            traderProfiles: [],
            traderCombos: [],
            tickers: [],
          },
        }
      })

    await store.dispatch(actions.fetchUserOverall())

    expect(store.getState().traderEnv.base).toStrictEqual({
      4: { ...instance(envType), id: 4 },
    })
  })

  test('could storeFromEnvDetail', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: detail,
        }
      })

    await store.dispatch(actions.fetchTraderEnvDetail(2))

    expect(store.getState().traderEnv.detail).toStrictEqual({
      2: detail,
    })
  })

  test('could storeFromEnvBase', async () => {
    const type = {
      ...instance(envType),
      id: 5,
    }
    jest.spyOn(axios, 'post')
      .mockImplementation(async () => {
        return {
          data: type,
        }
      })

    await store.dispatch(actions.createTraderEnv({
      name: 'test', tickerIds: null, startDate: '2000-06',
    }))

    expect(store.getState().traderEnv.base).toStrictEqual({
      5: type,
    })
  })

  test('could deleteTraderEnv', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: {
            traderCombos: [],
            traderProfiles: [],
            tickers: [],
            traderEnvs: [
              { ...instance(envType), id: 1 },
              { ...instance(envType), id: 2 },
              { ...instance(envType), id: 3 },
            ],
          },
        }
      })
    await store.dispatch(actions.fetchUserOverall())

    jest.spyOn(axios, 'delete')
      .mockImplementation(async () => {
        return {
          data: true,
        }
      })

    await store.dispatch(actions.deleteTraderEnv(2))

    expect(store.getState().traderEnv.base).toStrictEqual({
      1: { ...instance(envType), id: 1 },
      3: { ...instance(envType), id: 3 },
    })
  })

  test('could removeUserFollowed on lock account', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: {
            traderEnvs: [
              { ...instance(envType), id: 1 },
              { ...instance(envType), id: 2 },
              { ...instance(envType), id: 3 },
            ],
            traderCombos: [],
            traderProfiles: [],
            tickers: [],
          },
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

    expect(store.getState().traderEnv.base).toStrictEqual({})
  })
})
