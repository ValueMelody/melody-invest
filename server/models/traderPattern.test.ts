import * as interfaces from '@shared/interfaces'
import * as traderPattern from './traderPattern'
import * as databaseAdapter from 'adapters/database'

beforeAll(async () => {
  databaseAdapter.initTestConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_pattern.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_pattern.js',
  })
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#getByPK', () => {
  test('could get by pk', async () => {
    const pattern1 = await traderPattern.getByPK(1)
    expect(pattern1?.hashCode).toBe('PATTERN001')
    const pattern2 = await traderPattern.getByPK(10)
    expect(pattern2?.hashCode).toBe('PATTERN010')
    const pattern3 = await traderPattern.getByPK(52)
    expect(pattern3?.hashCode).toBe('PATTERN052')
    const pattern4 = await traderPattern.getByPK(53)
    expect(pattern4).toBe(null)
  })
})

describe('#getInPKs', () => {
  test('could get by PKs', async () => {
    const patterns = await traderPattern.getInPKs([2, 4, 6])
    expect(patterns[0]?.hashCode).toBe('PATTERN002')
    expect(patterns[1]?.hashCode).toBe('PATTERN004')
    expect(patterns[2]?.hashCode).toBe('PATTERN006')
  })
})

describe('#getByUK', () => {
  test('could get by UK', async () => {
    const pattern1 = await traderPattern.getByUK('PATTERN002')
    expect(pattern1?.id).toBe(2)
    const pattern2 = await traderPattern.getByUK('PATTERN052')
    expect(pattern2?.id).toBe(52)
    const pattern3 = await traderPattern.getByUK('PATTERN053')
    expect(pattern3).toBe(null)
  })
})

describe('#getPublicByTraders', () => {
  test('could get public by traders', async () => {
    const traders: interfaces.traderModel.Record[] = [
      // @ts-ignore
      { traderPatternId: 2 },
      // @ts-ignore
      { traderPatternId: 12 },
      // @ts-ignore
      { traderPatternId: 22 },
    ]
    const patterns = await traderPattern.getPublicByTraders(traders)
    expect(patterns.length).toBe(3)

    expect(patterns[0]?.id).toBe(2)
    // @ts-ignore
    expect(patterns[0]?.hashCode).toBe(undefined)

    expect(patterns[1]?.id).toBe(12)
    // @ts-ignore
    expect(patterns[1]?.hashCode).toBe(undefined)

    expect(patterns[2]?.id).toBe(22)
    // @ts-ignore
    expect(patterns[2]?.hashCode).toBe(undefined)
  })
})

describe('#getAll', () => {
  test('could get all', async () => {
    const patterns = await traderPattern.getAll()
    expect(patterns.length).toBe(52)
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    // @ts-ignore
    const created = await traderPattern.create({
      hashCode: 'PATTERN053',
      buyPreference: 5,
      sellPreference: 6,
      gdpQuarterlyYoYChangeAboveBuy: 1,
      gdpQuarterlyYoYChangeBelowSell: 2,
      cashMaxPercent: 3,
      tickerMinPercent: 4,
      tickerMaxPercent: 5,
      holdingBuyPercent: 6,
      holdingSellPercent: 7,
      tradeFrequency: 8,
      rebalanceFrequency: 9,
    }, transaction)
    await transaction.commit()
    expect(created.hashCode).toBe('PATTERN053')
    expect(created.buyPreference).toBe(5)
    expect(created.gdpQuarterlyYoYChangeBelowSell).toBe(2)
    expect(created.priceDailyDecreaseBuy).toBe(null)
    expect(created.tradeFrequency).toBe(8)

    const record = await traderPattern.getByPK(53)
    expect(record?.hashCode).toBe('PATTERN053')
  })
})

describe('#createIfEmpty', () => {
  test('could return existing record', async () => {
    const transaction = await databaseAdapter.createTransaction()
    // @ts-ignore
    const result = await traderPattern.createIfEmpty({
      hashCode: 'PATTERN053',
    }, transaction)
    await transaction.rollback()
    expect(result.record.id).toBe(53)
    expect(result.isNew).toBe(false)
  })

  test('could return new record', async () => {
    const transaction = await databaseAdapter.createTransaction()
    // @ts-ignore
    const result = await traderPattern.createIfEmpty({
      hashCode: 'PATTERN054',
      buyPreference: 5,
      sellPreference: 6,
      gdpQuarterlyYoYChangeAboveBuy: 2,
      gdpQuarterlyYoYChangeBelowSell: 2,
      cashMaxPercent: 3,
      tickerMinPercent: 4,
      tickerMaxPercent: 5,
      holdingBuyPercent: 6,
      holdingSellPercent: 7,
      tradeFrequency: 8,
      rebalanceFrequency: 9,
    }, transaction)
    await transaction.commit()
    expect(result.record.id).toBe(54)
    expect(result.isNew).toBe(true)
  })
})

describe('#update', () => {
  test('could update', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const updated = await traderPattern.update(54, {
      hashCode: 'ABC',
    }, transaction)
    await transaction.commit()
    expect(updated.id).toBe(54)
    expect(updated.hashCode).toBe('ABC')
  })
})
