import * as indicatorQuarterly from './indicatorQuarterly'
import * as databaseAdapter from '../adapters/database'

beforeAll(async () => {
  databaseAdapter.initTestConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'indicator_quarterly.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'indicator_quarterly.js',
  })
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

const record1 = {
  id: 1,
  quarter: '2021-12',
  reportMonth: '2022-03',
  realGDP: 11111111,
  gdpQuarterlyChangePercent: 1.11,
  gdpQuarterlyYoYChangePercent: -2.22,
}

const record2 = {
  id: 2,
  quarter: '2022-03',
  reportMonth: '2022-04',
  realGDP: 11113333,
  gdpQuarterlyChangePercent: 2.22,
  gdpQuarterlyYoYChangePercent: 3.33,
}

describe('#getByUK', () => {
  test('could get by UK', async () => {
    const result1 = await indicatorQuarterly.getByUK('2021-12')
    expect(result1).toStrictEqual(record1)
    const result2 = await indicatorQuarterly.getByUK('2022-03')
    expect(result2).toStrictEqual(record2)
    const result3 = await indicatorQuarterly.getByUK('2022-06')
    expect(result3).toBe(null)
  })
})

describe('#getAll', () => {
  test('could get all', async () => {
    const results = await indicatorQuarterly.getAll()
    expect(results.length).toBe(2)
    expect(results[0]).toStrictEqual(record1)
    expect(results[1]).toStrictEqual(record2)
  })
})

describe('#getPublishedByDate', () => {
  test('could get published by date', async () => {
    const result1 = await indicatorQuarterly.getPublishedByDate('2022-01-30')
    expect(result1).toBe(null)
    const result2 = await indicatorQuarterly.getPublishedByDate('2022-01-31')
    expect(result2).toStrictEqual(record1)
    const result3 = await indicatorQuarterly.getPublishedByDate('2022-03-30')
    expect(result3).toStrictEqual(record1)
    const result4 = await indicatorQuarterly.getPublishedByDate('2022-04-30')
    expect(result4).toStrictEqual(record1)
    const result5 = await indicatorQuarterly.getPublishedByDate('2022-05-01')
    expect(result5).toStrictEqual(record2)
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await indicatorQuarterly.create({
      quarter: '2022-06',
      reportMonth: '2022-04',
      realGDP: '11113333',
    }, transaction)
    await transaction.commit()
    const result = {
      id: 3,
      quarter: '2022-06',
      reportMonth: '2022-04',
      realGDP: 11113333,
      gdpQuarterlyChangePercent: null,
      gdpQuarterlyYoYChangePercent: null,
    }
    expect(created).toStrictEqual(result)
    const record = await indicatorQuarterly.getByUK('2022-06')
    expect(record).toStrictEqual(result)

    const transaction1 = await databaseAdapter.createTransaction()
    const created1 = await indicatorQuarterly.create({
      quarter: '2022-09',
      reportMonth: '2022-10',
    }, transaction1)
    await transaction1.commit()
    const result1 = {
      id: 4,
      quarter: '2022-09',
      reportMonth: '2022-10',
      realGDP: null,
      gdpQuarterlyChangePercent: null,
      gdpQuarterlyYoYChangePercent: null,
    }
    expect(created1).toStrictEqual(result1)
    const record1 = await indicatorQuarterly.getByUK('2022-09')
    expect(record1).toStrictEqual(result1)
  })
})

describe('update', () => {
  test('could update', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const updated = await indicatorQuarterly.update(2, {
      realGDP: '33333333',
      gdpQuarterlyChangePercent: '1.22',
      gdpQuarterlyYoYChangePercent: '2.33',
    }, transaction)
    await transaction.commit()
    const result = {
      id: 2,
      quarter: '2022-03',
      reportMonth: '2022-04',
      realGDP: 33333333,
      gdpQuarterlyChangePercent: 1.22,
      gdpQuarterlyYoYChangePercent: 2.33,
    }
    expect(updated).toStrictEqual(result)
    const record = await indicatorQuarterly.getByUK('2022-03')
    expect(record).toStrictEqual(result)
  })
})
