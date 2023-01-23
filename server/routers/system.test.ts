import { mock, instance } from 'ts-mockito'
import attachRoutes from './system'
import { Router } from 'express'
import * as crudSystems from 'services/crudSystems'

jest.mock('services/crudSystems', () => {
  const actual = jest.requireActual('services/crudSystems')
  return {
    __esModule: true,
    ...actual,
  }
})

interface Handler {
  [url: string]: Function;
}
const handlers: Handler = {}

const routerType = mock<Router>({})
const router = {
  ...instance(routerType),
  get: (url: string, handler: Function) => {
    handlers[url] = handler
  },
}

const resType = mock<Response>({})

// @ts-ignore
attachRoutes(router)

describe('/defaults', () => {
  test('could trigger function', () => {
    const getDefaults = jest.fn()
    jest.spyOn(crudSystems, 'getDefaults')
      .mockImplementation(getDefaults)

    const setSend = jest.fn()
    const setStatus = jest.fn()

    const res = {
      ...instance(resType),
      status: (code: number) => {
        setStatus(code)
        return { send: setSend }
      },
    }
    handlers['/defaults'](undefined, res)

    expect(getDefaults).toBeCalledTimes(1)
    expect(setStatus).toBeCalledWith(200)
  })
})
