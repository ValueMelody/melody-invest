import * as authMiddleware from 'middlewares/auth'
import * as crudTraders from 'services/crudTraders'
import * as interfaces from '@shared/interfaces'
import * as traders from './traders'
import { Request, Response, Router } from 'express'
import { instance, mock } from 'ts-mockito'

jest.mock('services/crudTraders', () => ({
  ...jest.requireActual('services/crudTraders'),
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

describe('#getTraderProfile', () => {
  test('could call expected function', async () => {
    const profileType = mock<interfaces.response.TraderProfile>({})
    const profile = instance(profileType)

    const getTraderProfile = jest.fn()
    jest.spyOn(crudTraders, 'getTraderProfile')
      .mockImplementation(async (id, accessCode) => {
        getTraderProfile(id, accessCode)
        return profile
      })

    const request = instance(reqType)
    const accessCode = new Array(16).fill('1').join('')
    request.params = { id: '1', access_code: accessCode }

    await traders.getTraderProfile(request, response)

    expect(getTraderProfile).toBeCalledWith(1, accessCode)
    expect(resStatus).toBeCalledWith(200)
    expect(resSend).toBeCalledWith(profile)
  })
})

describe('#getProfileDetail', () => {
  test('could call expected function', async () => {
    const profileType = mock<interfaces.response.ProfileDetail>({})
    const profile = instance(profileType)

    const getProfileDetail = jest.fn()
    jest.spyOn(crudTraders, 'getProfileDetail')
      .mockImplementation(async (id, accessCode, userEnvIds) => {
        getProfileDetail(id, accessCode, userEnvIds)
        return profile
      })

    const getUserTraderEnvIds = jest.fn()
    jest.spyOn(crudTraders, 'getUserTraderEnvIds')
      .mockImplementation(async (userId) => {
        getUserTraderEnvIds(userId)
        return [1, 2, 3]
      })

    const request = instance(reqType)
    const accessCode = new Array(16).fill('1').join('')
    request.params = { id: '1', access_code: accessCode }
    request.body = { auth: { id: 2 } }

    await traders.getProfileDetail(request, response)

    expect(getUserTraderEnvIds).toBeCalledWith(2)
    expect(getProfileDetail).toBeCalledWith(1, accessCode, [1, 2, 3])
    expect(resStatus).toBeCalledWith(200)
    expect(resSend).toBeCalledWith(profile)
  })
})

describe('#getComboDetail', () => {
  test('could call expected function', async () => {
    const comboType = mock<interfaces.response.ComboDetail>({})
    const combo = instance(comboType)

    const getComboDetail = jest.fn()
    jest.spyOn(crudTraders, 'getComboDetail')
      .mockImplementation(async (id) => {
        getComboDetail(id)
        return combo
      })

    const request = instance(reqType)
    request.params = { combo_id: '12' }

    await traders.getComboDetail(request, response)

    expect(getComboDetail).toBeCalledWith(12)
    expect(resStatus).toBeCalledWith(200)
    expect(resSend).toBeCalledWith(combo)
  })
})

describe('#getEnvDetail', () => {
  test('could call expected function', async () => {
    const envType = mock<interfaces.response.EnvDetail>({})
    const env = instance(envType)

    const getEnvDetail = jest.fn()
    jest.spyOn(crudTraders, 'getEnvDetail')
      .mockImplementation(async (id) => {
        getEnvDetail(id)
        return env
      })

    const request = instance(reqType)
    request.params = { env_id: '12' }

    await traders.getEnvDetail(request, response)

    expect(getEnvDetail).toBeCalledWith(12)
    expect(resStatus).toBeCalledWith(200)
    expect(resSend).toBeCalledWith(env)
  })
})

describe('#getBehaviorDetail', () => {
  test('could call expected function', async () => {
    const behaviorType = mock<interfaces.response.BehaviorDetail>({})
    const behaviorData = instance(behaviorType)

    const getBehaviorDetail = jest.fn()
    jest.spyOn(crudTraders, 'getBehaviorDetail')
      .mockImplementation(async (id, behavior) => {
        getBehaviorDetail(id, behavior)
        return behaviorData
      })

    const request = instance(reqType)
    request.params = { env_id: '12', behavior: 'priceMonthlyIncreaseBuy' }

    await traders.getBehaviorDetail(request, response)

    expect(getBehaviorDetail).toBeCalledWith(12, 'priceMonthlyIncreaseBuy')
    expect(resStatus).toBeCalledWith(200)
    expect(resSend).toBeCalledWith(behaviorData)
  })
})
