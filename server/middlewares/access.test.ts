import * as access from './access'
import * as constants from '@shared/constants'
import * as errorEnum from 'enums/error'
import * as interfaces from '@shared/interfaces'
import * as traderComboFollowerModel from 'models/traderComboFollower'
import * as traderEnvFollowerModel from 'models/traderEnvFollower'
import * as traderEnvModel from 'models/traderEnv'
import * as traderFollowerModel from 'models/traderFollower'

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
  // @ts-ignore
  const record: interfaces.traderEnvModel.Record = { id }

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

describe('#couldCreateEnv', () => {
  test('guest user can not create env', async () => {
    const next = jest.fn()
    const req = { body: { auth: {} } }
    // @ts-ignore
    await expect(() => access.couldCreateEnv(req, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('basic user can not create env', async () => {
    const next = jest.fn()
    const req = {
      body: {
        auth: {
          id: 1,
          type: constants.User.Type.Basic,
        },
      },
    }
    // @ts-ignore
    await expect(() => access.couldCreateEnv(req, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('can verify pro user create env access', async () => {
    const next = jest.fn()
    const req1 = {
      body: {
        auth: {
          id: 3,
          type: constants.User.Type.Pro,
        },
      },
    }
    // @ts-ignore
    await access.couldCreateEnv(req1, null, next)
    expect(next).toBeCalledTimes(1)

    const req2 = {
      body: {
        auth: {
          id: 4,
          type: constants.User.Type.Pro,
        },
      },
    }
    // @ts-ignore
    await expect(() => access.couldCreateEnv(req2, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('can verify premium user create env access', async () => {
    const next = jest.fn()
    const req1 = {
      body: {
        auth: {
          id: 5,
          type: constants.User.Type.Premium,
        },
      },
    }
    // @ts-ignore
    await access.couldCreateEnv(req1, null, next)
    expect(next).toBeCalledTimes(1)

    const req2 = {
      body: {
        auth: {
          id: 6,
          type: constants.User.Type.Premium,
        },
      },
    }
    // @ts-ignore
    await expect(() => access.couldCreateEnv(req2, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })
})

describe('#couldCreateCombo', () => {
  test('guest user can not create combo', async () => {
    const next = jest.fn()
    const req = { body: { auth: {} } }
    // @ts-ignore
    await expect(() => access.couldCreateCombo(req, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('basic user can not create env', async () => {
    const next = jest.fn()
    const req = {
      body: {
        auth: {
          id: 1,
          type: constants.User.Type.Basic,
        },
      },
    }
    // @ts-ignore
    await expect(() => access.couldCreateCombo(req, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('can verify pro user create combo access', async () => {
    const next = jest.fn()
    const req1 = {
      body: {
        auth: {
          id: 3,
          type: constants.User.Type.Pro,
        },
      },
    }
    // @ts-ignore
    await access.couldCreateCombo(req1, null, next)
    expect(next).toBeCalledTimes(1)

    const req2 = {
      body: {
        auth: {
          id: 4,
          type: constants.User.Type.Pro,
        },
      },
    }
    // @ts-ignore
    await expect(() => access.couldCreateCombo(req2, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('can verify premium user create env access', async () => {
    const next = jest.fn()
    const req1 = {
      body: {
        auth: {
          id: 5,
          type: constants.User.Type.Premium,
        },
      },
    }
    // @ts-ignore
    await access.couldCreateCombo(req1, null, next)
    expect(next).toBeCalledTimes(1)

    const req2 = {
      body: {
        auth: {
          id: 6,
          type: constants.User.Type.Premium,
        },
      },
    }
    // @ts-ignore
    await expect(() => access.couldCreateCombo(req2, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })
})

describe('#couldCreateProfile', () => {
  test('guest user can not create profile', async () => {
    const next = jest.fn()
    const req = { body: { auth: {} } }
    // @ts-ignore
    await expect(() => access.couldCreateProfile(req, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('can verify basic user create profile access', async () => {
    const next = jest.fn()
    const req1 = {
      body: {
        auth: {
          id: 1,
          type: constants.User.Type.Basic,
        },
      },
    }
    // @ts-ignore
    await access.couldCreateProfile(req1, null, next)
    expect(next).toBeCalledTimes(1)

    const req2 = {
      body: {
        auth: {
          id: 2,
          type: constants.User.Type.Basic,
        },
      },
    }
    // @ts-ignore
    await expect(() => access.couldCreateProfile(req2, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('can verify pro user create profile access', async () => {
    const next = jest.fn()
    const req1 = {
      body: {
        auth: {
          id: 3,
          type: constants.User.Type.Pro,
        },
      },
    }
    // @ts-ignore
    await access.couldCreateProfile(req1, null, next)
    expect(next).toBeCalledTimes(1)

    const req2 = {
      body: {
        auth: {
          id: 4,
          type: constants.User.Type.Pro,
        },
      },
    }
    // @ts-ignore
    await expect(() => access.couldCreateProfile(req2, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })

  test('can verify premium user create profile access', async () => {
    const next = jest.fn()
    const req1 = {
      body: {
        auth: {
          id: 5,
          type: constants.User.Type.Premium,
        },
      },
    }
    // @ts-ignore
    await access.couldCreateProfile(req1, null, next)
    expect(next).toBeCalledTimes(1)

    const req2 = {
      body: {
        auth: {
          id: 6,
          type: constants.User.Type.Premium,
        },
      },
    }
    // @ts-ignore
    await expect(() => access.couldCreateProfile(req2, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Unauthorized)
  })
})

describe('#couldAccessEnv', () => {
  test('could verify props', async () => {
    const next = jest.fn()
    const req = {
      body: { auth: {} },
    }
    // @ts-ignore
    await expect(() => access.couldAccessEnv(req, null, next))
      .rejects
      .toStrictEqual(errorEnum.Dev.WrongMiddleware)
  })

  test('could verify env', async () => {
    const next = jest.fn()
    const req = {
      params: { env_id: 999 },
      body: { auth: {} },
    }
    // @ts-ignore
    await expect(() => access.couldAccessEnv(req, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })

  test('could verify guest user env access', async () => {
    const next = jest.fn()
    const req1 = {
      params: { env_id: 1 },
      body: { auth: {} },
    }
    // @ts-ignore
    await access.couldAccessEnv(req1, null, next)
    expect(next).toBeCalledTimes(1)

    const req2 = {
      params: { env_id: 2 },
      body: { auth: {} },
    }
    // @ts-ignore
    await expect(() => access.couldAccessEnv(req2, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })

  test('could verify basic user env access', async () => {
    const next = jest.fn()
    const req1 = {
      params: { env_id: 1 },
      body: {
        auth: {
          id: 1,
          type: constants.User.Type.Basic,
        },
      },
    }
    // @ts-ignore
    await access.couldAccessEnv(req1, null, next)
    expect(next).toBeCalledTimes(1)

    const req2 = {
      params: { env_id: 2 },
      body: {
        auth: {
          id: 1,
          type: constants.User.Type.Basic,
        },
      },
    }
    // @ts-ignore
    await expect(() => access.couldAccessEnv(req2, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })

  test('could verify pro user env access', async () => {
    const next = jest.fn()
    const req1 = {
      params: { env_id: 1 },
      body: {
        auth: {
          id: 3,
          type: constants.User.Type.Pro,
        },
      },
    }
    // @ts-ignore
    await access.couldAccessEnv(req1, null, next)
    expect(next).toBeCalledTimes(1)

    const req2 = {
      params: { env_id: constants.User.PlanLimit.Pro.Envs },
      body: {
        auth: {
          id: 4,
          type: constants.User.Type.Pro,
        },
      },
    }
    // @ts-ignore
    await access.couldAccessEnv(req2, null, next)
    expect(next).toBeCalledTimes(2)

    const req3 = {
      params: { env_id: constants.User.PlanLimit.Pro.Envs },
      body: {
        auth: {
          id: 3,
          type: constants.User.Type.Basic,
        },
      },
    }
    // @ts-ignore
    await expect(() => access.couldAccessEnv(req3, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })

  test('could verify premium user env access', async () => {
    const next = jest.fn()
    const req1 = {
      params: { env_id: 1 },
      body: {
        auth: {
          id: 5,
          type: constants.User.Type.Premium,
        },
      },
    }
    // @ts-ignore
    await access.couldAccessEnv(req1, null, next)
    expect(next).toBeCalledTimes(1)

    const req2 = {
      params: { env_id: constants.User.PlanLimit.Premium.Envs },
      body: {
        auth: {
          id: 6,
          type: constants.User.Type.Premium,
        },
      },
    }
    // @ts-ignore
    await access.couldAccessEnv(req2, null, next)
    expect(next).toBeCalledTimes(2)

    const req3 = {
      params: { env_id: constants.User.PlanLimit.Premium.Envs },
      body: {
        auth: {
          id: 6,
          type: constants.User.Type.Pro,
        },
      },
    }
    // @ts-ignore
    await expect(() => access.couldAccessEnv(req3, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })
})

describe('#couldAccessCombo', () => {
  test('could verify props', async () => {
    const next = jest.fn()
    const req = {
      body: { auth: {} },
    }
    // @ts-ignore
    await expect(() => access.couldAccessCombo(req, null, next))
      .rejects
      .toStrictEqual(errorEnum.Dev.WrongMiddleware)
  })

  test('could verify guest user combo access', async () => {
    const next = jest.fn()
    const req = {
      params: { combo_id: 1 },
      body: { auth: {} },
    }
    // @ts-ignore
    await expect(() => access.couldAccessCombo(req, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })

  test('could verify basic user combo access', async () => {
    const next = jest.fn()
    const req = {
      params: { combo_id: 1 },
      body: {
        auth: {
          id: 1,
          type: constants.User.Type.Basic,
        },
      },
    }
    // @ts-ignore
    await expect(() => access.couldAccessCombo(req, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })

  test('could verify pro user combo access', async () => {
    const next = jest.fn()
    const req1 = {
      params: { combo_id: constants.User.PlanLimit.Pro.Combos },
      body: {
        auth: {
          id: 4,
          type: constants.User.Type.Pro,
        },
      },
    }
    // @ts-ignore
    await access.couldAccessCombo(req1, null, next)
    expect(next).toBeCalledTimes(1)

    const req2 = {
      params: { combo_id: constants.User.PlanLimit.Pro.Combos },
      body: {
        auth: {
          id: 4,
          type: constants.User.Type.Basic,
        },
      },
    }
    // @ts-ignore
    await expect(() => access.couldAccessCombo(req2, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })

  test('could verify premium user combo access', async () => {
    const next = jest.fn()

    const req1 = {
      params: { combo_id: constants.User.PlanLimit.Premium.Combos },
      body: {
        auth: {
          id: 6,
          type: constants.User.Type.Premium,
        },
      },
    }
    // @ts-ignore
    await access.couldAccessCombo(req1, null, next)
    expect(next).toBeCalledTimes(1)

    const req2 = {
      params: { combo_id: constants.User.PlanLimit.Premium.Combos },
      body: {
        auth: {
          id: 6,
          type: constants.User.Type.Pro,
        },
      },
    }
    // @ts-ignore
    await expect(() => access.couldAccessCombo(req2, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.NotFound)
  })
})

describe('#couldAccessProfiles', () => {
  test('could verify props', async () => {
    const next = jest.fn()
    const req = {
      body: {
        auth: {
          id: 2,
          type: constants.User.Type.Basic,
        },
      },
    }
    // @ts-ignore
    await expect(() => access.couldAccessProfiles(req, null, next))
      .rejects
      .toStrictEqual(errorEnum.Dev.WrongMiddleware)
  })

  test('could verify if user could access profiles', async () => {
    const next = jest.fn()

    const req1 = {
      body: {
        auth: {
          id: 2,
          type: constants.User.Type.Basic,
        },
        traderIds: [
          constants.User.PlanLimit.Basic.Profiles - 1,
          constants.User.PlanLimit.Basic.Profiles,
        ],
      },
    }
    // @ts-ignore
    await access.couldAccessProfiles(req1, null, next)
    expect(next).toBeCalledTimes(1)

    const req2 = {
      body: {
        auth: {
          id: 2,
          type: constants.User.Type.Basic,
        },
        traderIds: [
          constants.User.PlanLimit.Basic.Profiles,
          constants.User.PlanLimit.Basic.Profiles + 1,
        ],
      },
    }
    // @ts-ignore
    await expect(() => access.couldAccessProfiles(req2, null, next))
      .rejects
      .toStrictEqual(errorEnum.Default.Forbidden)
  })
})
