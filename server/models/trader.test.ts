import * as databaseAdapter from 'adapters/database'
import * as trader from './trader'

beforeAll(async () => {
  databaseAdapter.initConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_env.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_pattern.js',
  })
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
    name: 'trader.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'ticker_holder.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_env.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_pattern.js',
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
    specific: 'trader.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'ticker_holder.js',
  })
})

afterAll(async () => {
  const db = databaseAdapter.getConnection()
  await db.destroy()
})

describe('#getByPK', () => {
  test('could get by PK', async () => {
    const result1 = await trader.getByPK(1)
    expect(result1?.traderEnvId).toBe(1)
    expect(result1?.traderPatternId).toBe(1)
    expect(result1?.totalValue).toBe(null)
    expect(result1?.oneYearTrends).toBe(null)
    expect(result1?.oneDecadeTrends).toBe(null)

    const result2 = await trader.getByPK(104)
    expect(result2?.traderEnvId).toBe(2)
    expect(result2?.traderPatternId).toBe(52)
    expect(result2?.totalValue).toBe(12345)
    expect(result2?.oneYearTrends).toStrictEqual([100, 101, 102, 103])
    expect(result2?.oneDecadeTrends).toStrictEqual([111, 222, 333, 444])

    const result3 = await trader.getByPK(105)
    expect(result3).toBe(null)
  })
})

describe('#getByUK', () => {
  test('could get by UK', async () => {
    const result1 = await trader.getByUK(1, 1)
    expect(result1?.id).toBe(1)

    const result2 = await trader.getByUK(2, 52)
    expect(result2?.id).toBe(104)

    const result3 = await trader.getByUK(3, 52)
    expect(result3).toBe(null)

    const result4 = await trader.getByUK(2, 53)
    expect(result4).toBe(null)
  })
})

describe('#getActives', () => {
  test('could get actives', async () => {
    const actives = await trader.getActives()
    expect(actives.length).toBe(100)
  })
})

describe('#getByPatternId', () => {
  test('could get by pattern id', async () => {
    const traders1 = await trader.getByPatternId(1)
    expect(traders1.length).toBe(2)
    expect(traders1[0].id).toBe(1)
    expect(traders1[1].id).toBe(53)

    const traders2 = await trader.getByPatternId(2)
    expect(traders2.length).toBe(2)
    expect(traders2[0].id).toBe(2)
    expect(traders2[1].id).toBe(54)
  })
})

describe('#getAll', () => {
  test('could get all', async () => {
    const traders = await trader.getAll()
    expect(traders.length).toBe(104)
  })
})

describe('#getInPKs', () => {
  test('could get in PKs', async () => {
    const traders = await trader.getInPKs([1, 2, 3, 5, 8])
    expect(traders.length).toBe(5)
    expect(traders[0].id).toBe(1)
    expect(traders[4].id).toBe(8)
  })
})

describe('#getTopPerformancers', () => {
  test('could get top performancers', async () => {
    const traders = await trader.getTopPerformancers(1, 3, 'yearlyPercentNumber')
    expect(traders.length).toBe(3)
    expect(traders[0].id).toBe(6)
    expect(traders[1].id).toBe(5)
    expect(traders[2].id).toBe(4)
  })
})

