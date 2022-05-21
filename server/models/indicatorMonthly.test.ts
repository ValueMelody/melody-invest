import * as indicatorMonthly from './indicatorMonthly'
import * as databaseAdapter from '../adapters/database'

const record1 = {
  id: 1,
  month: '2021-12',
  fundsRate: 1.11,
  thirtyYearsTreasury: 2.22,
  tenYearsTreasury: 3.33,
  cpi: 4.44,
  inflationExpectation: 5.55,
  consumerSentiment: 6.66,
  retailSales: 777,
  durableGoods: 888,
  unemploymentRate: 9.99,
  nonfarmPayroll: 1010,
  fundsRateMonthlyIncrease: 1,
  fundsRateMonthlyDecrease: 2,
  thirtyYearsTreasuryMonthlyIncrease: 3,
  thirtyYearsTreasuryMonthlyDecrease: 4,
  tenYearsTreasuryMonthlyIncrease: 4,
  tenYearsTreasuryMonthlyDecrease: 3,
  inflationMonthlyIncrease: 2,
  inflationMonthlyDecrease: 1,
  cpiMonthlyIncrease: 0,
  cpiMonthlyDecrease: 1,
  consumerSentimentMonthlyIncrease: 1,
  consumerSentimentMonthlyDecrease: 0,
  retailSalesMonthlyIncrease: 2,
  retailSalesMonthlyDecrease: 0,
  durableGoodsMonthlyIncrease: 0,
  durableGoodsMonthlyDecrease: 2,
  unemploymentRateMonthlyIncrease: 2,
  unemploymentRateMonthlyDecrease: 2,
  nonfarmPayrollMonthlyIncrease: 1,
  nonfarmPayrollMonthlyDecrease: 1,
}

const emptyProps = {
  fundsRateMonthlyIncrease: null,
  fundsRateMonthlyDecrease: null,
  thirtyYearsTreasuryMonthlyIncrease: null,
  thirtyYearsTreasuryMonthlyDecrease: null,
  tenYearsTreasuryMonthlyIncrease: null,
  tenYearsTreasuryMonthlyDecrease: null,
  inflationMonthlyIncrease: null,
  inflationMonthlyDecrease: null,
  cpiMonthlyIncrease: null,
  cpiMonthlyDecrease: null,
  consumerSentimentMonthlyIncrease: null,
  consumerSentimentMonthlyDecrease: null,
  retailSalesMonthlyIncrease: null,
  retailSalesMonthlyDecrease: null,
  durableGoodsMonthlyIncrease: null,
  durableGoodsMonthlyDecrease: null,
  unemploymentRateMonthlyIncrease: null,
  unemploymentRateMonthlyDecrease: null,
  nonfarmPayrollMonthlyIncrease: null,
  nonfarmPayrollMonthlyDecrease: null,
}

const record2 = {
  id: 2,
  month: '2022-01',
  fundsRate: 1.12,
  thirtyYearsTreasury: 2.23,
  tenYearsTreasury: 3.34,
  cpi: 4.45,
  inflationExpectation: 5.56,
  consumerSentiment: 6.67,
  retailSales: 778,
  durableGoods: 889,
  unemploymentRate: 10.00,
  nonfarmPayroll: 1011,
  ...emptyProps,
}

beforeAll(async () => {
  databaseAdapter.initTestConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'indicator_monthly.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'indicator_monthly.js',
  })
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#getByUK', () => {
  test('could get by UK', async () => {
    const result1 = await indicatorMonthly.getByUK('2021-12')
    expect(result1).toStrictEqual(record1)
    const result2 = await indicatorMonthly.getByUK('2022-01')
    expect(result2).toStrictEqual(record2)
    const result3 = await indicatorMonthly.getByUK('2022-02')
    expect(result3).toBe(null)
  })
})

describe('#getAll', () => {
  test('could get all', async () => {
    const records = await indicatorMonthly.getAll()
    expect(records).toStrictEqual([record1, record2])
  })
})

