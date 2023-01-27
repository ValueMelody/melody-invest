import * as authMiddleware from 'middlewares/auth'
import * as crudUsers from 'services/crudUsers'
import * as errorEnum from 'enums/error'
import * as interfaces from '@shared/interfaces'
import * as users from './users'
import { Request, Response, Router } from 'express'
import { instance, mock } from 'ts-mockito'

jest.mock('services/crudUsers', () => ({
  ...jest.requireActual('services/crudUsers'),
  __esModule: true,
}))

afterEach(() => {
  jest.clearAllMocks()
})

const reqType = mock<Request>({})
const resType = mock<Response>({})

const resStatus = jest.fn()
const resSend = jest.fn()
const response = instance(resType)
response.status = resStatus.mockReturnThis()
response.send = resSend

describe('#getOverall', () => {
  test('could call expected function', async () => {
    const overallType = mock<interfaces.response.UserOverall>({})
    const overall = instance(overallType)

    const getUserOverall = jest.fn()
    jest.spyOn(crudUsers, 'getUserOverall')
      .mockImplementation(async (id) => {
        getUserOverall(id)
        return overall
      })

    const request = instance(reqType)
    request.body = {}
    request.body.auth = { id: 1 }

    await users.getOverall(request, response)

    expect(getUserOverall).toBeCalledWith(1)
    expect(resStatus).toBeCalledWith(200)
    expect(resSend).toBeCalledWith(overall)
  })
})

describe('#createToken', () => {
  test('could call expected function', async () => {
    const tokenType = mock<interfaces.response.UserToken>({})
    const token = instance(tokenType)

    const createUserToken = jest.fn()
    jest.spyOn(crudUsers, 'createUserToken')
      .mockImplementation(async (email, password, remember) => {
        createUserToken(email, password, remember)
        return token
      })

    const request = instance(reqType)
    request.body = { email: 'test@email.com ', password: '12345678912345', remember: true }

    await users.createToken(request, response)

    expect(createUserToken).toBeCalledWith('test@email.com', '12345678912345', true)
    expect(resStatus).toBeCalledWith(201)
    expect(resSend).toBeCalledWith(token)
  })

  test('validate password length', async () => {
    const request = instance(reqType)
    request.body = { email: 'test@email.com ', password: '123456789', remember: true }

    await expect(async () => await users.createToken(request, response)).rejects.toBe(errorEnum.Custom.PasswordTooShort)
  })

  test('validate password has passed in', async () => {
    const request = instance(reqType)
    request.body = { email: 'test@email.com ', remember: true }

    await expect(async () => await users.createToken(request, response)).rejects.toBe(errorEnum.Custom.MissingParams)
  })

  test('validate email has passed in', async () => {
    const request = instance(reqType)
    request.body = { password: '12345678901', remember: true }

    await expect(async () => await users.createToken(request, response)).rejects.toBe(errorEnum.Custom.MissingParams)
  })

  test('validate email is not too long', async () => {
    const request = instance(reqType)
    request.body = {
      password: '12345678901',
      remember: true,
      email: '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234@email.com',
    }

    await expect(async () => await users.createToken(request, response)).rejects.toBe(errorEnum.Custom.EmailTooLong)
  })

  test('validate email format', async () => {
    const request = instance(reqType)
    request.body = { password: '12345678901', remember: true, email: 'test@com' }

    await expect(async () => await users.createToken(request, response)).rejects.toBe(errorEnum.Custom.EmailWrongFormat)
  })
})

describe('#createUser', () => {
  test('could call expected function', async () => {
    const userType = mock<interfaces.userModel.Record>({})
    const user = instance(userType)

    const createUser = jest.fn()
    jest.spyOn(crudUsers, 'createUser')
      .mockImplementation(async (email, password) => {
        createUser(email, password)
        return user
      })

    const request = instance(reqType)
    request.body = { email: 'Test@email.com ', password: '12345678912345', isConfirmed: true }

    await users.createUser(request, response)

    expect(createUser).toBeCalledWith('test@email.com', '12345678912345')
    expect(resStatus).toBeCalledWith(201)
    expect(resSend).toBeCalledWith(user)
  })

  test('could throw missing params error', async () => {
    const request = instance(reqType)
    request.body = { email: 'Test@email.com ', password: '12345678912345' }

    await expect(async () => await users.createUser(request, response)).rejects.toBe(errorEnum.Custom.MissingParams)
  })
})

