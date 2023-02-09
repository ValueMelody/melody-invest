import * as localeTool from 'tools/locale'
import * as request from './request'
import axios from 'axios'

describe('#setAuthToken', () => {
  test('could set auth', () => {
    request.setAuthToken('ABC')
    expect(axios.defaults.headers.common.Authorization).toBe('Bearer ABC')

    request.setAuthToken('')
    expect(axios.defaults.headers.common.Authorization).toBe('')
  })

  test('could sent get request', async () => {
    const get = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation(async (url) => {
      get(url)
      return {
        data: 123,
      }
    })

    const result = await request.sendGetRequest('abc.com')
    expect(get).toBeCalledWith('abc.com')
    expect(result).toBe(123)
  })

  test('could catch get error', async () => {
    jest.spyOn(axios, 'get').mockImplementation(async () => {
      throw new Error()
    })

    await expect(async () => await request.sendGetRequest('abc.com')).rejects.toThrowError()
  })

  test('could sent post request', async () => {
    const post = jest.fn()
    jest.spyOn(axios, 'post').mockImplementation(async (url, params) => {
      post(url, params)
      return {
        data: 123,
      }
    })

    const result = await request.sendPostRequest('abc.com', { name: '111' })
    expect(post).toBeCalledWith('abc.com', { name: '111' })
    expect(result).toBe(123)
  })

  test('could catch post error', async () => {
    jest.spyOn(axios, 'post').mockImplementation(async () => {
      throw new Error()
    })

    await expect(async () => await request.sendPostRequest('abc.com')).rejects.toThrowError()
  })

  test('could sent put request', async () => {
    const put = jest.fn()
    jest.spyOn(axios, 'put').mockImplementation(async (url, params) => {
      put(url, params)
      return {
        data: 123,
      }
    })

    const result = await request.sendPutRequest('abc.com', { name: '111' })
    expect(put).toBeCalledWith('abc.com', { name: '111' })
    expect(result).toBe(123)
  })

  test('could catch put error', async () => {
    jest.spyOn(axios, 'put').mockImplementation(async () => {
      throw new Error()
    })

    await expect(async () => await request.sendPutRequest('abc.com')).rejects.toThrowError()
  })

  test('could sent delete request', async () => {
    const remove = jest.fn()
    jest.spyOn(axios, 'delete').mockImplementation(async (url) => {
      remove(url)
    })

    await request.sendDeleteRequest('abc.com')
    expect(remove).toBeCalledWith('abc.com')
  })

  test('could catch delete error', async () => {
    jest.spyOn(axios, 'delete').mockImplementation(async () => {
      throw new Error()
    })

    await expect(async () => await request.sendDeleteRequest('abc.com')).rejects.toThrowError()
  })
})

describe('#handleRequestError', () => {
  test('could handle 401 error', () => {
    expect(() => request.handleRequestError({
      response: {
        status: 401,
        data: {
          message: '',
        },
      },
    })).toThrow(localeTool.t('error.401'))
  })
})
