import * as databaseAdapter from 'adapters/database'
import * as traderEnv from './traderEnv'

beforeAll(async () => {
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
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#getAll', () => {
  test('could get all', async () => {
    const envs = await traderEnv.getAll()
    expect(envs.length).toBe(3)
    expect(envs[0].isSystem).toBeTruthy()
    expect(envs[1].isSystem).toBeFalsy()
    expect(envs[2].isSystem).toBeFalsy()
  })
})

describe('#getByPK', () => {
  test('could get by PK', async () => {
    const env1 = await traderEnv.getByPK(1)
    expect(env1?.isSystem).toBeTruthy()
    expect(env1?.tickerIds).toBe(null)
    expect(env1?.startDate).toBe('2001-01-01')

    const env2 = await traderEnv.getByPK(2)
    expect(env2?.isSystem).toBeFalsy()
    expect(env2?.tickerIds).toBe(null)

    const env3 = await traderEnv.getByPK(3)
    expect(env3?.isSystem).toBeFalsy()
    expect(env3?.tickerIds).toStrictEqual([1, 2])

    const env4 = await traderEnv.getByPK(4)
    expect(env4).toBe(null)
  })
})

describe('#getByUK', () => {
  test('could get by UK', async () => {
    const env1 = await traderEnv.getByUK(1, '2001-01-01', null)
    expect(env1?.id).toBe(1)

    const env2 = await traderEnv.getByUK(1, '2015-06-01', '1,2')
    expect(env2?.id).toBe(3)

    const env3 = await traderEnv.getByUK(1, '2001-01-01', '1,2')
    expect(env3).toBe(null)
  })
})

describe('#getSystemDefined', () => {
  test('could get system defined', async () => {
    const envs = await traderEnv.getSystemDefined()
    expect(envs.length).toBe(1)
    expect(envs[0].id).toBe(1)
  })
})

describe('#getInPKs', () => {
  test('could get by PKs', async () => {
    const envs = await traderEnv.getInPKs([2, 3])
    expect(envs.length).toBe(2)
    expect(envs[0].id).toBe(2)
    expect(envs[1].id).toBe(3)
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await traderEnv.create({
      entityId: 3,
      activeTotal: 100,
      name: '123',
      isSystem: false,
      startDate: '2022-01-01',
      tickerIds: '1, 2, 3',
    }, transaction)
    await transaction.commit()
    const expected = {
      id: 4,
      entityId: 3,
      activeTotal: 100,
      name: '123',
      isSystem: false,
      startDate: '2022-01-01',
      tickerIds: [1, 2, 3],
    }
    expect(created).toStrictEqual(expected)
    const record = await traderEnv.getByPK(4)
    expect(record).toStrictEqual(expected)
  })
})

describe('#createIfEmpty', () => {
  test('could return existing one', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await traderEnv.createIfEmpty({
      entityId: 3,
      activeTotal: 100,
      name: '123',
      isSystem: false,
      startDate: '2022-01-01',
      tickerIds: '1, 2, 3',
    }, transaction)
    await transaction.rollback()
    const expected = {
      id: 4,
      entityId: 3,
      activeTotal: 100,
      name: '123',
      isSystem: false,
      startDate: '2022-01-01',
      tickerIds: [1, 2, 3],
    }
    expect(created).toStrictEqual({
      record: expected,
      isNew: false,
    })
  })

  test('could create new', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await traderEnv.createIfEmpty({
      entityId: 2,
      activeTotal: 100,
      name: '123',
      isSystem: false,
      startDate: '2023-01-01',
      tickerIds: '1, 2',
    }, transaction)
    await transaction.commit()
    const expected = {
      id: 5,
      entityId: 2,
      activeTotal: 100,
      name: '123',
      isSystem: false,
      startDate: '2023-01-01',
      tickerIds: [1, 2],
    }
    expect(created).toStrictEqual({
      record: expected,
      isNew: true,
    })
  })
})
