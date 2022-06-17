import * as tickerCategory from './tickerCategory'
import * as databaseAdapter from 'adapters/database'

beforeAll(async () => {
  databaseAdapter.initTestConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'ticker_category.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'ticker_category.js',
  })
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#getAll', () => {
  test('could get all', async () => {
    const tickerCategories = await tickerCategory.getAll()
    expect(tickerCategories).toStrictEqual([
      { id: 1, name: 'Tec' },
      { id: 2, name: 'Hardware' },
    ])
  })
})
