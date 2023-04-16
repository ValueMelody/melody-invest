import * as crudTraders from './crudTraders'
import * as databaseAdapter from 'adapters/database'
import * as errorEnum from 'enums/error'
import * as interfaces from '@shared/interfaces'
import * as traderComboFollowerModel from 'models/traderComboFollower'
import * as traderEnvFollowerModel from 'models/traderEnvFollower'
import * as traderFollowerModel from 'models/traderFollower'
import { instance, mock } from 'ts-mockito'

beforeEach(async () => {
  databaseAdapter.initConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'entity.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'entity.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_env.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_env.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_pattern.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_pattern.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_holding.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_holding.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'user.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'user.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_env_follower.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_env_follower.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_follower.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_follower.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_combo.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_combo.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_combo_follower.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_combo_follower.js',
  })
})

afterEach(async () => {
  const db = databaseAdapter.getConnection()
  await db.destroy()
})

describe('#getTraderProfile', () => {
  test('could get trader profile', async () => {
    const result = await crudTraders.getTraderProfile(1, '0AA')
    expect(result?.trader.id).toBe(1)
    expect(result?.trader.traderPatternId).toBe(1)
    expect(result?.trader.accessCode).toBe('0AA')
    expect(result?.pattern.id).toBe(1)
  })

  test('could throw error for trader not exists', async () => {
    await expect(async () => await crudTraders.getTraderProfile(10000, '000'))
      .rejects
      .toBe(errorEnum.Custom.WrongAccessCode)
  })

  test('could throw error for accessCode no match', async () => {
    await expect(async () => await crudTraders.getTraderProfile(1, '0A'))
      .rejects
      .toBe(errorEnum.Custom.WrongAccessCode)
  })
})

describe('#getProfileDetail', () => {
  test('could get trader profile', async () => {
    const result = await crudTraders.getProfileDetail(1, '0AA', [1, 2])
    expect(result?.holdings.length).toBe(2)
    expect(result?.holdings[0].id).toBe('5ed6d4c8-c159-4588-b966-364a4bdbd3a2')
    expect(result?.holdings[1].id).toBe('5ed6d4c8-c159-4588-b966-364a4bdbd3a1')
    expect(result?.profileEnvs).toStrictEqual([
      {
        traderId: 1,
        traderEnvId: 1,
        traderPatternId: 1,
        accessCode: '0AA',
      },
      {
        traderId: 53,
        traderEnvId: 2,
        traderPatternId: 1,
        accessCode: '00B',
      },
    ])
  })

  test('could get trader profile from special envs', async () => {
    const result = await crudTraders.getProfileDetail(1, '0AA', [2])
    expect(result?.profileEnvs).toStrictEqual([
      {
        traderId: 53,
        traderEnvId: 2,
        traderPatternId: 1,
        accessCode: '00B',
      },
    ])
  })

  test('could throw error for trader not exists', async () => {
    await expect(async () => await crudTraders.getProfileDetail(10000, '000', [1, 2]))
      .rejects
      .toBe(errorEnum.Custom.WrongAccessCode)
  })

  test('could throw error for accessCode no match', async () => {
    await expect(async () => await crudTraders.getProfileDetail(1, '0A', [1, 2]))
      .rejects
      .toBe(errorEnum.Custom.WrongAccessCode)
  })
})

describe('#getUserTraderEnvIds', () => {
  test('could get user trader envs', async () => {
    const userEnv1 = await crudTraders.getUserTraderEnvIds(1)
    expect(userEnv1).toStrictEqual([1, 2, 1])

    const userEnv2 = await crudTraders.getUserTraderEnvIds(2)
    expect(userEnv2).toStrictEqual([2, 1])

    const userEnv3 = await crudTraders.getUserTraderEnvIds(null)
    expect(userEnv3).toStrictEqual([1])
  })
})

describe('createFollowedTrader', () => {
  test('could create new follower', async () => {
    await crudTraders.createFollowedTrader(1, 50)
    const record = await traderFollowerModel.getByUK(1, 50)
    expect(record).toBeTruthy()
  })

  test('could handle existing follower', async () => {
    await crudTraders.createFollowedTrader(1, 1)
    const record = await traderFollowerModel.getByUK(1, 1)
    expect(record).toBeTruthy()
  })

  test('do nothing if follower not exist', async () => {
    await crudTraders.createFollowedTrader(1, 9999)
    const record = await traderFollowerModel.getByUK(1, 9999)
    expect(record).toBeFalsy()
  })
})

