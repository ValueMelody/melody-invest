import * as actions from 'actions'
import axios from 'axios'
import { traderBehaviorSlice } from './traderBehavior'
import { store } from './index'

afterEach(() => {
  store.dispatch(traderBehaviorSlice.actions._resetForTest())
})

describe('#store', () => {
  test('get default state', () => {
    expect(store.getState().traderBehavior).toStrictEqual({
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

  test('could storeFromBehaviorDetail', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: detail,
        }
      })

    await store.dispatch(actions.fetchTraderBehaviorDetail({ envId: 1, behavior: 'priceDailyDecreaseBuy' }))

    expect(store.getState().traderBehavior.detail).toStrictEqual({
      '1-priceDailyDecreaseBuy': detail,
    })
  })
})
