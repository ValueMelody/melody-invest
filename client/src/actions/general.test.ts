import * as general from './general'
import * as requestAdapter from 'adapters/request'
import { act, waitFor } from 'test.utils'
import { globalSlice } from 'stores/global'
import { store } from 'stores'

jest.mock('adapters/request', () => {
  const actual = jest.requireActual('adapters/request')
  return {
    __esModule: true,
    ...actual,
  }
})

afterEach(() => {
  store.dispatch(globalSlice.actions._resetForTest())
})

describe('refreshAccessToken', () => {
  test('do nothing if access exists', () => {
    const sendPutRequest = jest.fn()
    jest
      .spyOn(requestAdapter, 'sendPutRequest')
      .mockImplementation(sendPutRequest)

    store.dispatch(globalSlice.actions._updateForTest({
      refreshToken: null,
    }))
    act(() => {
      store.dispatch(general.refreshAccessToken())
    })
    expect(sendPutRequest).toBeCalledTimes(0)
  })

  test('could refresh token', async () => {
    const previousDate = new Date()
    previousDate.setMinutes(previousDate.getMinutes() - 1)
    const accessExpiresIn = previousDate.toISOString()

    const laterDate = new Date()
    laterDate.setMinutes(laterDate.getMinutes() + 2)
    const refreshExpiresIn = laterDate.toISOString()

    const sendPutRequest = jest.fn().mockReturnValue({
      accessToken: '222',
      accessExpiresIn: '2000-01-01',
    })
    jest
      .spyOn(requestAdapter, 'sendPutRequest')
      .mockImplementation(async () => sendPutRequest())

    const setAuthToken = jest.fn()
    jest
      .spyOn(requestAdapter, 'setAuthToken')
      .mockImplementation(setAuthToken)

    store.dispatch(globalSlice.actions._updateForTest({
      refreshToken: '123',
      accessToken: '111',
      accessExpiresIn,
      refreshExpiresIn,
    }))

    act(() => {
      store.dispatch(general.refreshAccessToken())
    })

    expect(sendPutRequest).toBeCalledTimes(1)
    expect(setAuthToken).toBeCalledTimes(1)
    expect(setAuthToken).toBeCalledWith('123')

    await waitFor(() => {
      const global = store.getState().global
      expect(global.accessToken).toBe('222')
      expect(global.accessExpiresIn).toBe('2000-01-01')
    })
  })
})
