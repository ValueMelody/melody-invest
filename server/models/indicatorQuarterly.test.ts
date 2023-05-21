
import * as databaseAdapter from 'adapters/database'
import * as indicatorQuarterly from './indicatorQuarterly'

beforeAll(async () => {
  databaseAdapter.initConnection()
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
  seasonalGDP: 11111111,
  seasonalGDPQoQ: 1.11,
  seasonalGDPYoY: -2.22,
}

const record2 = {
  id: 2,
  quarter: '2022-03',
  seasonalGDP: 11113333,
  seasonalGDPQoQ: 2.22,
  seasonalGDPYoY: 3.33,
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
      seasonalGDP: '11113333',
    }, transaction)
    await transaction.commit()
    const result = {
      id: 3,
      quarter: '2022-06',
      seasonalGDP: 11113333,
      seasonalGDPQoQ: null,
      seasonalGDPYoY: null,
    }
    expect(created).toStrictEqual(result)
    const record = await indicatorQuarterly.getByUK('2022-06')
    expect(record).toStrictEqual(result)

    const transaction1 = await databaseAdapter.createTransaction()
    const created1 = await indicatorQuarterly.create({
      quarter: '2022-09',
    }, transaction1)
    await transaction1.commit()
    const result1 = {
      id: 4,
      quarter: '2022-09',
      seasonalGDP: null,
      seasonalGDPQoQ: null,
      seasonalGDPYoY: null,
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
      seasonalGDP: '33333333',
      seasonalGDPQoQ: '1.22',
      seasonalGDPYoY: '2.33',
    }, transaction)
    await transaction.commit()
    const result = {
      id: 2,
      quarter: '2022-03',
      seasonalGDP: 33333333,
      seasonalGDPQoQ: 1.22,
      seasonalGDPYoY: 2.33,
    }
    expect(updated).toStrictEqual(result)
    const record = await indicatorQuarterly.getByUK('2022-03')
    expect(record).toStrictEqual(result)
  })
})
