import * as auth from './auth'
import * as generateTool from 'tools/generate'

describe('#guestOrUser', () => {
  test('could get guest', () => {
    const next = jest.fn()
    const req = { headers: {}, body: {} }
    // @ts-ignore
    auth.guestOrUser(req, null, next)
    // @ts-ignore
    expect(req.body.auth).toBe(null)
    expect(next).toBeCalledTimes(1)
  })

  test('could get user', () => {
    const detail = { id: 1, email: 'test@email.com', type: 1 }
    const encode = generateTool.encodeJWT(detail, '12h')
    const next = jest.fn()
    const req = { headers: { authorization: `Bearer ${encode}` }, body: {} }
    // @ts-ignore
    auth.guestOrUser(req, null, next)
    // @ts-ignore
    expect(req.body.auth).toStrictEqual(detail)
    expect(next).toBeCalledTimes(1)
  })

  test('could throw error for wrong auth', () => {
    const next = jest.fn()
    const req = { headers: { authorization: 'Bearer 12345' }, body: {} }
    // @ts-ignore
    expect(() => auth.guestOrUser(req, null, next)).toThrowError()
    expect(next).toBeCalledTimes(0)
  })
})

describe('#normalUser', () => {
  test('could get user', () => {
    const detail = { id: 1, email: 'test@email.com', type: 1 }
    const encode = generateTool.encodeJWT(detail, '12h')
    const next = jest.fn()
    const req = { headers: { authorization: `Bearer ${encode}` }, body: {} }
    // @ts-ignore
    auth.normalUser(req, null, next)
    // @ts-ignore
    expect(req.body.auth).toStrictEqual(detail)
    expect(next).toBeCalledTimes(1)
  })

  test('throw error for guest', () => {
    const next = jest.fn()
    const req = { headers: {}, body: {} }
    // @ts-ignore
    expect(() => auth.normalUser(req, null, next)).toThrowError()
    expect(next).toBeCalledTimes(0)
  })

  test('could throw error', () => {
    const next = jest.fn()
    const req = { headers: { authorization: 'Bearer 12345' }, body: {} }
    // @ts-ignore
    expect(() => auth.normalUser(req, null, next)).toThrowError()
    expect(next).toBeCalledTimes(0)
  })
})
