import * as accessMiddleware from 'middlewares/access'
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

describe('#getTickerDetail', () => {
  test('could call expected function', async () => {
    const tickerType = mock<interfaces.response.TickerDetail>({})
    const tickerData = instance(tickerType)

    const getTickerDetail = jest.fn()
    jest.spyOn(crudTraders, 'getTickerDetail')
      .mockImplementation(async (id, behavior) => {
        getTickerDetail(id, behavior)
        return tickerData
      })

    const request = instance(reqType)
    request.params = { env_id: '12', ticker_id: '15' }

    await traders.getTickerDetail(request, response)

    expect(getTickerDetail).toBeCalledWith(12, 15)
    expect(resStatus).toBeCalledWith(200)
    expect(resSend).toBeCalledWith(tickerData)
  })
})

describe('#createTrader', () => {
  test('could call expected function', async () => {
    const traderType = mock<interfaces.response.TraderProfile>({})
    const trader = instance(traderType)

    const patternType = mock<interfaces.traderPatternModel.Create>({})
    const pattern = instance(patternType)

    const createTraderProfile = jest.fn()
    jest.spyOn(crudTraders, 'createTraderProfile')
      .mockImplementation(async (id, envId, pattern) => {
        createTraderProfile(id, envId, pattern)
        return trader
      })

    const request = instance(reqType)
    request.body = {
      auth: { id: 1 },
      traderEnvId: 11,
      traderPattern: pattern,
    }

    await traders.createTrader(request, response)

    expect(createTraderProfile).toBeCalledWith(1, 11, pattern)
    expect(resStatus).toBeCalledWith(201)
    expect(resSend).toBeCalledWith(trader)
  })
})

describe('#createTraderFollower', () => {
  test('could call expected function', async () => {
    const createFollowedTrader = jest.fn()
    jest.spyOn(crudTraders, 'createFollowedTrader')
      .mockImplementation(createFollowedTrader)

    const request = instance(reqType)
    request.params = { trader_id: '2' }
    request.body = {
      auth: { id: 1 },
    }

    await traders.createTraderFollower(request, response)

    expect(createFollowedTrader).toBeCalledWith(1, 2)
    expect(resStatus).toBeCalledWith(201)
    expect(resSend).toBeCalledTimes(1)
  })
})

describe('#createEnv', () => {
  test('could call expected function', async () => {
    const envType = mock<interfaces.traderEnvModel.Record>({})
    const env = instance(envType)

    const createTraderEnv = jest.fn()
    jest.spyOn(crudTraders, 'createTraderEnv')
      .mockImplementation(async (id, name, startDate, tickerIds) => {
        createTraderEnv(id, name, startDate, tickerIds)
        return env
      })

    const request = instance(reqType)
    request.body = {
      auth: { id: 1 },
      name: 'test ',
      startDate: '2020-01-01',
      tickerIds: [1, 2, 3],
    }

    await traders.createEnv(request, response)

    expect(createTraderEnv).toBeCalledWith(1, 'test', '2020-01-01', [1, 2, 3])
    expect(resStatus).toBeCalledWith(201)
    expect(resSend).toBeCalledWith(env)
  })
})

describe('#createCombo', () => {
  test('could call expected function', async () => {
    const comboType = mock<interfaces.traderComboModel.Identity>({})
    const combo = instance(comboType)

    const createTraderCombo = jest.fn()
    jest.spyOn(crudTraders, 'createTraderCombo')
      .mockImplementation(async (id, name, traderIds) => {
        createTraderCombo(id, name, traderIds)
        return combo
      })

    const request = instance(reqType)
    request.body = {
      auth: { id: 1 },
      name: 'test ',
      traderIds: [1, 2, 3],
    }

    await traders.createCombo(request, response)

    expect(createTraderCombo).toBeCalledWith(1, 'test', [1, 2, 3])
    expect(resStatus).toBeCalledWith(201)
    expect(resSend).toBeCalledWith(combo)
  })
})

describe('#removeFollowedTrader', () => {
  test('could call expected function', async () => {
    const deleteFollowedProfile = jest.fn()
    jest.spyOn(crudTraders, 'deleteFollowedProfile')
      .mockImplementation(deleteFollowedProfile)

    const request = instance(reqType)
    request.params = { trader_id: '3' }
    request.body = {
      auth: { id: 1 },
    }

    await traders.removeFollowedTrader(request, response)

    expect(deleteFollowedProfile).toBeCalledWith(1, 3)
    expect(resStatus).toBeCalledWith(204)
    expect(resSend).toBeCalledTimes(1)
  })
})

