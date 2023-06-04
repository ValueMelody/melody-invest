import * as dailyTickers from './dailyTickers'
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
    name: 'daily_tickers.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'daily_tickers.js',
  })
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#getLatestDate', () => {
  test('could get latest date', async () => {
    const date = await dailyTickers.getLatestDate()
    expect(date).toEqual('2022-01-01')
  })
})

describe('#getByUK', () => {
  test('could get by UK', async () => {
    const record1 = await dailyTickers.getByUK(1, '2021-12-31')
    expect(record1?.id).toBe(undefined)
    const record2 = await dailyTickers.getByUK(1, '2021-12-30')
    expect(record2).toBeNull()

    const record3 = await dailyTickers.getByUK(1, '2022-01-01')
    expect(record3?.id).toBe(1)
    expect(record3?.date).toBe('2022-01-01')

    const record4 = await dailyTickers.getByUK(1, '2022-01-02')
    expect(record4).toBeNull()
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await dailyTickers.create({
      entityId: 2,
      date: '2022-01-02',
      tickerInfos: {},
      priceInfo: {},
    }, transaction)
    await transaction.commit()
    expect(created.id).toBe(2)
    expect(created.entityId).toBe(2)
    expect(created.date).toBe('2022-01-02')

    const record = await dailyTickers.getByUK(2, '2022-01-02')
    expect(record?.id).toBe(2)
    expect(record?.entityId).toBe(2)
    expect(record?.date).toBe('2022-01-02')
  })
})

describe('#destroyAll', () => {
  test('could destroy all', async () => {
    const transaction = await databaseAdapter.createTransaction()
    await dailyTickers.destroyAll(transaction)
    await transaction.commit()
    const record = await dailyTickers.getByUK(2, '2021-12-31')
    expect(record).toBeNull()
    const date = await dailyTickers.getLatestDate()
    expect(date).toBe('2001-01-01')
  })
})
