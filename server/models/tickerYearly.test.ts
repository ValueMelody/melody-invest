import * as tickerYearly from './tickerYearly'
import * as databaseAdapter from '../adapters/database'

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
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'ticker_yearly.js',
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
    specific: 'ticker_yearly.js',
  })
})

afterAll(async () => {
  const db = databaseAdapter.getConnection()
  await db.destroy()
})

describe('#getLatest', () => {
  test('could get latest', async () => {
    const result1 = await tickerYearly.getLatest(1)
    expect(result1).toStrictEqual({
      id: 3,
      tickerId: 1,
      year: '2022',
      earningDate: '2022-09-30',
      eps: null,
      ebitda: 615555555555,
      netIncome: 413333333333,
      grossProfit: 201111111111,
      totalRevenue: 817777777777,
      costOfRevenue: 514444444444,
      profitYearlyIncrease: 0,
      profitYearlyDecrease: 1,
      revenueYearlyIncrease: 0,
      revenueYearlyDecrease: 1,
      incomeYearlyIncrease: 0,
      incomeYearlyDecrease: 1,
    })

    const result2 = await tickerYearly.getLatest(1, [{ key: 'eps', type: 'IS NOT', value: null }])
    expect(result2).toStrictEqual({
      id: 2,
      tickerId: 1,
      year: '2021',
      earningDate: '2021-09-30',
      eps: 1.2,
      ebitda: 655555555555,
      netIncome: 433333333333,
      grossProfit: 211111111111,
      totalRevenue: 877777777777,
      costOfRevenue: 544444444444,
      profitYearlyIncrease: 1,
      profitYearlyDecrease: 0,
      revenueYearlyIncrease: 1,
      revenueYearlyDecrease: 0,
      incomeYearlyIncrease: 1,
      incomeYearlyDecrease: 0,
    })

    const result3 = await tickerYearly.getLatest(2)
    expect(result3).toStrictEqual({
      id: 4,
      tickerId: 2,
      year: '2020',
      earningDate: '2020-06-30',
      eps: 1.2,
      ebitda: 300000000,
      netIncome: 200000000,
      grossProfit: 500000000,
      totalRevenue: 800000000,
      costOfRevenue: 300000000,
      profitYearlyIncrease: 2,
      profitYearlyDecrease: 0,
      revenueYearlyIncrease: 0,
      revenueYearlyDecrease: 3,
      incomeYearlyIncrease: 4,
      incomeYearlyDecrease: 0,
    })

    const result4 = await tickerYearly.getLatest(3)
    expect(result4).toBeNull()
  })
})

describe('#getRawByUK', () => {
  test('could get raw by UK', async () => {
    const result1 = await tickerYearly.getRawByUK(1, '2020')
    expect(result1).toStrictEqual({
      id: 1,
      tickerId: 1,
      year: '2020',
      earningDate: '2020-09-30',
      eps: '0.9',
      ebitda: '555555555555',
      netIncome: '333333333333',
      grossProfit: '111111111111',
      totalRevenue: '777777777777',
      costOfRevenue: '444444444444',
      profitYearlyIncrease: null,
      profitYearlyDecrease: null,
      revenueYearlyIncrease: null,
      revenueYearlyDecrease: null,
      incomeYearlyIncrease: null,
      incomeYearlyDecrease: null,
    })
    const result2 = await tickerYearly.getRawByUK(1, '2021')
    expect(result2).toStrictEqual({
      id: 2,
      tickerId: 1,
      year: '2021',
      earningDate: '2021-09-30',
      eps: '1.2',
      ebitda: '655555555555',
      netIncome: '433333333333',
      grossProfit: '211111111111',
      totalRevenue: '877777777777',
      costOfRevenue: '544444444444',
      profitYearlyIncrease: 1,
      profitYearlyDecrease: 0,
      revenueYearlyIncrease: 1,
      revenueYearlyDecrease: 0,
      incomeYearlyIncrease: 1,
      incomeYearlyDecrease: 0,
    })

    const result3 = await tickerYearly.getRawByUK(1, '2023')
    expect(result3).toBeNull()
  })
})
