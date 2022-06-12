import * as userSubscription from './userSubscription'
import * as databaseAdapter from '../adapters/database'

beforeAll(async () => {
  databaseAdapter.initTestConnection()
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
    })

    const record2 = await userSubscription.getByUK('AAAA2')
    expect(record2).toStrictEqual({
      id: 2,
      userId: 1,
      status: 2,
      subscriptionId: 'AAAA2',
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
    }, transaction)
    await transaction.commit()
    const result = {
      id: 5,
      userId: 2,
      subscriptionId: 'AAAA5',
      status: 1,
    }
    expect(created).toStrictEqual(result)
    const record = await userSubscription.getByUK('AAAA5')
    expect(record).toStrictEqual(result)
  })
})
