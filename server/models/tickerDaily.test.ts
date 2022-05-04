import * as tickerDaily from './tickerDaily'
import * as databaseAdapter from '../adapters/database'
import * as cacheAdapter from '../adapters/cache'
import * as cacheTool from '../tools/cache'

beforeAll(async () => {
  databaseAdapter.initTestConnection()
  cacheAdapter.initTestConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'ticker_category.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'ticker.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'ticker_daily.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'ticker_category.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'ticker.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'ticker_daily.js',
  })
})

afterAll(async () => {
  const db = databaseAdapter.getConnection()
  await db.destroy()
  await cacheAdapter.empty()
})

describe('#getByUK', () => {
  test('could get by UK', async () => {
    const result1 = await tickerDaily.getByUK(1, '2021-12-31')
    expect(result1?.tickerId).toBe(1)
    expect(result1?.date).toBe('2021-12-31')
    const result2 = await tickerDaily.getByUK(3, '2022-01-01')
    expect(result2?.tickerId).toBe(3)
    expect(result2?.date).toBe('2022-01-01')
  })
})

describe('#getPreviousOne', () => {
  test('could get previous', async () => {
    const result1 = await tickerDaily.getPreviousOne(1, '2022-01-06')
    expect(result1?.tickerId).toBe(1)
    expect(result1?.date).toBe('2022-01-04')
    const result2 = await tickerDaily.getPreviousOne(1, '2022-01-05')
    expect(result2?.tickerId).toBe(1)
    expect(result2?.date).toBe('2022-01-04')
    const result3 = await tickerDaily.getPreviousOne(1, '2022-01-04')
    expect(result3?.tickerId).toBe(1)
    expect(result3?.date).toBe('2022-01-03')
  })
})

describe('#getLatestDate', () => {
  test('could get lastest date', async () => {
    const result = await tickerDaily.getLatestDate()
    expect(result).toBe('2022-01-04')
  })
})

describe('#getAll', () => {
  test('could get all', async () => {
    const result1 = await tickerDaily.getAll(1)
    expect(result1.length).toBe(5)
    const result2 = await tickerDaily.getAll(2)
    expect(result2.length).toBe(2)
    const result3 = await tickerDaily.getAll(3)
    expect(result3.length).toBe(1)
  })
})

describe('#getNearestPricesByDate', () => {
  test('could get nearest prices by date', async () => {
    const cacheKey1 = cacheTool.generateTickerPricesKey('2021-12-30')
    const cacheKey2 = cacheTool.generateTickerPricesKey('2022-01-01')
    const cacheKey3 = cacheTool.generateTickerPricesKey('2022-01-03')
    expect(await cacheAdapter.get(cacheKey1)).toBe(null)
    expect(await cacheAdapter.get(cacheKey2)).toBe(null)
    expect(await cacheAdapter.get(cacheKey3)).toBe(null)

    const result1 = await tickerDaily.getNearestPricesByDate('2021-12-30')
    expect(result1).toStrictEqual({})
    const cacheResult1 = await cacheAdapter.get(cacheKey1)
    expect(JSON.parse(cacheResult1!)).toStrictEqual({})

    const result2 = await tickerDaily.getNearestPricesByDate('2021-12-31')
    expect(result2).toStrictEqual({ 1: 100, 2: 32 })

    const result3 = await tickerDaily.getNearestPricesByDate('2022-01-01')
    expect(result3).toStrictEqual({ 1: 105, 2: 32, 3: 1111 })
    const cacheResult2 = await cacheAdapter.get(cacheKey2)
    expect(JSON.parse(cacheResult2!)).toStrictEqual({ 1: 105, 2: 32, 3: 1111 })

    const result4 = await tickerDaily.getNearestPricesByDate('2022-01-02')
    expect(result4).toStrictEqual({ 1: 107, 2: 40, 3: 1111 })

    const result5 = await tickerDaily.getNearestPricesByDate('2022-01-03')
    expect(result5).toStrictEqual({ 1: 100, 2: 40, 3: 1111 })
    const cacheResult3 = await cacheAdapter.get(cacheKey3)
    expect(JSON.parse(cacheResult3!)).toStrictEqual({ 1: 100, 2: 40, 3: 1111 })
  })
})

