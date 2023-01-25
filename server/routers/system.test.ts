import * as constants from '@shared/constants'
import * as crudSystems from 'services/crudSystems'
import * as errorEnum from 'enums/error'
import * as interfaces from '@shared/interfaces'
import * as system from './system'
import { Request, Response, Router } from 'express'
import { instance, mock } from 'ts-mockito'

jest.mock('services/crudSystems', () => ({
  ...jest.requireActual('services/crudSystems'),
  __esModule: true,
}))

const reqType = mock<Request>({})
const resType = mock<Response>({})

const resStatus = jest.fn()
const resSend = jest.fn()
const response = instance(resType)
response.status = resStatus.mockReturnThis()
response.send = resSend

describe('#getPolicy', () => {
  const policyType = mock<interfaces.policyModel.Record>({})
  const policy = { ...instance(policyType), id: 1 }
  jest.spyOn(crudSystems, 'getSystemPolicy')
    .mockImplementation(async (type) => {
      getSystemPolicy(type)
      return policy
    })

  const getSystemPolicy = jest.fn()

  const request = instance(reqType)

  test('could get privacy policy', async () => {
    request.params = {}
    request.params.type = constants.Content.PolicyType.Privacy.toString()

    await system.getPolicy(request, response)

    expect(getSystemPolicy).toBeCalledWith(constants.Content.PolicyType.Privacy)
    expect(resStatus).toBeCalledWith(200)
    expect(resSend).toBeCalledWith(policy)
  })

  test('could get terms policy', async () => {
    request.params = {}
    request.params.type = constants.Content.PolicyType.TermsAndConditions.toString()

    await system.getPolicy(request, response)

    expect(getSystemPolicy).toBeCalledWith(constants.Content.PolicyType.TermsAndConditions)
    expect(resStatus).toBeCalledWith(200)
    expect(resSend).toBeCalledWith(policy)
  })

  test('could throw not found', async () => {
    request.params = {}
    request.params.type = '5'

    await expect(async () => await system.getPolicy(request, response)).rejects.toBe(errorEnum.Default.NotFound)
  })
})

describe('#getTopTraders', () => {
  test('could call expected function', async () => {
    const topType = mock<interfaces.response.TopTraderProfiles>({})
    const tops = instance(topType)

    const getTopTraderProfiles = jest.fn()
    jest.spyOn(crudSystems, 'getTopTraderProfiles')
      .mockImplementation(async () => {
        getTopTraderProfiles()
        return tops
      })

    await system.getTopTraders(instance(reqType), response)

    expect(getTopTraderProfiles).toBeCalledTimes(1)
    expect(resStatus).toBeCalledWith(200)
    expect(resSend).toBeCalledWith(tops)
  })
})

describe('#getDefaultCombos', () => {
  test('could call expected function', async () => {
    const comboType = mock<interfaces.response.ComboProfile>({})
    const combos = [instance(comboType)]

    const getDefaultTraderCombos = jest.fn()
    jest.spyOn(crudSystems, 'getDefaultTraderCombos')
      .mockImplementation(async () => {
        getDefaultTraderCombos()
        return combos
      })

    await system.getDefaultCombos(instance(reqType), response)

    expect(getDefaultTraderCombos).toBeCalledTimes(1)
    expect(resStatus).toBeCalledWith(200)
    expect(resSend).toBeCalledWith(combos)
  })
})

describe('#getDefaults', () => {
  test('could call expected function', async () => {
    const defaultType = mock<interfaces.response.SystemDefaults>({})
    const defaultData = instance(defaultType)

    const getDefaults = jest.fn()
    jest.spyOn(crudSystems, 'getDefaults')
      .mockImplementation(async () => {
        getDefaults()
        return defaultData
      })

    await system.getDefaults(instance(reqType), response)

    expect(getDefaults).toBeCalledTimes(1)
    expect(resStatus).toBeCalledWith(200)
    expect(resSend).toBeCalledWith(defaultData)
  })
})

describe('#attachRoutes', () => {
  test('could attach', () => {
    const routerType = mock<Router>({})
    const router = instance(routerType)
    const routerGet = jest.fn()
    router.get = routerGet
    system.attachRoutes(router)
    expect(routerGet).toHaveBeenCalledWith('/policy/:type', system.getPolicy)
    expect(routerGet).toHaveBeenCalledWith('/top-trader-profiles', system.getTopTraders)
    expect(routerGet).toHaveBeenCalledWith('/default-trader-combos', system.getDefaultCombos)
    expect(routerGet).toHaveBeenCalledWith('/defaults', system.getDefaults)
  })
})