describe('#createPayment', () => {
  test('could call expected function', async () => {
    const tokenType = mock<interfaces.response.UserToken>({})
    const token = instance(tokenType)

    const createPayment = jest.fn()
    jest.spyOn(crudUsers, 'createPayment')
      .mockImplementation(async (userId, orderId, planType, stateCode, provinceCode) => {
        createPayment(userId, orderId, planType, stateCode, provinceCode)
        return token
      })

    const request = instance(reqType)
    request.body = {
      orderId: '123456',
      planType: '2',
      stateCode: 'CA',
      provinceCode: 'ON',
      auth: { id: 1 },
    }

    await users.createPayment(request, response)

    expect(createPayment).toBeCalledWith(1, '123456', 2, 'CA', 'ON')
    expect(resStatus).toBeCalledWith(201)
    expect(resSend).toBeCalledWith(token)
  })

  test('could handle no province', async () => {
    const tokenType = mock<interfaces.response.UserToken>({})
    const token = instance(tokenType)

    const createPayment = jest.fn()
    jest.spyOn(crudUsers, 'createPayment')
      .mockImplementation(async (userId, orderId, planType, stateCode, provinceCode) => {
        createPayment(userId, orderId, planType, stateCode, provinceCode)
        return token
      })

    const request = instance(reqType)
    request.body = {
      orderId: '123456',
      planType: '2',
      stateCode: '',
      provinceCode: '',
      auth: { id: 1 },
    }

    await users.createPayment(request, response)

    expect(createPayment).toBeCalledWith(1, '123456', 2, null, null)
    expect(resStatus).toBeCalledWith(201)
    expect(resSend).toBeCalledWith(token)
  })

  test('could throw forbidden for wrong plan type', async () => {
    const request = instance(reqType)
    request.body = {
      orderId: '123456',
      planType: '5',
      stateCode: 'CA',
      provinceCode: 'ON',
      auth: { id: 1 },
    }

    await expect(async () => await users.createPayment(request, response)).rejects.toBe(errorEnum.Default.Forbidden)
  })

  test('could throw forbidden for non orderId', async () => {
    const request = instance(reqType)
    request.body = {
      orderId: '',
      planType: '2',
      stateCode: 'CA',
      provinceCode: 'ON',
      auth: { id: 1 },
    }

    await expect(async () => await users.createPayment(request, response)).rejects.toBe(errorEnum.Default.Forbidden)
  })
})

describe('#createReset', () => {
  test('could call expected function', async () => {
    const generateResetCode = jest.fn()
    jest.spyOn(crudUsers, 'generateResetCode')
      .mockImplementation(generateResetCode)

    const request = instance(reqType)
    request.body = { email: 'Test@email.com ' }

    await users.createReset(request, response)

    expect(generateResetCode).toBeCalledWith('test@email.com')
    expect(resStatus).toBeCalledWith(201)
    expect(resSend).toBeCalledTimes(1)
  })
})

describe('#updatePassword', () => {
  test('could call expected function', async () => {
    const updatePassword = jest.fn()
    jest.spyOn(crudUsers, 'updatePassword')
      .mockImplementation(updatePassword)

    const request = instance(reqType)
    request.body = {
      currentPassword: '12345678912345',
      newPassword: '123456789123456',
      auth: { id: 1 },
    }

    await users.updatePassword(request, response)

    expect(updatePassword).toBeCalledWith(1, '12345678912345', '123456789123456')
    expect(resStatus).toBeCalledWith(204)
    expect(resSend).toBeCalledTimes(1)
  })
})

