import * as databaseAdapter from 'adapters/database'
import * as userSubscription from './userSubscription'

beforeAll(async () => {
  databaseAdapter.initConnection()
  const connection = databaseAdapter.getConnection()
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
    name: 'user_subscription.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'user_subscription.js',
  })
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#getByUK', () => {
  test('could get by UK', async () => {
    const record1 = await userSubscription.getByUK('AAAA1')
    expect(record1).toStrictEqual({
      id: 1,
      userId: 1,
      status: 3,
      subscriptionId: 'AAAA1',
      startAtUTC: '2022-01-01T01:02:03',
      endAtUTC: '2022-02-01T01:02:03',
    })

    const record2 = await userSubscription.getByUK('AAAA2')
    expect(record2).toStrictEqual({
      id: 2,
      userId: 1,
      status: 2,
      subscriptionId: 'AAAA2',
      startAtUTC: '2022-02-02T02:02:03',
      endAtUTC: '2022-03-01T02:02:03',
    })
  })
})

describe('#getUserActive', () => {
  test('could get user activate record', async () => {
    const record1 = await userSubscription.getUserActive(1)
    expect(record1).toStrictEqual({
      id: 3,
      userId: 1,
      subscriptionId: 'AAAA3',
      status: 1,
      startAtUTC: '2022-05-01T01:02:03',
      endAtUTC: null,
    })

    const record2 = await userSubscription.getUserActive(2)
    expect(record2).toStrictEqual({
      id: 4,
      userId: 2,
      subscriptionId: 'AAAA4',
      status: 1,
      startAtUTC: '2021-01-01T00:00:01',
      endAtUTC: null,
    })
  })
})

describe('#getUserLatest', () => {
  test('could get user latest record', async () => {
    const record1 = await userSubscription.getUserLatest(1)
    expect(record1).toStrictEqual({
      id: 3,
      userId: 1,
      subscriptionId: 'AAAA3',
      status: 1,
      startAtUTC: '2022-05-01T01:02:03',
      endAtUTC: null,
    })

    const record2 = await userSubscription.getUserLatest(2)
    expect(record2).toStrictEqual({
      id: 4,
      userId: 2,
      subscriptionId: 'AAAA4',
      status: 1,
      startAtUTC: '2021-01-01T00:00:01',
      endAtUTC: null,
    })
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await userSubscription.create({
      userId: 2,
      subscriptionId: 'AAAA5',
      status: 1,
      startAtUTC: '2022-06-01T01:01:01',
    }, transaction)
    await transaction.commit()
    const result = {
      id: 5,
      userId: 2,
      subscriptionId: 'AAAA5',
      status: 1,
      startAtUTC: '2022-06-01T01:01:01',
      endAtUTC: null,
    }
    expect(created).toStrictEqual(result)
    const record = await userSubscription.getByUK('AAAA5')
    expect(record).toStrictEqual(result)
  })
})

describe('#update', () => {
  test('could update', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const updated = await userSubscription.update(5, {
      endAtUTC: '2022-07-01T01:01:01',
      status: 2,
    }, transaction)
    await transaction.commit()
    const result = {
      id: 5,
      userId: 2,
      subscriptionId: 'AAAA5',
      status: 2,
      startAtUTC: '2022-06-01T01:01:01',
      endAtUTC: '2022-07-01T01:01:01',
    }
    expect(result).toStrictEqual(updated)

    const record = await userSubscription.getByUK('AAAA5')
    expect(result).toStrictEqual(record)
  })
})
