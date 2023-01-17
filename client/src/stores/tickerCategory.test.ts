import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import { instance, mock } from 'ts-mockito'
import axios from 'axios'
import { store } from './index'
import { tickerCategorySlice } from './tickerCategory'

afterEach(() => {
  store.dispatch(tickerCategorySlice.actions._resetForTest())
})

describe('#store', () => {
  test('get default state', () => {
    expect(store.getState().tickerCategory).toStrictEqual({
      base: {},
    })
  })

  const categoryType = mock<interfaces.tickerCategoryModel.Record>({})

  test('could storeFromSystemDefaults', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: {
            tickerIdentities: [],
            traderEnvs: [],
            tickerCategories: [
              { ...instance(categoryType), id: 1 },
              { ...instance(categoryType), id: 2 },
            ],
          },
        }
      })

    await store.dispatch(actions.fetchSystemDefaults())

    expect(store.getState().tickerCategory.base).toStrictEqual({
      1: { ...instance(categoryType), id: 1 },
      2: { ...instance(categoryType), id: 2 },
    })
  })
})
