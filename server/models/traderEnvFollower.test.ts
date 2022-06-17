import * as traderEnvFollower from './traderEnvFollower'
import * as databaseAdapter from 'adapters/database'

beforeAll(async () => {
  databaseAdapter.initTestConnection()
  const connection = databaseAdapter.getConnection()
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
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#getByUK', () => {
  test('could get by UK', async () => {
    const record1 = await traderEnvFollower.getByUK(1, 1)
    expect(record1?.userId).toBe(1)
    expect(record1?.traderEnvId).toBe(1)
    expect(record1?.name).toBe('test1')

    const record2 = await traderEnvFollower.getByUK(2, 2)
    expect(record2?.userId).toBe(2)
    expect(record2?.traderEnvId).toBe(2)
    expect(record2?.name).toBe('test3')

    const record3 = await traderEnvFollower.getByUK(3, 1)
    expect(record3).toBe(null)
  })
})

describe('#getUserFollowed', () => {
  test('could get user followed', async () => {
    const records1 = await traderEnvFollower.getUserFollowed(1)
    expect(records1?.length).toBe(2)
    expect(records1[0].traderEnvId).toBe(1)
    expect(records1[1].traderEnvId).toBe(2)

    const records2 = await traderEnvFollower.getUserFollowed(2)
    expect(records2?.length).toBe(1)
    expect(records2[0].traderEnvId).toBe(2)

    const records3 = await traderEnvFollower.getUserFollowed(3)
    expect(records3?.length).toBe(0)
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const detail = {
      userId: 1,
      traderEnvId: 3,
      name: 'test create',
    }
    const created = await traderEnvFollower.create(detail, transaction)
    await transaction.commit()
    expect(created).toStrictEqual(detail)
    const record = await traderEnvFollower.getByUK(1, 3)
    expect(record).toStrictEqual(detail)
  })
})

describe('#createIfEmpty', () => {
  test('could return existing', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const detail = {
      userId: 1,
      traderEnvId: 3,
      name: 'test create',
    }
    const created = await traderEnvFollower.createIfEmpty(detail, transaction)
    await transaction.rollback()
    expect(created).toStrictEqual({ record: detail, isNew: false })
  })

  test('could create new', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const detail = {
      userId: 2,
      traderEnvId: 3,
      name: 'test create',
    }
    const created = await traderEnvFollower.createIfEmpty(detail, transaction)
    await transaction.commit()
    expect(created).toStrictEqual({ record: detail, isNew: true })
  })
})

describe('#destroy', () => {
  test('could destroy', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const result = await traderEnvFollower.destroy(1, 3, transaction)
    await transaction.commit()
    expect(result).toBe(true)
    const record = await traderEnvFollower.getByUK(1, 3)
    expect(record).toBe(null)
  })
})
