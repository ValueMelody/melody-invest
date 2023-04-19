import * as actions from 'actions'
import axios from 'axios'
import { store } from './index'
import { tickerIdentitySlice } from './tickerIdentity'

afterEach(() => {
  store.dispatch(tickerIdentitySlice.actions._resetForTest())
})

describe('#store', () => {
  test('get default state', () => {
    expect(store.getState().tickerIdentity).toStrictEqual({
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

  test('could storeFromTickerDetail', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: detail,
        }
      })

    await store.dispatch(actions.fetchTraderTickerDetail({ envId: 1, tickerId: 2 }))

    expect(store.getState().tickerIdentity.detail['1-2']).toStrictEqual(detail)
  })
})
