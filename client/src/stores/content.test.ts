import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import { instance, mock } from 'ts-mockito'
import axios from 'axios'
import { contentSlice } from './content'
import { store } from './index'

afterEach(() => {
  store.dispatch(contentSlice.actions._resetForTest())
})

describe('#store', () => {
  test('get default state', () => {
    expect(store.getState().content).toStrictEqual({
      activeTraderChartIndex: 0,
    })
  })

  const policyType = mock<interfaces.policyModel.Record>({})

  test('could storePolicy', async () => {
    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        return {
          data: {
            ...instance(policyType),
            type: 1,
          },
        }
      })

    await store.dispatch(actions.fetchSystemPolicy(1))

    expect(store.getState().content.privacyPolicy).toStrictEqual({
      ...instance(policyType),
      type: 1,
    })
    expect(store.getState().content.termsPolicy).toBeUndefined()
  })

  test('could changeActiveTraderChartIndex', async () => {
    store.dispatch(contentSlice.actions.changeActiveTraderChartIndex(2))

    expect(store.getState().content.activeTraderChartIndex).toBe(2)
  })
})
