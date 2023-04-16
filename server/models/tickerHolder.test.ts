import * as databaseAdapter from 'adapters/database'
import * as tickerHolder from './tickerHolder'

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
    name: 'ticker_category.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'ticker_category.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'ticker.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'ticker.js',
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
    name: 'ticker_holder.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'ticker_holder.js',
  })
})

afterAll(async () => {
  const db = databaseAdapter.getConnection()
  await db.destroy()
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await tickerHolder.create({
      tickerId: 3,
      traderId: 104,
    }, transaction)
    await transaction.commit()
    expect(created.tickerId).toBe(3)
    expect(created.traderId).toBe(104)
  })
})

describe('#destroyTraderTickers', () => {
  test('could destroyTraderTickers', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const result = await tickerHolder.destroyTraderTickers(104, transaction)
    await transaction.commit()
    expect(result).toBe(true)
    const transaction1 = await databaseAdapter.createTransaction()
    const created = await tickerHolder.create({
      tickerId: 3,
      traderId: 104,
    }, transaction1)
    await transaction1.commit()
    expect(!!created).toBe(true)
  })
})