describe('#getTops', () => {
  test('could get tops by env', async () => {
    const tops = await trader.getTops(3, { envId: 1 })
    expect(tops.yearly.length).toBe(3)
    expect(tops.yearly[0].id).toBe(6)
    expect(tops.yearly[1].id).toBe(5)
    expect(tops.yearly[2].id).toBe(4)
    expect(tops.pastYear.length).toBe(3)
    expect(tops.pastYear[0].id).toBe(5)
    expect(tops.pastYear[1].id).toBe(6)
    expect(tops.pastYear[2].id).toBe(4)
    expect(tops.pastQuarter.length).toBe(3)
    expect(tops.pastQuarter[0].id).toBe(3)
    expect(tops.pastQuarter[1].id).toBe(2)
    expect(tops.pastQuarter[2].id).toBe(4)
    expect(tops.pastMonth.length).toBe(3)
    expect(tops.pastMonth[0].id).toBe(1)
    expect(tops.pastMonth[1].id).toBe(2)
    expect(tops.pastMonth[2].id).toBe(3)
    expect(tops.pastWeek.length).toBe(3)
    expect(tops.pastWeek[0].id).toBe(6)
    expect(tops.pastWeek[1].id).toBe(5)
    expect(tops.pastWeek[2].id).toBe(4)
  })

  test('could get tops by ticker', async () => {
    const tops = await trader.getTops(3, { tickerId: 1 })
    expect(tops.yearly.length).toBe(3)
    expect(tops.yearly[0].id).toBe(53)
    expect(tops.yearly[1].id).toBe(4)
    expect(tops.yearly[2].id).toBe(3)
    expect(tops.pastYear.length).toBe(3)
    expect(tops.pastYear[0].id).toBe(53)
    expect(tops.pastYear[1].id).toBe(4)
    expect(tops.pastYear[2].id).toBe(3)
    expect(tops.pastQuarter.length).toBe(3)
    expect(tops.pastQuarter[0].id).toBe(53)
    expect(tops.pastQuarter[1].id).toBe(3)
    expect(tops.pastQuarter[2].id).toBe(2)
    expect(tops.pastMonth.length).toBe(3)
    expect(tops.pastMonth[0].id).toBe(53)
    expect(tops.pastMonth[1].id).toBe(1)
    expect(tops.pastMonth[2].id).toBe(2)
    expect(tops.pastWeek.length).toBe(3)
    expect(tops.pastWeek[0].id).toBe(53)
    expect(tops.pastWeek[1].id).toBe(4)
    expect(tops.pastWeek[2].id).toBe(3)
  })

  test('could get tops by behavior', async () => {
    const tops = await trader.getTops(2, { behavior: 'priceDailyIncreaseBuy' })
    expect(tops.yearly.length).toBe(2)
    expect(tops.yearly[0].id).toBe(53)
    expect(tops.yearly[1].id).toBe(4)
    expect(tops.pastYear.length).toBe(2)
    expect(tops.pastYear[0].id).toBe(53)
    expect(tops.pastYear[1].id).toBe(4)
    expect(tops.pastQuarter.length).toBe(2)
    expect(tops.pastQuarter[0].id).toBe(53)
    expect(tops.pastQuarter[1].id).toBe(54)
    expect(tops.pastMonth.length).toBe(2)
    expect(tops.pastMonth[0].id).toBe(53)
    expect(tops.pastMonth[1].id).toBe(54)
    expect(tops.pastWeek.length).toBe(2)
    expect(tops.pastWeek[0].id).toBe(53)
    expect(tops.pastWeek[1].id).toBe(4)
  })

  test('could get in general', async () => {
    const tops = await trader.getTops(1)
    expect(tops.yearly.length).toBe(1)
    expect(tops.yearly[0].id).toBe(6)
    expect(tops.pastYear.length).toBe(1)
    expect(tops.pastYear[0].id).toBe(5)
    expect(tops.pastQuarter.length).toBe(1)
    expect(tops.pastQuarter[0].id).toBe(53)
    expect(tops.pastMonth.length).toBe(1)
    expect(tops.pastMonth[0].id).toBe(53)
    expect(tops.pastWeek.length).toBe(1)
    expect(tops.pastWeek[0].id).toBe(53)
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await trader.create({
      traderEnvId: 3,
      traderPatternId: 3,
      isActive: true,
      accessCode: '123',
    }, transaction)
    await transaction.commit()
    expect(created.id).toBe(105)
    expect(created.traderEnvId).toBe(3)
    expect(created.traderPatternId).toBe(3)
    expect(created.isActive).toBe(true)
    expect(created.accessCode).toBe('123')
    const record = await trader.getByPK(105)
    expect(record?.id).toBe(105)
    expect(record?.traderEnvId).toBe(3)
    expect(record?.traderPatternId).toBe(3)
    expect(record?.isActive).toBe(true)
    expect(record?.accessCode).toBe('123')
  })
})

describe('#update', () => {
  test('could update', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const updated = await trader.update(105, {
      yearlyPercentNumber: 100,
      pastWeekPercentNumber: 10,
      pastMonthPercentNumber: 20,
      pastQuarterPercentNumber: 30,
      pastYearPercentNumber: 40,
      oneYearTrends: '10,20,30',
      oneDecadeTrends: '100,200,300',
    }, transaction)
    await transaction.commit()
    expect(updated.id).toBe(105)
    expect(updated.yearlyPercentNumber).toBe(100)
    expect(updated.pastWeekPercentNumber).toBe(10)
    expect(updated.pastMonthPercentNumber).toBe(20)
    expect(updated.pastQuarterPercentNumber).toBe(30)
    expect(updated.pastYearPercentNumber).toBe(40)
    expect(updated.oneYearTrends).toStrictEqual([10, 20, 30])
    expect(updated.oneDecadeTrends).toStrictEqual([100, 200, 300])
    const record = await trader.getByPK(105)
    expect(record?.id).toBe(105)
    expect(record?.yearlyPercentNumber).toBe(100)
    expect(record?.pastWeekPercentNumber).toBe(10)
    expect(record?.pastMonthPercentNumber).toBe(20)
    expect(record?.pastQuarterPercentNumber).toBe(30)
    expect(record?.pastYearPercentNumber).toBe(40)
    expect(record?.oneYearTrends).toStrictEqual([10, 20, 30])
    expect(record?.oneDecadeTrends).toStrictEqual([100, 200, 300])
  })
})

describe('#createOrActive', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await trader.createOrActive(3, 1, null, null, false, transaction)
    await transaction.commit()
    expect(created.isEdited).toBe(true)
    expect(created.record.id).toBe(106)
    expect(created.record.isActive).toBe(true)
    expect(created.record.accessCode.length).toBe(16)
    expect(created.record.traderEnvId).toBe(3)
    expect(created.record.traderPatternId).toBe(1)
    expect(created.record.fatherId).toBe(null)
    expect(created.record.motherId).toBe(null)
    expect(created.record.hasMutation).toBe(false)
  })

  test('could active', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const created = await trader.createOrActive(2, 51, 1, 2, true, transaction)
    await transaction.commit()
    expect(created.isEdited).toBe(true)
    expect(created.record.id).toBe(103)
    expect(created.record.isActive).toBe(true)
    expect(created.record.traderEnvId).toBe(2)
    expect(created.record.traderPatternId).toBe(51)
    expect(created.record.fatherId).toBe(1)
    expect(created.record.motherId).toBe(2)
    expect(created.record.hasMutation).toBe(true)
  })

  test('could return existing', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const record = await trader.createOrActive(1, 1, 1, 2, false, transaction)
    await transaction.rollback()
    expect(record.isEdited).toBe(false)
    expect(record.record.id).toBe(1)
    expect(record.record.isActive).toBe(true)
    expect(record.record.traderEnvId).toBe(1)
    expect(record.record.traderPatternId).toBe(1)
  })
})
