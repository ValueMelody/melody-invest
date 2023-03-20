import * as actions from 'actions'
import * as commonEnum from 'enums/common'
import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as storageAdapter from 'adapters/storage'
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
      acceptedDisclaimer: false,
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

  test('on payment failed', async () => {
    store.dispatch(globalSlice.actions.onCreatePaymentFailed())
    expect(store.getState().global.isLoading).toBe(false)
    const messages = store.getState().global.messages
    expect(messages[messages.length - 1].type).toBe('failure')
    expect(messages[messages.length - 1].title).toBe(localeTool.t('setting.paymentFailed', {
      email: commonEnum.Env.ContactEmail,
    }))
  })

  test('on create user token', async () => {
    const tokens = {
      refreshToken: 'aaa',
      refreshExpiresIn: '2022-01-05',
      accessToken: 'bbb',
      accessExpiresIn: '2022-01-01',
    }
    store.dispatch(globalSlice.actions.onCreateUserToken(tokens))
    expect(store.getState().global.isLoading).toBe(false)
    expect(store.getState().global.refreshToken).toBe(tokens.refreshToken)
    expect(store.getState().global.refreshExpiresIn).toBe(tokens.refreshExpiresIn)
    expect(store.getState().global.accessToken).toBe(tokens.accessToken)
    expect(store.getState().global.accessExpiresIn).toBe(tokens.accessExpiresIn)
    expect(storageAdapter.get(commonEnum.StorageKey.RefreshToken)).toBe(tokens.refreshToken)
    expect(storageAdapter.get(commonEnum.StorageKey.RefreshExpiresIn)).toBe(tokens.refreshExpiresIn)
    expect(storageAdapter.get(commonEnum.StorageKey.AccessToken)).toBe(tokens.accessToken)
    expect(storageAdapter.get(commonEnum.StorageKey.AccessExpiresIn)).toBe(tokens.accessExpiresIn)
    expect(axios.defaults.headers.common.Authorization).toBe(`Bearer ${tokens.accessToken}`)
  })

  test('onRequestRejected with 401', () => {
    store.dispatch(globalSlice.actions._updateForTest({
      refreshToken: 'aaa',
      refreshExpiresIn: '2022-01-05',
      accessToken: 'bbb',
      accessExpiresIn: '2022-01-01',
    }))
    // @ts-ignore
    store.dispatch(globalSlice.actions.onRequestRejected({ message: localeTool.t('error.401') }))
    expect(store.getState().global.isLoading).toBe(false)
    const messages = store.getState().global.messages
    expect(messages[messages.length - 1].type).toBe('failure')
    expect(messages[messages.length - 1].title).toBe(localeTool.t('error.401'))
    expect(store.getState().global.refreshToken).toBe('')
    expect(store.getState().global.refreshExpiresIn).toBe('')
    expect(store.getState().global.accessToken).toBe('')
    expect(store.getState().global.accessExpiresIn).toBe('')
  })

  test('onRequestRejected with no message', () => {
    store.dispatch(globalSlice.actions._updateForTest({
      refreshToken: 'aaa',
      refreshExpiresIn: '2022-01-05',
      accessToken: 'bbb',
      accessExpiresIn: '2022-01-01',
    }))
    store.dispatch(globalSlice.actions.onRequestRejected())
    expect(store.getState().global.isLoading).toBe(false)
    const messages = store.getState().global.messages
    expect(messages[messages.length - 1].type).toBe('failure')
    expect(messages[messages.length - 1].title).toBe(localeTool.t('error.500'))
    expect(store.getState().global.refreshToken).toBe('aaa')
    expect(store.getState().global.refreshExpiresIn).toBe('2022-01-05')
    expect(store.getState().global.accessToken).toBe('bbb')
    expect(store.getState().global.accessExpiresIn).toBe('2022-01-01')
  })
})
