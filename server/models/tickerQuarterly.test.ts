import * as tickerQuarterly from './tickerQuarterly'
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
    name: 'ticker_quarterly.js',
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
    specific: 'ticker_quarterly.js',
  })
})

afterAll(async () => {
  const db = databaseAdapter.getConnection()
  await db.destroy()
})

describe('#getRawByUK', () => {
  test('could get raw by UK', async () => {
    const result1 = await tickerQuarterly.getRawByUK(1, '2021-12')
    expect(result1).toStrictEqual({
      id: 1,
      tickerId: 1,
      quarter: '2021-12',
      earningDate: '2021-12-31',
      earningReportDate: '2022-01-15',
      eps: '0.05',
      estimatedEPS: '0.03',
      epsSurprisePercent: '25',
      ebitda: '1111111111',
      netIncome: '1000000000',
      grossProfit: '555555555',
      totalRevenue: '150000000000',
      costOfRevenue: '888888888',
      epsQuarterlyBeat: 2,
      epsQuarterlyMiss: 0,
      profitQuarterlyIncrease: 1,
      profitQuarterlyDecrease: 0,
      revenueQuarterlyIncrease: 0,
      revenueQuarterlyDecrease: 0,
      incomeQuarterlyIncrease: 1,
      incomeQuarterlyDecrease: 0,
    })
    const result2 = await tickerQuarterly.getRawByUK(1, '2022-06')
    expect(result2).toStrictEqual({
      id: 3,
      tickerId: 1,
      quarter: '2022-06',
      earningDate: '2021-06-30',
      earningReportDate: '2022-07-17',
      eps: '0.05',
      estimatedEPS: '0.05',
      epsSurprisePercent: null,
      ebitda: '1200000000',
      netIncome: '99999999',
      grossProfit: '66666666',
      totalRevenue: '1500000000',
      costOfRevenue: '22222222',
      epsQuarterlyBeat: null,
      epsQuarterlyMiss: null,
      profitQuarterlyIncrease: null,
      profitQuarterlyDecrease: null,
      revenueQuarterlyIncrease: null,
      revenueQuarterlyDecrease: null,
      incomeQuarterlyIncrease: null,
      incomeQuarterlyDecrease: null,
    })

    const result3 = await tickerQuarterly.getRawByUK(1, '2022-12')
    expect(result3).toBeNull()
  })
})

describe('#getByUK', () => {
  test('could get by UK', async () => {
    const result1 = await tickerQuarterly.getByUK(1, '2021-12')
    expect(result1).toStrictEqual({
      id: 1,
      tickerId: 1,
      quarter: '2021-12',
      earningDate: '2021-12-31',
      earningReportDate: '2022-01-15',
      eps: 0.05,
      estimatedEPS: 0.03,
      epsSurprisePercent: 25,
      ebitda: 1111111111,
      netIncome: 1000000000,
      grossProfit: 555555555,
      totalRevenue: 150000000000,
      costOfRevenue: 888888888,
      epsQuarterlyBeat: 2,
      epsQuarterlyMiss: 0,
      profitQuarterlyIncrease: 1,
      profitQuarterlyDecrease: 0,
      revenueQuarterlyIncrease: 0,
      revenueQuarterlyDecrease: 0,
      incomeQuarterlyIncrease: 1,
      incomeQuarterlyDecrease: 0,
    })

    const result2 = await tickerQuarterly.getByUK(1, '2022-06')
    expect(result2).toStrictEqual({
      id: 3,
      tickerId: 1,
      quarter: '2022-06',
      earningDate: '2021-06-30',
      earningReportDate: '2022-07-17',
      eps: 0.05,
      estimatedEPS: 0.05,
      epsSurprisePercent: null,
      ebitda: 1200000000,
      netIncome: 99999999,
      grossProfit: 66666666,
      totalRevenue: 1500000000,
      costOfRevenue: 22222222,
      epsQuarterlyBeat: null,
      epsQuarterlyMiss: null,
      profitQuarterlyIncrease: null,
      profitQuarterlyDecrease: null,
      revenueQuarterlyIncrease: null,
      revenueQuarterlyDecrease: null,
      incomeQuarterlyIncrease: null,
      incomeQuarterlyDecrease: null,
    })

    const result3 = await tickerQuarterly.getByUK(1, '2022-12')
    expect(result3).toBeNull()
  })
})