describe('#getByDate', () => {
  test('could get by date', async () => {
    const result1 = await tickerDaily.getByDate('2021-12-30')
    expect(result1.length).toBe(0)

    const result2 = await tickerDaily.getByDate('2021-12-31')
    expect(result2.length).toBe(2)
    expect(result2[0].tickerId).toBe(1)
    expect(result2[0].date).toBe('2021-12-31')
    expect(result2[1].tickerId).toBe(2)
    expect(result2[1].date).toBe('2021-12-31')

    const result3 = await tickerDaily.getByDate('2022-01-01')
    expect(result3.length).toBe(2)
    expect(result3[0].tickerId).toBe(1)
    expect(result3[0].date).toBe('2022-01-01')
    expect(result3[1].tickerId).toBe(3)
    expect(result3[1].date).toBe('2022-01-01')

    const result4 = await tickerDaily.getByDate('2022-01-02')
    expect(result4.length).toBe(2)
    expect(result4[0].tickerId).toBe(1)
    expect(result4[0].date).toBe('2022-01-02')
    expect(result4[1].tickerId).toBe(2)
    expect(result4[0].date).toBe('2022-01-02')
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await tickerDaily.create({
      tickerId: 2,
      date: '2022-02-02',
      volume: '222222',
      closePrice: 30,
      splitMultiplier: '3.0000',
      dividendAmount: '1.11',
    }, transaction)
    await transaction.commit()
    const result = {
      id: 9,
      tickerId: 2,
      date: '2022-02-02',
      volume: '222222',
      closePrice: 30,
      splitMultiplier: 3,
      dividendAmount: 1.11,
      weeklyAverageFinalPrice: null,
      monthlyAverageFinalPrice: null,
      quarterlyAverageFinalPrice: null,
      yearlyAverageFinalPrice: null,
      priceDailyIncrease: null,
      priceDailyDecrease: null,
      priceWeeklyIncrease: null,
      priceWeeklyDecrease: null,
      priceMonthlyIncrease: null,
      priceMonthlyDecrease: null,
      priceQuarterlyIncrease: null,
      priceQuarterlyDecrease: null,
      priceYearlyIncrease: null,
      priceYearlyDecrease: null,
    }
    expect(created).toStrictEqual(result)
    const record = await tickerDaily.getByUK(2, '2022-02-02')
    expect(record).toStrictEqual(result)
  })
})

describe('#update', () => {
  test('could update', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const props = {
      weeklyAverageFinalPrice: 92,
      monthlyAverageFinalPrice: 93,
      quarterlyAverageFinalPrice: 94,
      yearlyAverageFinalPrice: 95,
      priceDailyIncrease: 1,
      priceDailyDecrease: 2,
      priceWeeklyIncrease: 3,
      priceWeeklyDecrease: 4,
      priceMonthlyIncrease: 5,
      priceMonthlyDecrease: 6,
      priceQuarterlyIncrease: 7,
      priceQuarterlyDecrease: 8,
      priceYearlyIncrease: 9,
      priceYearlyDecrease: 10,
    }
    const created = await tickerDaily.update(9, props, transaction)
    await transaction.commit()
    const result = {
      id: 9,
      tickerId: 2,
      date: '2022-02-02',
      volume: '222222',
      closePrice: 30,
      splitMultiplier: 3,
      dividendAmount: 1.11,
      ...props,
    }
    expect(created).toStrictEqual(result)
    const record = await tickerDaily.getByUK(2, '2022-02-02')
    expect(record).toStrictEqual(result)
  })
})