describe('#removeFollowedEnv', () => {
  test('could call expected function', async () => {
    const deleteFollowedEnv = jest.fn()
    jest.spyOn(crudTraders, 'deleteFollowedEnv')
      .mockImplementation(deleteFollowedEnv)

    const request = instance(reqType)
    request.params = { env_id: '3' }
    request.body = {
      auth: { id: 1 },
    }

    await traders.removeFollowedEnv(request, response)

    expect(deleteFollowedEnv).toBeCalledWith(1, 3)
    expect(resStatus).toBeCalledWith(204)
    expect(resSend).toBeCalledTimes(1)
  })
})

describe('#removeFollowedCombo', () => {
  test('could call expected function', async () => {
    const deleteFollowedCombo = jest.fn()
    jest.spyOn(crudTraders, 'deleteFollowedCombo')
      .mockImplementation(deleteFollowedCombo)

    const request = instance(reqType)
    request.params = { combo_id: '3' }
    request.body = {
      auth: { id: 1 },
    }

    await traders.removeFollowedCombo(request, response)

    expect(deleteFollowedCombo).toBeCalledWith(1, 3)
    expect(resStatus).toBeCalledWith(204)
    expect(resSend).toBeCalledTimes(1)
  })
})

describe('#attachRoutes', () => {
  test('could attach', () => {
    const routerType = mock<Router>({})
    const router = instance(routerType)
    const routerGet = jest.fn()
    router.get = routerGet
    const routerPost = jest.fn()
    router.post = routerPost
    const routerDelete = jest.fn()
    router.delete = routerDelete

    traders.attachRoutes(router)
    expect(routerGet).toHaveBeenCalledWith('/profiles/:id/:access_code', traders.getTraderProfile)
    expect(routerGet).toHaveBeenCalledWith(
      '/profiles/:id/:access_code/detail', authMiddleware.guestOrUser, traders.getProfileDetail,
    )
    expect(routerGet).toHaveBeenCalledWith('/combos/:combo_id', authMiddleware.normalUser, traders.getComboDetail)
    expect(routerGet).toHaveBeenCalledWith(
      '/envs/:env_id', authMiddleware.normalUser, accessMiddleware.couldAccessEnv, traders.getEnvDetail,
    )
    expect(routerGet).toHaveBeenCalledWith(
      '/envs/:env_id/behaviors/:behavior',
      authMiddleware.guestOrUser,
      accessMiddleware.couldAccessEnv,
      traders.getBehaviorDetail,
    )
    expect(routerGet).toHaveBeenCalledWith(
      '/envs/:env_id/tickers/:ticker_id',
      authMiddleware.guestOrUser,
      accessMiddleware.couldAccessEnv,
      traders.getTickerDetail,
    )
    expect(routerPost).toHaveBeenCalledWith(
      '/profiles',
      authMiddleware.normalUser,
      accessMiddleware.couldCreateProfile,
      traders.createTrader,
    )
    expect(routerPost).toHaveBeenCalledWith(
      '/profiles/:trader_id',
      authMiddleware.normalUser,
      accessMiddleware.couldCreateProfile,
      traders.createTraderFollower,
    )
    expect(routerPost).toHaveBeenCalledWith(
      '/envs',
      authMiddleware.normalUser,
      accessMiddleware.couldCreateEnv,
      traders.createEnv,
    )
    expect(routerPost).toHaveBeenCalledWith(
      '/combos',
      authMiddleware.normalUser,
      accessMiddleware.couldCreateCombo,
      accessMiddleware.couldAccessProfiles,
      traders.createCombo,
    )
    expect(routerDelete).toHaveBeenCalledWith(
      '/profiles/:trader_id',
      authMiddleware.normalUser,
      traders.removeFollowedTrader,
    )
    expect(routerDelete).toHaveBeenCalledWith(
      '/envs/:env_id',
      authMiddleware.normalUser,
      traders.removeFollowedEnv,
    )
    expect(routerDelete).toHaveBeenCalledWith(
      '/combos/:combo_id',
      authMiddleware.normalUser,
      traders.removeFollowedCombo,
    )
  })
})
