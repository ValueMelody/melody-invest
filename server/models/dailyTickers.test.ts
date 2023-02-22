import * as dailyTickers from './dailyTickers'
import * as databaseAdapter from 'adapters/database'
import * as interfaces from '@shared/interfaces'
import { instance, mock } from 'ts-mockito'

beforeAll(async () => {
  databaseAdapter.initConnection()
  const connection = databaseAdapter.getConnection()
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
    const record1 = await dailyTickers.getByUK('2021-12-31')
    expect(record1?.id).toBe(1)
    expect(record1?.date).toBe('2021-12-31')

    const record2 = await dailyTickers.getByUK('2021-12-30')
    expect(record2).toBeNull()

    const record3 = await dailyTickers.getByUK('2022-01-01')
    expect(record3?.id).toBe(2)
    expect(record3?.date).toBe('2022-01-01')

    const record4 = await dailyTickers.getByUK('2022-01-02')
    expect(record4).toBeNull()
  })

  test('could only return selected columns', async () => {
    const result1 = await dailyTickers.getByUK('2021-12-31', 'tickers')
    expect(result1?.tickers).toBeTruthy()
    expect(result1?.nearestPrices).toBeFalsy()

    const result2 = await dailyTickers.getByUK('2021-12-31', 'nearestPrices')
    expect(result2?.nearestPrices).toBeTruthy()
    expect(result2?.tickers).toBeFalsy()
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await dailyTickers.create({
      date: '2022-01-02',
      tickers: {},
      nearestPrices: {},
    }, transaction)
    await transaction.commit()
    expect(created.id).toBe(3)
    expect(created.date).toBe('2022-01-02')

    const record = await dailyTickers.getByUK('2022-01-02')
    expect(record?.id).toBe(3)
    expect(record?.date).toBe('2022-01-02')
  })
})

describe('#update', () => {
  test('could update', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const dailyTickerMock: interfaces.dailyTickersModel.DailyTicker = mock({})
    const dailyTicker = instance(dailyTickerMock)
    const tickers = {
      1: dailyTicker,
    }
    const prices = {
      1: 100,
    }
    const updated = await dailyTickers.update(3, { tickers, nearestPrices: prices }, transaction)
    await transaction.commit()
    expect(updated.id).toBe(3)
    expect(updated.date).toBe('2022-01-02')
    expect(updated.tickers).toStrictEqual(JSON.stringify(tickers))
    expect(updated.nearestPrices).toStrictEqual(JSON.stringify(prices))

    const record = await dailyTickers.getByUK('2022-01-02')
    expect(record?.id).toBe(3)
    expect(record?.date).toBe('2022-01-02')
    expect(record?.tickers).toStrictEqual(JSON.stringify(tickers))
    expect(record?.nearestPrices).toStrictEqual(JSON.stringify(prices))
  })
})

describe('#upsert', () => {
  test('could upsert', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const dailyTickerMock: interfaces.dailyTickersModel.DailyTicker = mock({})

    const tickers = {
      1: instance(dailyTickerMock),
      2: instance(dailyTickerMock),
    }
    const prices = {
      1: 100,
      2: 200,
    }
    const updated = await dailyTickers.upsert('2022-01-02', { tickers, nearestPrices: prices }, transaction)
    await transaction.commit()
    expect(updated.id).toBe(3)
    expect(updated.date).toBe('2022-01-02')
    expect(updated.tickers).toStrictEqual(JSON.stringify(tickers))
    expect(updated.nearestPrices).toStrictEqual(JSON.stringify(prices))

    const record = await dailyTickers.getByUK('2022-01-02')
    expect(record?.id).toBe(3)
    expect(record?.date).toBe('2022-01-02')
    expect(record?.tickers).toStrictEqual(JSON.stringify(tickers))
    expect(record?.nearestPrices).toStrictEqual(JSON.stringify(prices))

    const transaction1 = await databaseAdapter.createTransaction()
    const created = await dailyTickers.upsert('2022-01-03', { tickers, nearestPrices: prices }, transaction1)
    await transaction1.commit()
    expect(created.id).toBe(4)
    expect(created.date).toBe('2022-01-03')
    expect(created.tickers).toBe(JSON.stringify(tickers))
    expect(created.nearestPrices).toStrictEqual(JSON.stringify(prices))

    const record1 = await dailyTickers.getByUK('2022-01-03')
    expect(record1?.id).toBe(4)
    expect(record1?.date).toBe('2022-01-03')
    expect(record1?.tickers).toStrictEqual(JSON.stringify(tickers))
    expect(record1?.nearestPrices).toStrictEqual(JSON.stringify(prices))
  })
})

describe('#destroyAll', () => {
  test('could destroy all', async () => {
    const transaction = await databaseAdapter.createTransaction()
    await dailyTickers.destroyAll(transaction)
    await transaction.commit()
    const record = await dailyTickers.getByUK('2021-12-31')
    expect(record).toBeNull()
    const date = await dailyTickers.getLatestDate()
    expect(date).toBe('2001-01-01')
  })
})