describe('#getLatest', () => {
  test('could get latest', async () => {
    const result1 = await tickerQuarterly.getLatest(1)
    expect(result1).toStrictEqual({
      id: 3,
      tickerId: 1,
      quarter: '2022-06',
      earningDate: '2021-06-30',
      earningReportDate: '2022-07-17',
      eps: 0.05,
      estimatedEPS: 0.05,
      epsSurprisePercent: null,
      ebitda: 1200000000,
      netIncome: 99999999,
      grossProfit: 66666666,
      totalRevenue: 1500000000,
      costOfRevenue: 22222222,
      epsQuarterlyBeat: null,
      epsQuarterlyMiss: null,
      profitQuarterlyIncrease: null,
      profitQuarterlyDecrease: null,
      revenueQuarterlyIncrease: null,
      revenueQuarterlyDecrease: null,
      incomeQuarterlyIncrease: null,
      incomeQuarterlyDecrease: null,
    })

    const result2 = await tickerQuarterly.getLatest(2)
    expect(result2).toStrictEqual({
      id: 6,
      tickerId: 2,
      quarter: '2022-09',
      earningDate: '2022-10-30',
      earningReportDate: '2022-11-10',
      eps: 0.3,
      estimatedEPS: 0.6,
      epsSurprisePercent: -50,
      ebitda: 110000,
      netIncome: null,
      grossProfit: 150000,
      totalRevenue: 360000,
      costOfRevenue: 210000,
      epsQuarterlyBeat: 0,
      epsQuarterlyMiss: 1,
      profitQuarterlyIncrease: 0,
      profitQuarterlyDecrease: 1,
      revenueQuarterlyIncrease: 0,
      revenueQuarterlyDecrease: 1,
      incomeQuarterlyIncrease: null,
      incomeQuarterlyDecrease: null,
    })

    const result3 = await tickerQuarterly.getLatest(2, [{ key: 'netIncome', type: 'IS NOT', value: null }])
    expect(result3).toStrictEqual({
      id: 5,
      tickerId: 2,
      quarter: '2022-06',
      earningDate: '2021-07-31',
      earningReportDate: '2022-08-15',
      eps: 0.3,
      estimatedEPS: 0.25,
      epsSurprisePercent: 30,
      ebitda: 210000,
      netIncome: 110000,
      grossProfit: 310000,
      totalRevenue: 710000,
      costOfRevenue: 410000,
      epsQuarterlyBeat: 1,
      epsQuarterlyMiss: 0,
      profitQuarterlyIncrease: 1,
      profitQuarterlyDecrease: 0,
      revenueQuarterlyIncrease: 1,
      revenueQuarterlyDecrease: 0,
      incomeQuarterlyIncrease: 1,
      incomeQuarterlyDecrease: 0,
    })

    const result4 = await tickerQuarterly.getLatest(3)
    expect(result4).toBeNull()
  })
})

describe('#getAll', () => {
  test('could get all', async () => {
    const result1 = await tickerQuarterly.getAll(1)
    expect(result1.length).toBe(3)
    const result2 = await tickerQuarterly.getAll(2)
    expect(result2.length).toBe(3)
    const result3 = await tickerQuarterly.getAll(3)
    expect(result3.length).toBe(0)
  })
})

describe('#getPublishedByDate', () => {
  test('could get published by date', async () => {
    const result1 = await tickerQuarterly.getPublishedByDate('2022-01-16')
    expect(result1.length).toBe(1)
    expect(result1[0].id).toBe(1)

    const result2 = await tickerQuarterly.getPublishedByDate('2022-01-15')
    expect(result2.length).toBe(0)

    const result3 = await tickerQuarterly.getPublishedByDate('2022-05-12')
    expect(result3.length).toBe(1)
    expect(result3[0].id).toBe(2)

    const result4 = await tickerQuarterly.getPublishedByDate('2022-05-13')
    expect(result4.length).toBe(2)
    expect(result4[0].id).toBe(2)
    expect(result4[1].id).toBe(4)

    const result5 = await tickerQuarterly.getPublishedByDate('2023-03-31')
    expect(result5.length).toBe(0)
  })
})

