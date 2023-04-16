import * as databaseAdapter from 'adapters/database'
import * as traderHolding from './traderHolding'

beforeAll(async () => {
  databaseAdapter.initConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'entity.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'entity.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_env.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_env.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_pattern.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_pattern.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'trader_holding.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'trader_holding.js',
  })
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#getLatest', () => {
  test('could get by latest', async () => {
    const latest1 = await traderHolding.getLatest(1)
    expect(latest1?.id).toBe('5ed6d4c8-c159-4588-b966-364a4bdbd3a2')
    expect(latest1?.totalValue).toBe(118200)
    expect(latest1?.totalCash).toBe(10000)

    const latest2 = await traderHolding.getLatest(2)
    expect(latest2?.id).toBe('5ed6d4c8-c159-4588-b966-364a4bdbd3a3')
    expect(latest2?.totalValue).toBe(105000)
    expect(latest2?.totalCash).toBe(100000)

    const latest3 = await traderHolding.getLatest(4)
    expect(latest3).toBeNull()
  })
})

describe('#getLatestByDate', () => {
  test('could get latest by date', async () => {
    const latest1 = await traderHolding.getLatestByDate(1, '2022-01-02')
    expect(latest1?.id).toBe('5ed6d4c8-c159-4588-b966-364a4bdbd3a2')
    const latest2 = await traderHolding.getLatestByDate(1, '2022-01-01')
    expect(latest2?.id).toBe('5ed6d4c8-c159-4588-b966-364a4bdbd3a2')
    const latest3 = await traderHolding.getLatestByDate(1, '2021-12-31')
    expect(latest3?.id).toBe('5ed6d4c8-c159-4588-b966-364a4bdbd3a1')
    const latest4 = await traderHolding.getLatestByDate(1, '2021-12-30')
    expect(latest4).toBe(null)
  })
})

describe('#getAllByTraderIds', () => {
  test('could get all by traderIds', async () => {
    const all1 = await traderHolding.getAllByTraderIds([1])
    expect(all1.length).toBe(2)
    expect(all1[0]?.id).toBe('5ed6d4c8-c159-4588-b966-364a4bdbd3a1')
    expect(all1[1]?.id).toBe('5ed6d4c8-c159-4588-b966-364a4bdbd3a2')
    const all2 = await traderHolding.getAllByTraderIds([2])
    expect(all2.length).toBe(1)
    expect(all2[0]?.id).toBe('5ed6d4c8-c159-4588-b966-364a4bdbd3a3')
    const all3 = await traderHolding.getAllByTraderIds([1, 2])
    expect(all3.length).toBe(3)
    const all4 = await traderHolding.getAllByTraderIds([4])
    expect(all4.length).toBe(0)
  })
})

describe('#getAll', () => {
  test('could getAll', async () => {
    const all1 = await traderHolding.getAll(1)
    expect(all1.length).toBe(2)
    expect(all1[0]?.id).toBe('5ed6d4c8-c159-4588-b966-364a4bdbd3a2')
    expect(all1[1]?.id).toBe('5ed6d4c8-c159-4588-b966-364a4bdbd3a1')
    const all2 = await traderHolding.getAll(2)
    expect(all2.length).toBe(1)
    expect(all2[0]?.id).toBe('5ed6d4c8-c159-4588-b966-364a4bdbd3a3')
    const all3 = await traderHolding.getAll(4)
    expect(all3.length).toBe(0)
  })
})

describe('#create', () => {
  test('could create', async () => {
    const transaction = await databaseAdapter.createTransaction()
    const data = {
      date: '2022-01-02',
      traderId: 3,
      totalValue: 4000,
      totalCash: 1000,
      items: [
        { shares: 1000, tickerId: 1, splitMultiplier: 2, value: 3000 },
      ],
    }
    const created = await traderHolding.create(data, transaction)
    await transaction.commit()
    expect(created?.traderId).toBe(data.traderId)
    expect(created?.totalValue).toBe(data.totalValue)
    expect(created?.totalCash).toBe(data.totalCash)
    expect(created.items).toStrictEqual(data.items)
  })
})

describe('#destroyAll', () => {
  test('could destroy all by PK', async () => {
    const transaction = await databaseAdapter.createTransaction()
    await traderHolding.destroyAll(1, transaction)
    await transaction.commit()
    expect((await traderHolding.getAll(1)).length).toBe(0)
    expect((await traderHolding.getAll(2)).length).toBe(1)
  })
})
