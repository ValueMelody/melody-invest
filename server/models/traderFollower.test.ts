import * as databaseAdapter from '../adapters/database'
import * as traderFollower from './traderFollower'

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
    name: 'user.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'user.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_follower.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_follower.js',
  })
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#getByUK', () => {
  test('could get by UK', async () => {
    const record1 = await traderFollower.getByUK(1, 1)
    expect(record1?.userId).toBe(1)
    expect(record1?.traderId).toBe(1)

    const record2 = await traderFollower.getByUK(2, 2)
    expect(record2?.userId).toBe(2)
    expect(record2?.traderId).toBe(2)

    const record3 = await traderFollower.getByUK(3, 1)
    expect(record3).toBe(null)

    const record4 = await traderFollower.getByUK(1, 4)
    expect(record4).toBe(null)

    const record5 = await traderFollower.getByUK(2, 3)
    expect(record5).toBe(null)
  })
})

describe('#getUserFollowed', () => {
  test('could get user followed', async () => {
    const userFollowed1 = await traderFollower.getUserFollowed(1)
    expect(userFollowed1.length).toBe(3)
    expect(userFollowed1[0].traderId).toBe(1)
    expect(userFollowed1[1].traderId).toBe(2)
    expect(userFollowed1[2].traderId).toBe(3)

    const userFollowed2 = await traderFollower.getUserFollowed(2)
    expect(userFollowed2.length).toBe(2)
    expect(userFollowed1[0].traderId).toBe(1)
    expect(userFollowed1[1].traderId).toBe(2)

    const userFollowed3 = await traderFollower.getUserFollowed(3)
    expect(userFollowed3.length).toBe(0)
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await traderFollower.create({
      userId: 1,
      traderId: 4,
    }, transaction)
    await transaction.commit()
    expect(created).toStrictEqual({ userId: 1, traderId: 4 })

    const record = await traderFollower.getByUK(1, 4)
    expect(record).toStrictEqual({ userId: 1, traderId: 4 })
  })
})

describe('#destroy', () => {
  test('could destroy', async () => {
    const transaction = await databaseAdapter.createTransaction()
    await traderFollower.destroy(1, 1, transaction)
    await transaction.commit()
    const record = await traderFollower.getByUK(1, 1)
    expect(record).toBeNull()
  })
})
