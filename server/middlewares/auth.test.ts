import * as generateTool from 'tools/generate'
import { Request, Response } from 'express'
import { instance, mock, when } from 'ts-mockito'
import * as auth from './auth'

const resMock: Response = mock({})
const res = instance(resMock)

describe('#guestOrUser', () => {
  test('could get guest', () => {
    const next = jest.fn()

    const requestMock: Request = mock({})
    when(requestMock.headers).thenReturn({})
    when(requestMock.body).thenReturn({})
    const req = instance(requestMock)

    auth.guestOrUser(req, res, next)
    expect(req.body.auth).toBe(null)
    expect(next).toBeCalledTimes(1)
  })

  test('could get user', () => {
    const detail = { id: 1, entityId: 1, email: 'test@email.com', type: 1 }
    const encode = generateTool.encodeJWT(detail, '12h')
    const next = jest.fn()

    const requestMock: Request = mock({})
    when(requestMock.headers).thenReturn({ authorization: `Bearer ${encode}` })
    when(requestMock.body).thenReturn({})
    const req = instance(requestMock)

    auth.guestOrUser(req, res, next)
    expect(req.body.auth).toStrictEqual(detail)
    expect(next).toBeCalledTimes(1)
  })

  test('could throw error for wrong auth', () => {
    const next = jest.fn()

    const requestMock: Request = mock({})
    when(requestMock.headers).thenReturn({ authorization: 'Bearer 12345' })
    when(requestMock.body).thenReturn({})
    const req = instance(requestMock)

    expect(() => auth.guestOrUser(req, res, next)).toThrowError()
    expect(next).toBeCalledTimes(0)
  })
})

describe('#normalUser', () => {
  test('could get user', () => {
    const detail = { id: 1, entityId: 1, email: 'test@email.com', type: 1 }
    const encode = generateTool.encodeJWT(detail, '12h')
    const next = jest.fn()

    const requestMock: Request = mock({})
    when(requestMock.headers).thenReturn({ authorization: `Bearer ${encode}` })
    when(requestMock.body).thenReturn({})
    const req = instance(requestMock)

    auth.normalUser(req, res, next)
    expect(req.body.auth).toStrictEqual(detail)
    expect(next).toBeCalledTimes(1)
  })

  test('throw error for guest', () => {
    const next = jest.fn()

    const requestMock: Request = mock({})
    when(requestMock.headers).thenReturn({})
    when(requestMock.body).thenReturn({})
    const req = instance(requestMock)

    expect(() => auth.normalUser(req, res, next)).toThrowError()
    expect(next).toBeCalledTimes(0)
  })

  test('could throw error', () => {
    const next = jest.fn()

    const requestMock: Request = mock({})
    when(requestMock.headers).thenReturn({ authorization: 'Bearer 12345' })
    when(requestMock.body).thenReturn({})
    const req = instance(requestMock)

    expect(() => auth.normalUser(req, res, next)).toThrowError()
    expect(next).toBeCalledTimes(0)
  })
})

describe('#authByRefreshToken', () => {
  test('could auth by refresh token', async () => {
    const detail = { id: 1, entityId: 1, email: 'test@email.com', type: 1 }
    const encode = generateTool.encodeJWT(detail, '12h', true)
    const next = jest.fn()

    const requestMock: Request = mock({})
    when(requestMock.headers).thenReturn({ authorization: `Bearer ${encode}` })
    when(requestMock.body).thenReturn({})
    const req = instance(requestMock)

    auth.authByRefreshToken(req, res, next)
    expect(req.body.auth).toStrictEqual(detail)
    expect(next).toBeCalledTimes(1)
  })
})
