
import * as databaseAdapter from 'adapters/database'
import * as indicatorYearly from './indicatorYearly'

beforeAll(async () => {
  databaseAdapter.initConnection()
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
  gdp: 11111111,
  annualInflation: 2.22,
  gdpYearlyChangePercent: 1.11,
  inflationYearlyIncrease: 2,
  inflationYearlyDecrease: 0,
  gdpYearlyIncrease: null,
  gdpYearlyDecrease: null,
}

const record2 = {
  id: 2,
  year: '2021',
  gdp: 11112222,
  annualInflation: 1.22,
  gdpYearlyChangePercent: null,
  inflationYearlyIncrease: null,
  inflationYearlyDecrease: null,
  gdpYearlyIncrease: null,
  gdpYearlyDecrease: null,
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

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await indicatorYearly.create({
      year: '2022',
      gdp: '1111333',
      annualInflation: '2.33',
    }, transaction)
    await transaction.commit()
    const result = {
      id: 3,
      year: '2022',
      gdp: 1111333,
      annualInflation: 2.33,
      gdpYearlyChangePercent: null,
      inflationYearlyIncrease: null,
      inflationYearlyDecrease: null,
      gdpYearlyIncrease: null,
      gdpYearlyDecrease: null,
    }
    expect(created).toStrictEqual(result)
    const record = await indicatorYearly.getByUK('2022')
    expect(record).toStrictEqual(result)

    const transaction1 = await databaseAdapter.createTransaction()
    const created1 = await indicatorYearly.create({
      year: '2023',
    }, transaction1)
    await transaction1.commit()
    const result1 = {
      id: 4,
      year: '2023',
      gdp: null,
      annualInflation: null,
      gdpYearlyChangePercent: null,
      inflationYearlyIncrease: null,
      inflationYearlyDecrease: null,
      gdpYearlyIncrease: null,
      gdpYearlyDecrease: null,
    }
    expect(created1).toStrictEqual(result1)
    const record1 = await indicatorYearly.getByUK('2023')
    expect(record1).toStrictEqual(result1)
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
      gdp: 11112222,
      annualInflation: 1.22,
      gdpYearlyChangePercent: 3.33,
      inflationYearlyIncrease: 2,
      inflationYearlyDecrease: 0,
      gdpYearlyIncrease: null,
      gdpYearlyDecrease: null,
    }
    await transaction.commit()
    expect(updated).toStrictEqual(result)
    const record = await indicatorYearly.getByUK('2021')
    expect(record).toStrictEqual(result)
  })
})
