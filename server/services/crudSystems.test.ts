import * as constants from '@shared/constants'
import * as crudSystems from './crudSystems'
import * as databaseAdapter from 'adapters/database'

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
    name: 'policy.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'policy.js',
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
    name: 'ticker.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'ticker.js',
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
    name: 'daily_tickers.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'daily_tickers.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'ticker_daily.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'ticker_daily.js',
  })
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#getSystemPolicy', () => {
  test('could get policy', async () => {
    const result1 = await crudSystems.getSystemPolicy(constants.Content.PolicyType.Privacy)
    expect(result1?.content).toBe('Privacy policy 2')

    const result2 = await crudSystems.getSystemPolicy(constants.Content.PolicyType.TermsAndConditions)
    expect(result2?.content).toBe('Terms and Conditions 1')
  })
})

describe('#getDefaults', () => {
  test('could get defaults', async () => {
    const result = await crudSystems.getDefaults()
    expect(result.tickers.length).toBe(3)
  })
})