describe('#create', () => {
  test('could create', async () => {
    const emptyProps = {
      profitQuarterlyIncrease: null,
      profitQuarterlyDecrease: null,
      revenueQuarterlyIncrease: null,
      revenueQuarterlyDecrease: null,
      incomeQuarterlyIncrease: null,
      incomeQuarterlyDecrease: null,
      epsQuarterlyBeat: null,
      epsQuarterlyMiss: null,
    }

    const transaction1 = await databaseAdapter.createTransaction()
    const created1 = await tickerQuarterly.create({
      tickerId: 3,
      quarter: '2021-03',
      earningDate: '2021-03-31',
      earningReportDate: '2021-04-15',
      eps: '1.23',
      estimatedEPS: '1.11',
      epsSurprisePercent: '15',
      ebitda: '3456',
      netIncome: '1234',
      grossProfit: '2345',
      totalRevenue: '5678',
      costOfRevenue: '4567',
    }, transaction1)
    await transaction1.commit()
    const result1 = {
      id: 7,
      tickerId: 3,
      quarter: '2021-03',
      earningDate: '2021-03-31',
      earningReportDate: '2021-04-15',
      eps: 1.23,
      estimatedEPS: 1.11,
      epsSurprisePercent: 15,
      ebitda: 3456,
      netIncome: 1234,
      grossProfit: 2345,
      totalRevenue: 5678,
      costOfRevenue: 4567,
      ...emptyProps,
    }
    expect(created1).toStrictEqual(result1)
    const record1 = await tickerQuarterly.getByUK(3, '2021-03')
    expect(record1).toStrictEqual(result1)

    const transaction2 = await databaseAdapter.createTransaction()
    const created2 = await tickerQuarterly.create({
      tickerId: 3,
      quarter: '2021-06',
      earningDate: '2021-06-30',
      earningReportDate: '2021-07-15',
      eps: '1.11',
      estimatedEPS: '2.22',
      epsSurprisePercent: '-100',
    }, transaction2)
    await transaction2.commit()
    const result2 = {
      id: 8,
      tickerId: 3,
      quarter: '2021-06',
      earningDate: '2021-06-30',
      earningReportDate: '2021-07-15',
      eps: 1.11,
      estimatedEPS: 2.22,
      epsSurprisePercent: -100,
      ebitda: null,
      netIncome: null,
      grossProfit: null,
      totalRevenue: null,
      costOfRevenue: null,
      ...emptyProps,
    }
    expect(created2).toStrictEqual(result2)
    const record2 = await tickerQuarterly.getByUK(3, '2021-06')
    expect(record2).toStrictEqual(result2)

    const transaction3 = await databaseAdapter.createTransaction()
    const created3 = await tickerQuarterly.create({
      tickerId: 3,
      quarter: '2021-09',
      earningDate: '2021-09-30',
      earningReportDate: '2021-10-15',
      ebitda: '12345',
    }, transaction3)
    await transaction3.commit()
    const result3 = {
      id: 9,
      tickerId: 3,
      quarter: '2021-09',
      earningDate: '2021-09-30',
      earningReportDate: '2021-10-15',
      eps: null,
      estimatedEPS: null,
      epsSurprisePercent: null,
      ebitda: 12345,
      netIncome: null,
      grossProfit: null,
      totalRevenue: null,
      costOfRevenue: null,
      ...emptyProps,
    }
    expect(created3).toStrictEqual(result3)
    const record3 = await tickerQuarterly.getByUK(3, '2021-09')
    expect(record3).toStrictEqual(result3)
  })
})

describe('#update', () => {
  test('could update', async () => {
    const transaction1 = await databaseAdapter.createTransaction()
    const movementProps = {
      profitQuarterlyIncrease: 0,
      profitQuarterlyDecrease: 1,
      revenueQuarterlyIncrease: 2,
      revenueQuarterlyDecrease: 0,
      incomeQuarterlyIncrease: 0,
      incomeQuarterlyDecrease: 3,
      epsQuarterlyBeat: 4,
      epsQuarterlyMiss: 0,
    }
    const updated1 = await tickerQuarterly.update(7, movementProps, transaction1)
    await transaction1.commit()
    const result1 = {
      id: 7,
      tickerId: 3,
      quarter: '2021-03',
      earningDate: '2021-03-31',
      earningReportDate: '2021-04-15',
      eps: 1.23,
      estimatedEPS: 1.11,
      epsSurprisePercent: 15,
      ebitda: 3456,
      netIncome: 1234,
      grossProfit: 2345,
      totalRevenue: 5678,
      costOfRevenue: 4567,
      ...movementProps,
    }
    expect(updated1).toStrictEqual(result1)
    const record1 = await tickerQuarterly.getByUK(3, '2021-03')
    expect(record1).toStrictEqual(result1)

    const transaction2 = await databaseAdapter.createTransaction()
    const updated2 = await tickerQuarterly.update(8, {
      ebitda: '11111',
      netIncome: '22222',
      grossProfit: '33333',
      totalRevenue: '66666',
      costOfRevenue: '44444',
    }, transaction2)
    await transaction2.commit()
    const result2 = {
      id: 8,
      tickerId: 3,
      quarter: '2021-06',
      earningDate: '2021-06-30',
      earningReportDate: '2021-07-15',
      eps: 1.11,
      estimatedEPS: 2.22,
      epsSurprisePercent: -100,
      ebitda: 11111,
      netIncome: 22222,
      grossProfit: 33333,
      totalRevenue: 66666,
      costOfRevenue: 44444,
      profitQuarterlyIncrease: null,
      profitQuarterlyDecrease: null,
      revenueQuarterlyIncrease: null,
      revenueQuarterlyDecrease: null,
      incomeQuarterlyIncrease: null,
      incomeQuarterlyDecrease: null,
      epsQuarterlyBeat: null,
      epsQuarterlyMiss: null,
    }
    expect(updated2).toStrictEqual(result2)
    const record2 = await tickerQuarterly.getByUK(3, '2021-06')
    expect(record2).toStrictEqual(result2)
  })
})
