import * as access from './access'
import * as constants from '@shared/constants'
import * as errorEnum from 'enums/error'
import * as interfaces from '@shared/interfaces'
import * as traderComboFollowerModel from 'models/traderComboFollower'
import * as traderEnvFollowerModel from 'models/traderEnvFollower'
import * as traderEnvModel from 'models/traderEnv'
import * as traderFollowerModel from 'models/traderFollower'
import { Request, Response } from 'express'
import { instance, mock, when } from 'ts-mockito'

const getUserFollowedEnvMock = async (userId: number) => {
  let placeholders: interfaces.traderEnvFollowerModel.Record[] = []

  if (userId === 3) placeholders = Array(constants.User.PlanLimit.Pro.Envs - 1).fill(null)
  if (userId === 4) placeholders = Array(constants.User.PlanLimit.Pro.Envs).fill(null)
  if (userId === 5) placeholders = Array(constants.User.PlanLimit.Premium.Envs - 1).fill(null)
  if (userId === 6) placeholders = Array(constants.User.PlanLimit.Premium.Envs).fill(null)

  return placeholders.map((placeholder, index) => ({
    userId,
    traderEnvId: index + 1,
    name: 'name',
  }))
}

const getUserFollowedComboMock = async (userId: number) => {
  let placeholders: interfaces.traderComboFollowerModel.Record[] = []

  if (userId === 3) placeholders = Array(constants.User.PlanLimit.Pro.Combos - 1).fill(null)
  if (userId === 4) placeholders = Array(constants.User.PlanLimit.Pro.Combos).fill(null)
  if (userId === 5) placeholders = Array(constants.User.PlanLimit.Premium.Combos - 1).fill(null)
  if (userId === 6) placeholders = Array(constants.User.PlanLimit.Premium.Combos).fill(null)

  return placeholders.map((placeholder, index) => ({
    userId,
    traderComboId: index + 1,
    name: 'name',
  }))
}

const getUserFollowedProfileMock = async (userId: number) => {
  let placeholders: interfaces.traderFollowerModel.Record[] = []

  if (userId === 1) placeholders = Array(constants.User.PlanLimit.Basic.Profiles - 1).fill(null)
  if (userId === 2) placeholders = Array(constants.User.PlanLimit.Basic.Profiles).fill(null)
  if (userId === 3) placeholders = Array(constants.User.PlanLimit.Pro.Profiles - 1).fill(null)
  if (userId === 4) placeholders = Array(constants.User.PlanLimit.Pro.Profiles).fill(null)
  if (userId === 5) placeholders = Array(constants.User.PlanLimit.Premium.Profiles - 1).fill(null)
  if (userId === 6) placeholders = Array(constants.User.PlanLimit.Premium.Profiles).fill(null)

  return placeholders.map((placeholder, index) => ({
    userId,
    traderId: index + 1,
  }))
}

const getEnvMock = async (id: number) => {
  if (!id || id >= 999) return null

  const recordMock : interfaces.traderEnvModel.Record = mock({})
  when(recordMock.id).thenReturn(id)
  const record = instance(recordMock)

  record.isSystem = id === 1
  return record
}

jest
  .spyOn(traderEnvModel, 'getByPK')
  .mockImplementation(getEnvMock)

jest
  .spyOn(traderEnvFollowerModel, 'getUserFollowed')
  .mockImplementation(getUserFollowedEnvMock)

jest
  .spyOn(traderComboFollowerModel, 'getUserFollowed')
  .mockImplementation(getUserFollowedComboMock)

jest
  .spyOn(traderFollowerModel, 'getUserFollowed')
  .mockImplementation(getUserFollowedProfileMock)

const resMock: Response = mock({})
const res = instance(resMock)

