import buildTopTraderProfiles from './buildTopTraderProfiles'
import * as databaseAdapter from 'adapters/database'

beforeAll(async () => {
  databaseAdapter.initConnection()
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

describe('#buildTopTraderProfiles', () => {
  test('could build top trader profiles', async () => {
    const trader1 = { id: 1, traderEnvId: 1, traderPatternId: 1 }
    const trader2 = { id: 2, traderEnvId: 1, traderPatternId: 3 }
    const trader3 = { id: 3, traderEnvId: 2, traderPatternId: 5 }
    const trader11 = { id: 11, traderEnvId: 3, traderPatternId: 6 }
    const trader12 = { id: 12, traderEnvId: 2, traderPatternId: 6 }
    const tops = {
      yearly: [trader1, trader2, trader3],
      pastYear: [trader11, trader1],
      pastQuarter: [trader3],
      pastMonth: [trader12],
      pastWeek: [],
    }
    // @ts-ignore
    const result = await buildTopTraderProfiles(tops)
    expect(result.yearly.length).toBe(3)
    expect(result.yearly[0].trader).toStrictEqual(trader1)
    expect(result.yearly[0].pattern.priceDailyIncreaseBuy).toBe(3)
    expect(result.yearly[0].pattern.priceDailyDecreaseSell).toBe(3)
    expect(result.yearly[1].trader).toStrictEqual(trader2)
    expect(result.yearly[1].pattern.priceWeeklyIncreaseBuy).toBe(2)
    expect(result.yearly[1].pattern.priceWeeklyDecreaseSell).toBe(2)
    expect(result.yearly[2].trader).toStrictEqual(trader3)
    expect(result.yearly[2].pattern.priceMonthlyIncreaseBuy).toBe(2)
    expect(result.yearly[2].pattern.priceMonthlyDecreaseSell).toBe(2)

    expect(result.pastYear.length).toBe(2)
    expect(result.pastYear[0].trader).toStrictEqual(trader11)
    expect(result.pastYear[0].pattern.priceMonthlyIncreaseSell).toBe(2)
    expect(result.pastYear[0].pattern.priceMonthlyDecreaseBuy).toBe(2)
    expect(result.pastYear[1].trader).toStrictEqual(trader1)
    expect(result.pastYear[1].pattern.priceDailyIncreaseBuy).toBe(3)
    expect(result.pastYear[1].pattern.priceDailyDecreaseSell).toBe(3)

    expect(result.pastQuarter.length).toBe(1)
    expect(result.pastQuarter[0].trader).toStrictEqual(trader3)
    expect(result.pastQuarter[0].pattern.priceMonthlyIncreaseBuy).toBe(2)
    expect(result.pastQuarter[0].pattern.priceMonthlyDecreaseSell).toBe(2)

    expect(result.pastMonth.length).toBe(1)
    expect(result.pastMonth[0].trader).toStrictEqual(trader12)
    expect(result.pastMonth[0].pattern.priceMonthlyIncreaseSell).toBe(2)
    expect(result.pastMonth[0].pattern.priceMonthlyDecreaseBuy).toBe(2)

    expect(result.pastWeek.length).toBe(0)

    const tops2 = {
      yearly: [],
      pastYear: [],
      pastQuarter: [],
      pastMonth: [],
      pastWeek: [trader12],
    }
    // @ts-ignore
    const result2 = await buildTopTraderProfiles(tops2)
    expect(result2.yearly.length).toBe(0)
    expect(result2.pastYear.length).toBe(0)
    expect(result2.pastQuarter.length).toBe(0)
    expect(result2.pastMonth.length).toBe(0)
    expect(result2.pastWeek.length).toBe(1)
    expect(result2.pastWeek[0].trader).toStrictEqual(trader12)
    expect(result2.pastWeek[0].pattern.priceMonthlyIncreaseSell).toBe(2)
    expect(result2.pastWeek[0].pattern.priceMonthlyDecreaseBuy).toBe(2)
  })
})
