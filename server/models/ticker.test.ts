import * as ticker from './ticker'
import * as databaseAdapter from 'adapters/database'

const emptyProps = {
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
}

beforeAll(async () => {
  databaseAdapter.initTestConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'ticker_category.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'ticker.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'ticker_category.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'ticker.js',
  })
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#getAll', () => {
  test('could get all', async () => {
    const tickers = await ticker.getAll()
    expect(tickers.length).toBe(3)
    expect(tickers[0].symbol).toBe('AAPL')
    expect(tickers[1].symbol).toBe('MSFT')
    expect(tickers[2].symbol).toBe('GOOG')
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const info = {
      name: 'AMAZON',
      symbol: 'AMZN',
      region: 'US',
      tickerCategoryId: 2,
    }
    const result = await ticker.create(info, transaction)
    await transaction.commit()
    expect(result).toStrictEqual({ id: 4, ...info, ...emptyProps })
    const tickers = await ticker.getAll()
    expect(tickers.length).toBe(4)
    expect(tickers[3]).toStrictEqual({ id: 4, ...info, ...emptyProps })
  })
})

describe('#getByUK', () => {
  test('could get by UK', async () => {
    const result = await ticker.getByUK('US', 'MSFT')
    expect(result).toStrictEqual({
      id: 2,
      symbol: 'MSFT',
      region: 'US',
      name: 'Microsoft Corp',
      tickerCategoryId: 1,
      ...emptyProps,
    })
    const empty = await ticker.getByUK('US', 'RANDOM')
    expect(empty).toBe(null)
  })
})

describe('#update', () => {
  test('could update', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const info = {
      firstPriceDate: '2001-01-01',
      lastPriceDate: '2002-02-02',
      firstEPSYear: '2003',
      lastEPSYear: '2004',
      firstEPSQuarter: '2005-03',
      lastEPSQuarter: '2005-06',
      firstIncomeYear: '2006',
      lastIncomeYear: '2005',
      firstIncomeQuarter: '2007-07',
      lastIncomeQuarter: '2008-12',
    }
    const result = await ticker.update(3, info, transaction)
    await transaction.commit()
    const basic = { symbol: 'GOOG', region: 'US', name: 'Google', tickerCategoryId: null }
    expect(result).toStrictEqual({ id: 3, ...info, ...basic })
    const record = await ticker.getByUK('US', 'GOOG')
    expect(record).toStrictEqual({ id: 3, ...info, ...basic })
  })
})
