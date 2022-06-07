import * as traderComboFollower from './traderComboFollower'
import * as databaseAdapter from '../adapters/database'

beforeAll(async () => {
  databaseAdapter.initTestConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_env.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_pattern.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_combo.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'user.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_combo_follower.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_env.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_pattern.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_combo.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'user.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_combo_follower.js',
  })
})

afterAll(async () => {
  const db = databaseAdapter.getConnection()
  await db.destroy()
})

describe('#getByUK', () => {
  test('could get by UK', async () => {
    const record1 = await traderComboFollower.getByUK(1, 1)
    expect(record1).toStrictEqual({
      traderComboId: 1,
      userId: 1,
      name: 'test1',
    })

    const record2 = await traderComboFollower.getByUK(2, 1)
    expect(record2).toStrictEqual({
      traderComboId: 1,
      userId: 2,
      name: 'test3',
    })

    const record3 = await traderComboFollower.getByUK(3, 1)
    expect(record3).toBeNull()

    const record4 = await traderComboFollower.getByUK(1, 4)
    expect(record4).toBeNull()
  })
})

describe('#getUserFollowed', () => {
  test('could get user followed', async () => {
    const user1 = await traderComboFollower.getUserFollowed(1)
    expect(user1.length).toBe(2)
    expect(user1[0].traderComboId).toBe(1)
    expect(user1[1].traderComboId).toBe(2)

    const user2 = await traderComboFollower.getUserFollowed(2)
    expect(user2.length).toBe(1)
    expect(user2[0].traderComboId).toBe(1)

    const user3 = await traderComboFollower.getUserFollowed(3)
    expect(user3.length).toBe(0)
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await traderComboFollower.create({
      userId: 1,
      traderComboId: 3,
      name: 'test4',
    }, transaction)
    await transaction.commit()

    const data = {
      userId: 1,
      traderComboId: 3,
      name: 'test4',
    }

    expect(created).toStrictEqual(data)

    const record = await traderComboFollower.getByUK(1, 3)
    expect(record).toStrictEqual(data)
  })
})

describe('#createIfEmpty', () => {
  test('could return existing one', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const record = await traderComboFollower.createIfEmpty({
      userId: 1,
      traderComboId: 3,
      name: 'test5',
    }, transaction)
    await transaction.rollback()
    expect(record).toStrictEqual({
      record: {
        userId: 1,
        traderComboId: 3,
        name: 'test4',
      },
      isNew: false,
    })
  })

  test('could create new', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const record = await traderComboFollower.createIfEmpty({
      userId: 2,
      traderComboId: 2,
      name: 'test5',
    }, transaction)
    await transaction.commit()
    expect(record).toStrictEqual({
      record: {
        userId: 2,
        traderComboId: 2,
        name: 'test5',
      },
      isNew: true,
    })

    const data = await traderComboFollower.getByUK(2, 2)
    expect(data).toStrictEqual({
      userId: 2,
      traderComboId: 2,
      name: 'test5',
    })
  })
})

describe('#destroy', () => {
  test('could destroy', async () => {
    const transaction = await databaseAdapter.createTransaction()
    await traderComboFollower.destroy(1, 1, transaction)
    await transaction.commit()
    expect((await traderComboFollower.getByUK(1, 1))).toBeFalsy()
    expect((await traderComboFollower.getByUK(1, 2))).toBeTruthy()
  })
})
