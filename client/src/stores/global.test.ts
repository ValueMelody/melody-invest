import * as actions from 'actions'
import * as interfaces from '@shared/interfaces'
import { instance, mock } from 'ts-mockito'
import axios from 'axios'
import { contentSlice } from './content'
import { globalSlice } from './global'
import { store } from './index'

afterEach(() => {
  store.dispatch(contentSlice.actions._resetForTest())
})

describe('#store', () => {
  test('get default', () => {
    expect(store.getState().global).toStrictEqual({
      accessToken: '',
      accessExpiresIn: '',
      refreshToken: '',
      refreshExpiresIn: '',
      isLoading: false,
      messages: [],
    })
  })

  test('could trigger loading', async () => {
    const policyType = mock<interfaces.policyModel.Record>({})

    jest.spyOn(axios, 'get')
      .mockImplementation(async () => {
        expect(store.getState().global.isLoading).toBeTruthy()
        return {
          data: {
            ...instance(policyType),
            type: 1,
          },
        }
      })

    await store.dispatch(actions.fetchSystemPolicy(1))

    expect(store.getState().global.isLoading).toBeFalsy()
  })

  test('could remove message', async () => {
    store.dispatch(globalSlice.actions.addMessage({ title: 'test 1', type: 'success' }))
    store.dispatch(globalSlice.actions.addMessage({ title: 'test 2', type: 'success' }))
    expect(store.getState().global.messages.length).toBe(2)
    expect(store.getState().global.messages[0].title).toBe('test 1')
    expect(store.getState().global.messages[1].title).toBe('test 2')

    store.dispatch(globalSlice.actions.removeMessage(store.getState().global.messages[1].id))
    expect(store.getState().global.messages.length).toBe(1)
    expect(store.getState().global.messages[0].title).toBe('test 1')
  })
})
