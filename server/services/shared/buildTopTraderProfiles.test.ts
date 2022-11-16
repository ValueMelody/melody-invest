import * as databaseAdapter from 'adapters/database'
import * as interfaces from '@shared/interfaces'
import { instance, mock, when } from 'ts-mockito'
import buildTopTraderProfiles from './buildTopTraderProfiles'

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
    const traderMock1: interfaces.traderModel.Record = mock({})
    when(traderMock1.id).thenReturn(1)
    when(traderMock1.traderEnvId).thenReturn(1)
    when(traderMock1.traderPatternId).thenReturn(1)
    const trader1 = instance(traderMock1)

    const traderMock2: interfaces.traderModel.Record = mock({})
    when(traderMock2.id).thenReturn(2)
    when(traderMock2.traderEnvId).thenReturn(1)
    when(traderMock2.traderPatternId).thenReturn(3)
    const trader2 = instance(traderMock2)

    const traderMock3: interfaces.traderModel.Record = mock({})
    when(traderMock3.id).thenReturn(3)
    when(traderMock3.traderEnvId).thenReturn(2)
    when(traderMock3.traderPatternId).thenReturn(5)
    const trader3 = instance(traderMock3)

    const traderMock11: interfaces.traderModel.Record = mock({})
    when(traderMock11.id).thenReturn(11)
    when(traderMock11.traderEnvId).thenReturn(3)
    when(traderMock11.traderPatternId).thenReturn(6)
    const trader11 = instance(traderMock11)

    const traderMock12: interfaces.traderModel.Record = mock({})
    when(traderMock12.id).thenReturn(12)
    when(traderMock12.traderEnvId).thenReturn(2)
    when(traderMock12.traderPatternId).thenReturn(6)
    const trader12 = instance(traderMock12)

    const tops = {
      yearly: [trader1, trader2, trader3],
      pastYear: [trader11, trader1],
      pastQuarter: [trader3],
      pastMonth: [trader12],
      pastWeek: [],
    }
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