describe('#deleteFollowedProfile', () => {
  test('could delete followed', async () => {
    const follower = await traderFollowerModel.getByUK(1, 1)
    expect(follower).toBeTruthy()
    await crudTraders.deleteFollowedProfile(1, 1)
    const record = await traderFollowerModel.getByUK(1, 1)
    expect(record).toBeFalsy()
  })

  test('do nothing if not exists', async () => {
    await crudTraders.deleteFollowedProfile(1, 9999)
    const record = await traderFollowerModel.getByUK(1, 9999)
    expect(record).toBeFalsy()
  })
})

describe('#deleteFollowedEnv', () => {
  test('could delete env follower', async () => {
    const envFollower = await traderEnvFollowerModel.getByUK(1, 1)
    expect(envFollower).toBeTruthy()
    await crudTraders.deleteFollowedEnv(1, 1)
    const record = await traderFollowerModel.getByUK(1, 1)
    expect(record).toBeFalsy()
  })

  test('do nothing if not exists', async () => {
    await crudTraders.deleteFollowedEnv(1, 9999)
    const record = await traderFollowerModel.getByUK(1, 9999)
    expect(record).toBeFalsy()
  })
})

describe('#deleteFollowedCombo', () => {
  test('could delete combo follower', async () => {
    const comboFollower = await traderComboFollowerModel.getByUK(1, 1)
    expect(comboFollower).toBeTruthy()
    await crudTraders.deleteFollowedCombo(1, 1)
    const record = await traderComboFollowerModel.getByUK(1, 1)
    expect(record).toBeFalsy()
  })

  test('do nothing if not exists', async () => {
    await crudTraders.deleteFollowedCombo(1, 9999)
    const record = await traderComboFollowerModel.getByUK(1, 9999)
    expect(record).toBeFalsy()
  })
})

describe('#createTraderCombo', () => {
  test('could create combo', async () => {
    const result = await crudTraders.createTraderCombo(1, 1, 'test combo', [2, 3])
    expect(result).toStrictEqual({
      id: 4,
      entityId: 1,
      traderIds: [2, 3],
      isSystem: false,
      name: 'test combo',
    })
    const follower = await traderComboFollowerModel.getByUK(1, 4)
    expect(follower).toBeTruthy()
  })

  test('could create combo if already exists', async () => {
    const result = await crudTraders.createTraderCombo(1, 1, 'test combo', [4, 5, 6])
    expect(result).toStrictEqual({
      id: 2,
      entityId: 1,
      traderIds: [4, 5, 6],
      isSystem: false,
      name: 'test2',
    })
    const follower = await traderComboFollowerModel.getByUK(1, 2)
    expect(follower).toBeTruthy()
  })
})

describe('#createTraderEnv', () => {
  test('could create env', async () => {
    const result = await crudTraders.createTraderEnv(1, 1, 'test env', '2020-01-01', [2, 3])
    expect(result).toStrictEqual({
      id: 4,
      entityId: 1,
      tickerIds: [2, 3],
      startDate: '2020-01-01',
      isSystem: false,
      name: 'test env',
      activeTotal: 1000,
    })
    const follower = await traderEnvFollowerModel.getByUK(1, 4)
    expect(follower).toBeTruthy()
  })

  test('could create env if already exists', async () => {
    const result = await crudTraders.createTraderEnv(1, 2, 'test env', '2012-01-01', null)
    expect(result).toStrictEqual({
      id: 2,
      entityId: 2,
      tickerIds: null,
      startDate: '2012-01-01',
      isSystem: false,
      name: 'test2',
      activeTotal: 10000,
    })
    const follower = await traderEnvFollowerModel.getByUK(1, 2)
    expect(follower).toBeTruthy()
  })
})

describe('#createTraderProfile', () => {
  test('could create', async () => {
    const patternType = mock<interfaces.traderPatternModel.Create>({})
    const pattern = {
      ...instance(patternType),
      hashCode: 'PATTERN052',
    }
    const result = await crudTraders.createTraderProfile(1, 3, pattern)
    expect(result.trader.id).toBe(105)
    expect(result.trader.traderEnvId).toBe(3)
    expect(result.trader.traderPatternId).toBe(52)
    expect(result.pattern.id).toBe(52)
    const record = await traderFollowerModel.getByUK(1, 105)
    expect(record).toBeTruthy()
  })
  test('could handle if records exists', async () => {
    const patternType = mock<interfaces.traderPatternModel.Create>({})
    const pattern = {
      ...instance(patternType),
      hashCode: 'PATTERN001',
    }
    const result = await crudTraders.createTraderProfile(1, 1, pattern)
    expect(result.trader.id).toBe(1)
    expect(result.trader.traderEnvId).toBe(1)
    expect(result.trader.traderPatternId).toBe(1)
    expect(result.pattern.id).toBe(1)
    const record = await traderFollowerModel.getByUK(1, 1)
    expect(record).toBeTruthy()
  })
})