describe('#couldCreateEnv', () => {
  test('guest user can not create env', async () => {
    const next = jest.fn()

    const reqMock: Request = mock({})
    when(reqMock.body).thenReturn({ auth: {} })
    const req = instance(reqMock)

    await expect(() => access.couldCreateEnv(req, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('basic user can not create env', async () => {
    const next = jest.fn()

    const reqMock: Request = mock({})
    when(reqMock.body).thenReturn({
      auth: {
        id: 1,
        type: constants.User.Type.Basic,
      },
    })
    const req = instance(reqMock)

    await expect(() => access.couldCreateEnv(req, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('can verify pro user create env access', async () => {
    const next = jest.fn()

    const reqMock1: Request = mock({})
    when(reqMock1.body).thenReturn({
      auth: {
        id: 3,
        type: constants.User.Type.Pro,
      },
    })
    const req1 = instance(reqMock1)

    await access.couldCreateEnv(req1, res, next)
    expect(next).toBeCalledTimes(1)

    const reqMock2: Request = mock({})
    when(reqMock2.body).thenReturn({
      auth: {
        id: 4,
        type: constants.User.Type.Pro,
      },
    })
    const req2 = instance(reqMock2)

    await expect(() => access.couldCreateEnv(req2, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('can verify premium user create env access', async () => {
    const next = jest.fn()

    const reqMock1: Request = mock({})
    when(reqMock1.body).thenReturn({
      auth: {
        id: 5,
        type: constants.User.Type.Premium,
      },
    })
    const req1 = instance(reqMock1)

    await access.couldCreateEnv(req1, res, next)
    expect(next).toBeCalledTimes(1)

    const reqMock2: Request = mock({})
    when(reqMock2.body).thenReturn({
      auth: {
        id: 6,
        type: constants.User.Type.Premium,
      },
    })
    const req2 = instance(reqMock2)

    await expect(() => access.couldCreateEnv(req2, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })
})

describe('#couldCreateCombo', () => {
  test('guest user can not create combo', async () => {
    const next = jest.fn()

    const reqMock: Request = mock({})
    when(reqMock.body).thenReturn({
      auth: {},
    })
    const req = instance(reqMock)

    await expect(() => access.couldCreateCombo(req, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('basic user can not create env', async () => {
    const next = jest.fn()

    const reqMock: Request = mock({})
    when(reqMock.body).thenReturn({
      auth: {
        id: 1,
        type: constants.User.Type.Basic,
      },
    })
    const req = instance(reqMock)

    await expect(() => access.couldCreateCombo(req, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('can verify pro user create combo access', async () => {
    const next = jest.fn()

    const reqMock1: Request = mock({})
    when(reqMock1.body).thenReturn({
      auth: {
        id: 3,
        type: constants.User.Type.Pro,
      },
    })
    const req1 = instance(reqMock1)

    await access.couldCreateCombo(req1, res, next)
    expect(next).toBeCalledTimes(1)

    const reqMock2: Request = mock({})
    when(reqMock2.body).thenReturn({
      auth: {
        id: 4,
        type: constants.User.Type.Pro,
      },
    })
    const req2 = instance(reqMock2)

    await expect(() => access.couldCreateCombo(req2, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('can verify premium user create env access', async () => {
    const next = jest.fn()

    const reqMock1: Request = mock({})
    when(reqMock1.body).thenReturn({
      auth: {
        id: 5,
        type: constants.User.Type.Premium,
      },
    })
    const req1 = instance(reqMock1)

    await access.couldCreateCombo(req1, res, next)
    expect(next).toBeCalledTimes(1)

    const reqMock2: Request = mock({})
    when(reqMock2.body).thenReturn({
      auth: {
        id: 6,
        type: constants.User.Type.Premium,
      },
    })
    const req2 = instance(reqMock2)

    await expect(() => access.couldCreateCombo(req2, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })
})

describe('#couldCreateProfile', () => {
  test('guest user can not create profile', async () => {
    const next = jest.fn()

    const reqMock: Request = mock({})
    when(reqMock.body).thenReturn({
      auth: {},
    })
    const req = instance(reqMock)

    await expect(() => access.couldCreateProfile(req, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('can verify basic user create profile access', async () => {
    const next = jest.fn()

    const reqMock1: Request = mock({})
    when(reqMock1.body).thenReturn({
      auth: {
        id: 1,
        type: constants.User.Type.Basic,
      },
    })
    const req1 = instance(reqMock1)

    await access.couldCreateProfile(req1, res, next)
    expect(next).toBeCalledTimes(1)

    const reqMock2: Request = mock({})
    when(reqMock2.body).thenReturn({
      auth: {
        id: 2,
        type: constants.User.Type.Basic,
      },
    })
    const req2 = instance(reqMock2)

    await expect(() => access.couldCreateProfile(req2, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('can verify pro user create profile access', async () => {
    const next = jest.fn()

    const reqMock1: Request = mock({})
    when(reqMock1.body).thenReturn({
      auth: {
        id: 3,
        type: constants.User.Type.Pro,
      },
    })
    const req1 = instance(reqMock1)

    await access.couldCreateProfile(req1, res, next)
    expect(next).toBeCalledTimes(1)

    const reqMock2: Request = mock({})
    when(reqMock2.body).thenReturn({
      auth: {
        id: 4,
        type: constants.User.Type.Pro,
      },
    })
    const req2 = instance(reqMock2)

    await expect(() => access.couldCreateProfile(req2, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('can verify premium user create profile access', async () => {
    const next = jest.fn()

    const reqMock1: Request = mock({})
    when(reqMock1.body).thenReturn({
      auth: {
        id: 5,
        type: constants.User.Type.Premium,
      },
    })
    const req1 = instance(reqMock1)

    await access.couldCreateProfile(req1, res, next)
    expect(next).toBeCalledTimes(1)

    const reqMock2: Request = mock({})
    when(reqMock2.body).thenReturn({
      auth: {
        id: 6,
        type: constants.User.Type.Premium,
      },
    })
    const req2 = instance(reqMock2)

    await expect(() => access.couldCreateProfile(req2, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })
})

describe('#couldAccessEnv', () => {
  test('could verify props', async () => {
    const next = jest.fn()

    const reqMock: Request = mock({})
    when(reqMock.body).thenReturn({
      auth: {},
    })
    const req = instance(reqMock)

    await expect(() => access.couldAccessEnv(req, res, next))
      .rejects
      .toStrictEqual(errorEnum.Dev.WrongMiddleware)
  })

  test('could verify env', async () => {
    const next = jest.fn()

    const reqMock: Request = mock({})
    when(reqMock.body).thenReturn({
      auth: {},
    })
    when(reqMock.params).thenReturn({ env_id: '999' })
    const req = instance(reqMock)

    await expect(() => access.couldAccessEnv(req, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })

  test('could verify guest user env access', async () => {
    const next = jest.fn()

    const reqMock1: Request = mock({})
    when(reqMock1.body).thenReturn({
      auth: {},
    })
    when(reqMock1.params).thenReturn({ env_id: '1' })
    const req1 = instance(reqMock1)

    await access.couldAccessEnv(req1, res, next)
    expect(next).toBeCalledTimes(1)

    const reqMock2: Request = mock({})
    when(reqMock2.body).thenReturn({
      auth: {},
    })
    when(reqMock2.params).thenReturn({ env_id: '2' })
    const req2 = instance(reqMock2)

    await expect(() => access.couldAccessEnv(req2, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })

  test('could verify basic user env access', async () => {
    const next = jest.fn()

    const reqMock1: Request = mock({})
    when(reqMock1.body).thenReturn({
      auth: {
        id: 1,
        type: constants.User.Type.Basic,
      },
    })
    when(reqMock1.params).thenReturn({ env_id: '1' })
    const req1 = instance(reqMock1)

    await access.couldAccessEnv(req1, res, next)
    expect(next).toBeCalledTimes(1)

    const reqMock2: Request = mock({})
    when(reqMock2.body).thenReturn({
      auth: {
        id: 1,
        type: constants.User.Type.Basic,
      },
    })
    when(reqMock2.params).thenReturn({ env_id: '2' })
    const req2 = instance(reqMock2)

    await expect(() => access.couldAccessEnv(req2, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })

  test('could verify pro user env access', async () => {
    const next = jest.fn()

    const reqMock1: Request = mock({})
    when(reqMock1.body).thenReturn({
      auth: {
        id: 3,
        type: constants.User.Type.Pro,
      },
    })
    when(reqMock1.params).thenReturn({ env_id: '1' })
    const req1 = instance(reqMock1)

    await access.couldAccessEnv(req1, res, next)
    expect(next).toBeCalledTimes(1)

    const reqMock2: Request = mock({})
    when(reqMock2.body).thenReturn({
      auth: {
        id: 4,
        type: constants.User.Type.Pro,
      },
    })
    when(reqMock2.params).thenReturn({ env_id: constants.User.PlanLimit.Pro.Envs.toString() })
    const req2 = instance(reqMock2)

    await access.couldAccessEnv(req2, res, next)
    expect(next).toBeCalledTimes(2)

    const reqMock3: Request = mock({})
    when(reqMock3.body).thenReturn({
      auth: {
        id: 3,
        type: constants.User.Type.Basic,
      },
    })
    when(reqMock3.params).thenReturn({ env_id: constants.User.PlanLimit.Pro.Envs.toString() })
    const req3 = instance(reqMock3)

    await expect(() => access.couldAccessEnv(req3, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })

  test('could verify premium user env access', async () => {
    const next = jest.fn()

    const reqMock1: Request = mock({})
    when(reqMock1.body).thenReturn({
      auth: {
        id: 5,
        type: constants.User.Type.Premium,
      },
    })
    when(reqMock1.params).thenReturn({ env_id: '1' })
    const req1 = instance(reqMock1)

    await access.couldAccessEnv(req1, res, next)
    expect(next).toBeCalledTimes(1)

    const reqMock2: Request = mock({})
    when(reqMock2.body).thenReturn({
      auth: {
        id: 6,
        type: constants.User.Type.Premium,
      },
    })
    when(reqMock2.params).thenReturn({ env_id: constants.User.PlanLimit.Premium.Envs.toString() })
    const req2 = instance(reqMock2)

    await access.couldAccessEnv(req2, res, next)
    expect(next).toBeCalledTimes(2)

    const reqMock3: Request = mock({})
    when(reqMock3.body).thenReturn({
      auth: {
        id: 6,
        type: constants.User.Type.Pro,
      },
    })
    when(reqMock3.params).thenReturn({ env_id: constants.User.PlanLimit.Premium.Envs.toString() })
    const req3 = instance(reqMock3)

    await expect(() => access.couldAccessEnv(req3, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })
})

describe('#couldAccessCombo', () => {
  test('could verify props', async () => {
    const next = jest.fn()

    const reqMock: Request = mock({})
    when(reqMock.body).thenReturn({
      auth: {},
    })
    const req = instance(reqMock)

    await expect(() => access.couldAccessCombo(req, res, next))
      .rejects
      .toStrictEqual(errorEnum.Dev.WrongMiddleware)
  })

  test('could verify guest user combo access', async () => {
    const next = jest.fn()

    const reqMock: Request = mock({})
    when(reqMock.body).thenReturn({
      auth: {},
    })
    when(reqMock.params).thenReturn({ combo_id: '1' })
    const req = instance(reqMock)

    await expect(() => access.couldAccessCombo(req, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })

  test('could verify basic user combo access', async () => {
    const next = jest.fn()

    const reqMock: Request = mock({})
    when(reqMock.body).thenReturn({
      auth: {
        id: 1,
        type: constants.User.Type.Basic,
      },
    })
    when(reqMock.params).thenReturn({ combo_id: '1' })
    const req = instance(reqMock)

    await expect(() => access.couldAccessCombo(req, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })

  test('could verify pro user combo access', async () => {
    const next = jest.fn()

    const reqMock1: Request = mock({})
    when(reqMock1.body).thenReturn({
      auth: {
        id: 4,
        type: constants.User.Type.Pro,
      },
    })
    when(reqMock1.params).thenReturn({ combo_id: constants.User.PlanLimit.Pro.Combos.toString() })
    const req1 = instance(reqMock1)

    await access.couldAccessCombo(req1, res, next)
    expect(next).toBeCalledTimes(1)

    const reqMock2: Request = mock({})
    when(reqMock2.body).thenReturn({
      auth: {
        id: 4,
        type: constants.User.Type.Basic,
      },
    })
    when(reqMock2.params).thenReturn({ combo_id: constants.User.PlanLimit.Pro.Combos.toString() })
    const req2 = instance(reqMock2)

    await expect(() => access.couldAccessCombo(req2, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })

  test('could verify premium user combo access', async () => {
    const next = jest.fn()

    const reqMock1: Request = mock({})
    when(reqMock1.body).thenReturn({
      auth: {
        id: 6,
        type: constants.User.Type.Premium,
      },
    })
    when(reqMock1.params).thenReturn({ combo_id: constants.User.PlanLimit.Premium.Combos.toString() })
    const req1 = instance(reqMock1)

    await access.couldAccessCombo(req1, res, next)
    expect(next).toBeCalledTimes(1)

    const reqMock2: Request = mock({})
    when(reqMock2.body).thenReturn({
      auth: {
        id: 6,
        type: constants.User.Type.Pro,
      },
    })
    when(reqMock2.params).thenReturn({ combo_id: constants.User.PlanLimit.Premium.Combos.toString() })
    const req2 = instance(reqMock2)

    await expect(() => access.couldAccessCombo(req2, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })
})

describe('#couldAccessProfiles', () => {
  test('could verify props', async () => {
    const next = jest.fn()

    const reqMock: Request = mock({})
    when(reqMock.body).thenReturn({
      auth: {
        id: 2,
        type: constants.User.Type.Basic,
      },
    })
    const req = instance(reqMock)

    await expect(() => access.couldAccessProfiles(req, res, next))
      .rejects
      .toStrictEqual(errorEnum.Dev.WrongMiddleware)
  })

  test('could verify if user could access profiles', async () => {
    const next = jest.fn()

    const reqMock1: Request = mock({})
    when(reqMock1.body).thenReturn({
      auth: {
        id: 2,
        type: constants.User.Type.Basic,
      },
      traderIds: [
        constants.User.PlanLimit.Basic.Profiles - 1,
        constants.User.PlanLimit.Basic.Profiles,
      ],
    })
    const req1 = instance(reqMock1)

    await access.couldAccessProfiles(req1, res, next)
    expect(next).toBeCalledTimes(1)

    const reqMock2: Request = mock({})
    when(reqMock2.body).thenReturn({
      auth: {
        id: 2,
        type: constants.User.Type.Basic,
      },
      traderIds: [
        constants.User.PlanLimit.Basic.Profiles,
        constants.User.PlanLimit.Basic.Profiles + 1,
      ],
    })
    const req2 = instance(reqMock2)

    await expect(() => access.couldAccessProfiles(req2, res, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Forbidden)
  })
})
