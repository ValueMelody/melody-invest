import * as ticker from './ticker'
import * as databaseAdapter from '../adapters/database'

beforeAll(async () => {
  databaseAdapter.initTestConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/latest',
    name: 'ticker_category.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/latest',
    name: 'ticker.js',
  })
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const info = {
      name: 'Apple',
      symbol: 'APPL',
      region: 'US',
      tickerCategoryId: null,
    }
    const result = await ticker.create(info, transaction)
    await transaction.commit()
    expect(result).toStrictEqual({
      id: 1,
      ...info,
      firstPriceDate: null,
      lastPriceDate: null,
      firstEPSYear: null,
      lastEPSYear: null,
      firstEPSQuarter: null,
      lastEPSQuarter: null,
      firstIncomeYear: null,
      lastIncomeYear: null,
      firstIncomeQuarter: null,
      lastIncomeQuarter: null,
    })
  })
})

describe('#getAll', () => {
  describe('could get', () => {
    test('could get all', async () => {
      const tickers = await ticker.getAll()
      expect(tickers.length).toBe(1)
    })
  })
})
