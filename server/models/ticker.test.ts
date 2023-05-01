
import * as databaseAdapter from 'adapters/database'
import * as ticker from './ticker'

const emptyProps = {
  firstPriceDate: null,
  lastPriceDate: null,
  firstFinancialQuarter: null,
  firstFinancialYear: null,
  lastFinancialQuarter: null,
  lastFinancialYear: null,
}

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
    name: 'ticker.js',
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
      entityId: 1,
      name: 'AMAZON',
      symbol: 'AMZN',
      region: 'US',
      isDelisted: false,
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
    const result = await ticker.getByUK(1, 'US', 'MSFT')
    expect(result).toStrictEqual({
      id: 2,
      entityId: 1,
      symbol: 'MSFT',
      region: 'US',
      name: 'Microsoft Corp',
      isDelisted: false,
      ...emptyProps,
    })
    const empty = await ticker.getByUK(1, 'US', 'RANDOM')
    expect(empty).toBe(null)
  })
})

describe('#update', () => {
  test('could update', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const info = {
      firstPriceDate: '2001-01-01',
      lastPriceDate: '2002-02-02',
      firstFinancialQuarter: '2005-03',
      lastFinancialQuarter: '2005-06',
      firstFinancialYear: '2007-07',
      lastFinancialYear: '2008-12',
    }
    const result = await ticker.update(3, info, transaction)
    await transaction.commit()
    const basic = { symbol: 'GOOG', region: 'US', name: 'Google', isDelisted: false }
    expect(result).toStrictEqual({ id: 3, entityId: 2, ...info, ...basic })
    const record = await ticker.getByUK(2, 'US', 'GOOG')
    expect(record).toStrictEqual({ id: 3, entityId: 2, ...info, ...basic })
  })
})