describe('#lockUser', () => {
  test('could call expected function', async () => {
    const lockAccess = jest.fn()
    jest.spyOn(crudUsers, 'lockAccess')
      .mockImplementation(lockAccess)

    const request = instance(reqType)
    request.body = {
      auth: { id: 1 },
    }

    await users.lockUser(request, response)

    expect(lockAccess).toBeCalledWith(1)
    expect(resStatus).toBeCalledWith(204)
    expect(resSend).toBeCalledTimes(1)
  })
})

describe('#activateUser', () => {
  test('could call expected function', async () => {
    const activateUser = jest.fn()
    jest.spyOn(crudUsers, 'activateUser')
      .mockImplementation(activateUser)

    const token = new Array(64).fill('1').join('')
    const request = instance(reqType)
    request.body = {
      token,
    }

    await users.activateUser(request, response)

    expect(activateUser).toBeCalledWith(token)
    expect(resStatus).toBeCalledWith(204)
    expect(resSend).toBeCalledTimes(1)
  })

  test('validate access code', async () => {
    const token = new Array(63).fill('1').join('')
    const request = instance(reqType)
    request.body = {
      token,
    }

    await expect(async () => await users.activateUser(request, response)).rejects.toBe(errorEnum.Custom.WrongAccessCode)
  })
})

describe('#resetPassword', () => {
  test('could call expected function', async () => {
    const resetPassword = jest.fn()
    jest.spyOn(crudUsers, 'resetPassword')
      .mockImplementation(resetPassword)

    const request = instance(reqType)
    const resetCode = new Array(64).fill('1').join('')
    request.body = {
      email: 'Test@email.com ',
      password: '12345678912345',
      resetCode,
    }

    await users.resetPassword(request, response)

    expect(resetPassword).toBeCalledWith('test@email.com', '12345678912345', resetCode)
    expect(resStatus).toBeCalledWith(204)
    expect(resSend).toBeCalledTimes(1)
  })
})

describe('#refreshToken', () => {
  test('could call expected function', async () => {
    const refreshToken = jest.fn()
    const tokenType = mock<interfaces.response.AccessToken>({})
    jest.spyOn(crudUsers, 'refreshAccessToken')
      .mockImplementation(async (id, email, type) => {
        refreshToken(id, email, type)
        return instance(tokenType)
      })

    const request = instance(reqType)
    request.body = {
      auth: { id: 1, email: 'test@email.com', type: 2 },
    }

    await users.refreshToken(request, response)

    expect(refreshToken).toBeCalledWith(1, 'test@email.com', 2)
    expect(resStatus).toBeCalledWith(200)
    expect(resSend).toBeCalledWith(instance(tokenType))
  })
})

describe('#attachRoutes', () => {
  test('could attach', () => {
    const routerType = mock<Router>({})
    const router = instance(routerType)
    const routerGet = jest.fn()
    const routerPost = jest.fn()
    const routerPut = jest.fn()
    router.get = routerGet
    router.post = routerPost
    router.put = routerPut
    users.attachRoutes(router)
    expect(routerGet).toHaveBeenCalledWith('/overall', authMiddleware.normalUser, users.getOverall)
    expect(routerPost).toHaveBeenCalledWith('/token', users.createToken)
    expect(routerPost).toHaveBeenCalledWith('/', users.createUser)
    expect(routerPost).toHaveBeenCalledWith('/payment', authMiddleware.normalUser, users.createPayment)
    expect(routerPost).toHaveBeenCalledWith('/reset', users.createReset)
    expect(routerPut).toHaveBeenCalledWith('/password', authMiddleware.normalUser, users.updatePassword)
    expect(routerPut).toHaveBeenCalledWith('/lock', authMiddleware.normalUser, users.lockUser)
    expect(routerPut).toHaveBeenCalledWith('/activate', users.activateUser)
    expect(routerPut).toHaveBeenCalledWith('/reset', users.resetPassword)
    expect(routerPut).toHaveBeenCalledWith('/token', authMiddleware.authByRefreshToken, users.refreshToken)
  })
})
