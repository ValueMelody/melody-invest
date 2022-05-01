import * as indicatorYearly from './indicatorYearly'
import * as databaseAdapter from '../adapters/database'

beforeAll(async () => {
  databaseAdapter.initTestConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'indicator_yearly.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'indicator_yearly.js',
  })
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

const record1 = {
  id: 1,
  year: '2020',
  realGDP: 11111111,
  inflation: 2.22,
  gdpYearlyChangePercent: 1.11,
  inflationYearlyIncrease: 2,
  inflationYearlyDecrease: 0,
}

const record2 = {
  id: 2,
  year: '2021',
  realGDP: 11112222,
  inflation: 1.22,
  gdpYearlyChangePercent: null,
  inflationYearlyIncrease: null,
  inflationYearlyDecrease: null,
}

describe('#getByUK', () => {
  test('could get by UK', async () => {
    const result1 = await indicatorYearly.getByUK('2020')
    expect(result1).toStrictEqual(record1)
    const result2 = await indicatorYearly.getByUK('2021')
    expect(result2).toStrictEqual(record2)
    const result3 = await indicatorYearly.getByUK('2022')
    expect(result3).toBe(null)
  })
})

describe('#getAll', () => {
  test('could get all', async () => {
    const result = await indicatorYearly.getAll()
    expect(result).toStrictEqual([record1, record2])
  })
})

describe('#getPublishedByDate', () => {
  test('could get published by date', async () => {
    const result1 = await indicatorYearly.getPublishedByDate('2020-12-31')
    expect(result1).toBe(null)
    const result2 = await indicatorYearly.getPublishedByDate('2021-03-31')
    expect(result2).toBe(null)
    const result3 = await indicatorYearly.getPublishedByDate('2021-04-01')
    expect(result3).toStrictEqual(record1)
    const result4 = await indicatorYearly.getPublishedByDate('2022-03-31')
    expect(result4).toStrictEqual(record1)
    const result5 = await indicatorYearly.getPublishedByDate('2022-04-01')
    expect(result5).toStrictEqual(record2)
    const result6 = await indicatorYearly.getPublishedByDate('2023-03-31')
    expect(result6).toStrictEqual(record2)
    const result7 = await indicatorYearly.getPublishedByDate('2023-04-01')
    expect(result7).toBe(null)
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await indicatorYearly.create({
      year: '2022',
      realGDP: '1111333',
      inflation: '2.33',
    }, transaction)
    await transaction.commit()
    const result = {
      id: 3,
      year: '2022',
      realGDP: 1111333,
      inflation: 2.33,
      gdpYearlyChangePercent: null,
      inflationYearlyIncrease: null,
      inflationYearlyDecrease: null,
    }
    expect(created).toStrictEqual(result)
    const record = await indicatorYearly.getByUK('2022')
    expect(record).toStrictEqual(result)
  })
})

describe('#update', () => {
  test('could update', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const updated = await indicatorYearly.update(2, {
      gdpYearlyChangePercent: '3.33',
      inflationYearlyIncrease: 2,
      inflationYearlyDecrease: 0,
    }, transaction)
    const result = {
      id: 2,
      year: '2021',
      realGDP: 11112222,
      inflation: 1.22,
      gdpYearlyChangePercent: 3.33,
      inflationYearlyIncrease: 2,
      inflationYearlyDecrease: 0,
    }
    await transaction.commit()
    expect(updated).toStrictEqual(result)
    const record = await indicatorYearly.getByUK('2021')
    expect(record).toStrictEqual(result)
  })
})
