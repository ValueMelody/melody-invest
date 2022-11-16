import * as databaseAdapter from 'adapters/database'
import * as tickerYearly from './tickerYearly'

beforeAll(async () => {
  databaseAdapter.initConnection()
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

describe('#getByUK', () => {
  test('could get by UK', async () => {
    const result1 = await tickerYearly.getByUK(1, '2020')
    expect(result1).toStrictEqual({
      id: 1,
      tickerId: 1,
      year: '2020',
      earningDate: '2020-09-30',
      eps: 0.9,
      ebitda: 555555555555,
      netIncome: 333333333333,
      grossProfit: 111111111111,
      totalRevenue: 777777777777,
      costOfRevenue: 444444444444,
      profitYearlyIncrease: null,
      profitYearlyDecrease: null,
      revenueYearlyIncrease: null,
      revenueYearlyDecrease: null,
      incomeYearlyIncrease: null,
      incomeYearlyDecrease: null,
    })
    const result2 = await tickerYearly.getByUK(1, '2021')
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

    const result3 = await tickerYearly.getByUK(1, '2023')
    expect(result3).toBeNull()
  })
})

describe('#getAll', () => {
  test('could get all', async () => {
    const result1 = await tickerYearly.getAll(1)
    expect(result1.length).toBe(3)
    const result2 = await tickerYearly.getAll(2)
    expect(result2.length).toBe(1)
    const result3 = await tickerYearly.getAll(3)
    expect(result3.length).toBe(0)
  })
})

describe('#getPublishedByDate', () => {
  test('could get published by date', async () => {
    const result1 = await tickerYearly.getPublishedByDate('2021-04-01')
    expect(result1.length).toBe(2)
    expect(result1[0].id).toBe(1)
    expect(result1[1].id).toBe(4)

    const result2 = await tickerYearly.getPublishedByDate('2022-03-31')
    expect(result2.length).toBe(2)
    expect(result2[0].id).toBe(1)
    expect(result2[1].id).toBe(4)

    const result3 = await tickerYearly.getPublishedByDate('2022-04-01')
    expect(result3.length).toBe(1)
    expect(result3[0].id).toBe(2)

    const result4 = await tickerYearly.getPublishedByDate('2023-04-01')
    expect(result4.length).toBe(1)
    expect(result4[0].id).toBe(3)

    const result5 = await tickerYearly.getPublishedByDate('2024-04-01')
    expect(result5.length).toBe(0)
  })
})

describe('#create', () => {
  test('could create', async () => {
    const emptyProps = {
      profitYearlyIncrease: null,
      profitYearlyDecrease: null,
      revenueYearlyIncrease: null,
      revenueYearlyDecrease: null,
      incomeYearlyIncrease: null,
      incomeYearlyDecrease: null,
    }

    const transaction1 = await databaseAdapter.createTransaction()
    const created1 = await tickerYearly.create({
      tickerId: 3,
      year: '2020',
      earningDate: '2020-09-01',
      eps: '3.11',
      ebitda: '111111',
      netIncome: '222222',
      grossProfit: '333333',
      totalRevenue: '444444',
      costOfRevenue: '555555',
    }, transaction1)
    await transaction1.commit()
    const result1 = {
      id: 5,
      tickerId: 3,
      year: '2020',
      earningDate: '2020-09-01',
      eps: 3.11,
      ebitda: 111111,
      netIncome: 222222,
      grossProfit: 333333,
      totalRevenue: 444444,
      costOfRevenue: 555555,
      ...emptyProps,
    }
    expect(created1).toStrictEqual(result1)
    const record1 = await tickerYearly.getByUK(3, '2020')
    expect(record1).toStrictEqual(result1)

    const transaction2 = await databaseAdapter.createTransaction()
    const created2 = await tickerYearly.create({
      tickerId: 3,
      year: '2021',
      earningDate: '2021-09-01',
      eps: '2.11',
    }, transaction2)
    await transaction2.commit()
    const result2 = {
      id: 6,
      tickerId: 3,
      year: '2021',
      earningDate: '2021-09-01',
      eps: 2.11,
      ebitda: null,
      netIncome: null,
      grossProfit: null,
      totalRevenue: null,
      costOfRevenue: null,
      ...emptyProps,
    }
    expect(created2).toStrictEqual(result2)
    const record2 = await tickerYearly.getByUK(3, '2021')
    expect(record2).toStrictEqual(result2)
  })
})

describe('#update', () => {
  test('could update', async () => {
    const transaction1 = await databaseAdapter.createTransaction()
    const movementProps = {
      profitYearlyIncrease: 1,
      profitYearlyDecrease: 2,
      revenueYearlyIncrease: 3,
      revenueYearlyDecrease: 4,
      incomeYearlyIncrease: 5,
      incomeYearlyDecrease: 6,
    }
    const updated1 = await tickerYearly.update(5, movementProps, transaction1)
    await transaction1.commit()
    const result1 = {
      id: 5,
      tickerId: 3,
      year: '2020',
      earningDate: '2020-09-01',
      eps: 3.11,
      ebitda: 111111,
      netIncome: 222222,
      grossProfit: 333333,
      totalRevenue: 444444,
      costOfRevenue: 555555,
      ...movementProps,
    }
    expect(updated1).toStrictEqual(result1)
    const record1 = await tickerYearly.getByUK(3, '2020')
    expect(record1).toStrictEqual(result1)

    const transaction2 = await databaseAdapter.createTransaction()
    const updated2 = await tickerYearly.update(6, {
      ebitda: '10000',
      netIncome: '200000',
      grossProfit: '300000',
      totalRevenue: '400000',
      costOfRevenue: '500000',
    }, transaction2)
    await transaction2.commit()
    const result2 = {
      id: 6,
      tickerId: 3,
      year: '2021',
      earningDate: '2021-09-01',
      eps: 2.11,
      ebitda: 10000,
      netIncome: 200000,
      grossProfit: 300000,
      totalRevenue: 400000,
      costOfRevenue: 500000,
      profitYearlyIncrease: null,
      profitYearlyDecrease: null,
      revenueYearlyIncrease: null,
      revenueYearlyDecrease: null,
      incomeYearlyIncrease: null,
      incomeYearlyDecrease: null,
    }
    expect(updated2).toStrictEqual(result2)
    const record2 = await tickerYearly.getByUK(3, '2021')
    expect(record2).toStrictEqual(result2)
  })
})
