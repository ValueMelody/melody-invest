import * as databaseAdapter from 'adapters/database'
import buildComboEntities from './buildComboEntities'

beforeAll(async () => {
  databaseAdapter.initConnection()
  const connection = databaseAdapter.getConnection()
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

describe('#buildComboEntities', () => {
  test('could build combo entities', async () => {
    const traders = [
      { id: 2, traderPatternId: 2 },
      { id: 1, traderPatternId: 1 },
      { id: 3, traderPatternId: 3 },
    ]
    // @ts-ignore
    const result = await buildComboEntities(traders)
    expect(result.traderProfiles.length).toBe(3)
    expect(result.traderProfiles[2].trader).toStrictEqual(traders[2])
    expect(result.traderProfiles[2].pattern.priceWeeklyIncreaseBuy).toBe(2)
    expect(result.traderProfiles[2].pattern.priceWeeklyDecreaseSell).toBe(2)
    expect(result.traderProfiles[0].trader).toStrictEqual(traders[0])
    expect(result.traderProfiles[0].pattern.priceDailyIncreaseSell).toBe(3)
    expect(result.traderProfiles[0].pattern.priceDailyIncreaseBuy).toBe(3)
    expect(result.traderProfiles[1].trader).toStrictEqual(traders[1])
    expect(result.traderProfiles[1].pattern.priceDailyIncreaseBuy).toBe(3)
    expect(result.traderProfiles[1].pattern.priceDailyDecreaseSell).toBe(3)
    expect(result.holdings).toStrictEqual([
      {
        date: '2022-01-01',
        totalValue: 328200,
        totalCash: 210000,
        items: [
          {
            tickerId: 1,
            shares: 998,
            splitMultiplier: 1,
            value: 104540,
          },
          {
            tickerId: 2,
            shares: 100,
            value: 3200,
            splitMultiplier: 1,
          },
          {
            tickerId: 3,
            shares: 15,
            value: 5611,
            splitMultiplier: 2,
          },
        ],
      },
      {
        date: '2021-12-31',
        totalValue: 323200,
        totalCash: 210000,
        items: [
          {
            tickerId: 1,
            shares: 1050,
            splitMultiplier: 1,
            value: 105000,
          },
          {
            tickerId: 2,
            shares: 100,
            value: 3200,
            splitMultiplier: 1,
          },
          {
            shares: 10,
            splitMultiplier: 1,
            tickerId: 3,
            value: 4500,
          },
        ],
      },
      {
        date: '2021-01-02',
        totalCash: 20100000,
        totalValue: 20105000,
        items: [
          {
            tickerId: 3,
            shares: 10,
            splitMultiplier: 1,
            value: 4500,
          },
        ],
      },
    ])
  })
})