describe('#getPublishedByDate', () => {
  test('could get published by date', async () => {
    const result1 = await indicatorMonthly.getPublishedByDate('2021-12-16')
    expect(result1).toStrictEqual(record1)
    const result2 = await indicatorMonthly.getPublishedByDate('2021-12-15')
    expect(result2).toBe(null)
    const result3 = await indicatorMonthly.getPublishedByDate('2022-01-16')
    expect(result3).toStrictEqual(record2)
    const result4 = await indicatorMonthly.getPublishedByDate('2022-01-15')
    expect(result4).toStrictEqual(record1)
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await indicatorMonthly.create({
      month: '2022-02',
      fundsRate: '1.2',
      cpi: '2.3',
      tenYearsTreasury: '3.4',
      thirtyYearsTreasury: '4.5',
      inflationExpectation: '5.6',
      consumerSentiment: '6.7',
      retailSales: '78',
      durableGoods: '89',
      unemploymentRate: '10.1',
      nonfarmPayroll: '12',
    }, transaction)
    await transaction.commit()
    const record = {
      id: 3,
      month: '2022-02',
      fundsRate: 1.2,
      cpi: 2.3,
      tenYearsTreasury: 3.4,
      thirtyYearsTreasury: 4.5,
      inflationExpectation: 5.6,
      consumerSentiment: 6.7,
      retailSales: 78,
      durableGoods: 89,
      unemploymentRate: 10.1,
      nonfarmPayroll: 12,
      ...emptyProps,
    }
    expect(created).toStrictEqual(record)
    const result = await indicatorMonthly.getByUK('2022-02')
    expect(result).toStrictEqual(record)

    const transaction1 = await databaseAdapter.createTransaction()
    const created1 = await indicatorMonthly.create({
      month: '2022-03',
    }, transaction1)
    await transaction1.commit()
    const record1 = {
      id: 4,
      month: '2022-03',
      fundsRate: null,
      cpi: null,
      tenYearsTreasury: null,
      thirtyYearsTreasury: null,
      inflationExpectation: null,
      consumerSentiment: null,
      retailSales: null,
      durableGoods: null,
      unemploymentRate: null,
      nonfarmPayroll: null,
      ...emptyProps,
    }
    expect(created1).toStrictEqual(record1)
    const result1 = await indicatorMonthly.getByUK('2022-03')
    expect(result1).toStrictEqual(record1)
  })
})

describe('#update', () => {
  test('could update', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const info = {
      fundsRateMonthlyIncrease: 1,
      fundsRateMonthlyDecrease: 0,
      thirtyYearsTreasuryMonthlyIncrease: 0,
      thirtyYearsTreasuryMonthlyDecrease: 2,
      tenYearsTreasuryMonthlyIncrease: 3,
      tenYearsTreasuryMonthlyDecrease: 0,
      inflationMonthlyIncrease: 0,
      inflationMonthlyDecrease: 4,
      cpiMonthlyIncrease: 5,
      cpiMonthlyDecrease: 0,
      consumerSentimentMonthlyIncrease: 0,
      consumerSentimentMonthlyDecrease: 6,
      retailSalesMonthlyIncrease: 1,
      retailSalesMonthlyDecrease: 1,
      durableGoodsMonthlyIncrease: 2,
      durableGoodsMonthlyDecrease: 2,
      unemploymentRateMonthlyIncrease: 3,
      unemploymentRateMonthlyDecrease: 3,
      nonfarmPayrollMonthlyIncrease: 4,
      nonfarmPayrollMonthlyDecrease: 4,
    }
    const updated = await indicatorMonthly.update(2, info, transaction)
    await transaction.commit()
    expect(updated).toStrictEqual({ ...record2, ...info })
    const result = await indicatorMonthly.getByUK('2022-01')
    expect(result).toStrictEqual({ ...record2, ...info })
  })
})
