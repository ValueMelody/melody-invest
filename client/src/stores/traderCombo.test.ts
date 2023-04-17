import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import { instance, mock } from 'ts-mockito'
import axios from 'axios'
import { store } from './index'
import { traderComboSlice } from './traderCombo'

afterEach(() => {
  store.dispatch(traderComboSlice.actions._resetForTest())
})

const comboType = mock<interfaces.traderComboModel.Identity>({})

describe('#store', () => {
  test('get default state', () => {
    expect(store.getState().traderCombo).toStrictEqual({
      base: {},
      detail: {},
    })
  })

  const detail = {
    profiles: [],
  }

  test('could storeFromUserOverall', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: {
            traderEnvs: [],
            traderProfiles: [],
            traderCombos: [{ ...instance(comboType), id: 4 }],
          },
        }
      })

    await store.dispatch(actions.fetchUserOverall())

    expect(store.getState().traderCombo.base).toStrictEqual({
      4: { ...instance(comboType), id: 4 },
    })
  })

  test('could storeFromComboDetail', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: detail,
        }
      })

    await store.dispatch(actions.fetchTraderComboDetail(2))

    expect(store.getState().traderCombo.detail).toStrictEqual({
      2: detail,
    })
  })

  test('could storeFromComboBase', async () => {
    const type = {
      ...instance(comboType),
      id: 5,
    }
    jest.spyOn(axios, 'post')
      .mockImplementation(async () => {
        return {
          data: type,
        }
      })

    await store.dispatch(actions.createTraderCombo({
      name: 'test', traderIds: [1, 2, 3],
    }))

    expect(store.getState().traderCombo.base).toStrictEqual({
      5: type,
    })
  })

  test('could deleteTraderCombo', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: {
            traderEnvs: [],
            traderProfiles: [],
            traderCombos: [
              { ...instance(comboType), id: 1 },
              { ...instance(comboType), id: 2 },
              { ...instance(comboType), id: 3 },
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

    await store.dispatch(actions.deleteTraderCombo(2))

    expect(store.getState().traderCombo.base).toStrictEqual({
      1: { ...instance(comboType), id: 1 },
      3: { ...instance(comboType), id: 3 },
    })
  })

  test('could removeUserFollowed on logout', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: {
            traderEnvs: [],
            traderProfiles: [],
            traderCombos: [
              { ...instance(comboType), id: 1 },
              { ...instance(comboType), id: 2 },
              { ...instance(comboType), id: 3 },
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

    store.dispatch(actions.logout())

    expect(store.getState().traderCombo.base).toStrictEqual({})
  })

  test('could removeUserFollowed on lock account', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: {
            traderEnvs: [],
            traderProfiles: [],
            traderCombos: [
              { ...instance(comboType), id: 1 },
              { ...instance(comboType), id: 2 },
              { ...instance(comboType), id: 3 },
            ],
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

    expect(store.getState().traderCombo.base).toStrictEqual({})
  })
})
