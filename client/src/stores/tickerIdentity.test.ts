import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import { instance, mock } from 'ts-mockito'
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

  const tickerType = mock<interfaces.tickerModel.Record>({})

  const detail = {
    topProfiles: {
      yearly: [],
      pastYear: [],
      pastQuarter: [],
      pastMonth: [],
      pastWeek: [],
    },
  }

  test('could storeFromSystemDefaults', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: {
            tickers: [
              { ...instance(tickerType), id: 1 },
              { ...instance(tickerType), id: 2 },
              { ...instance(tickerType), id: 3 },
            ],
            traderEnvs: [],
          },
        }
      })

    await store.dispatch(actions.fetchSystemDefaults())

    expect(store.getState().tickerIdentity.base).toStrictEqual({
      1: { ...instance(tickerType), id: 1 },
      2: { ...instance(tickerType), id: 2 },
      3: { ...instance(tickerType), id: 3 },
    })
  })

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
