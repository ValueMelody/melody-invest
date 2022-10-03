import * as crudSystems from './crudSystems'
import * as databaseAdapter from 'adapters/database'
import * as constants from '@shared/constants'

beforeAll(async () => {
  databaseAdapter.initConnection()
  const connection = databaseAdapter.getConnection()
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'policy.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'policy.js',
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
    name: 'ticker_category.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'ticker_category.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'ticker.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'ticker.js',
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
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'daily_tickers.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'daily_tickers.js',
  })
  await connection.migrate.up({
    directory: './server/migrations/test-tables',
    name: 'ticker_daily.js',
  })
  await connection.seed.run({
    directory: './server/migrations/test-seeds',
    specific: 'ticker_daily.js',
  })
})

afterAll(async () => {
  const connection = databaseAdapter.getConnection()
  await connection.destroy()
})

describe('#getSystemPolicy', () => {
  test('could get policy', async () => {
    const result1 = await crudSystems.getSystemPolicy(constants.Content.PolicyType.Privacy)
    expect(result1?.content).toBe('Privacy policy 2')

    const result2 = await crudSystems.getSystemPolicy(constants.Content.PolicyType.TermsAndConditions)
    expect(result2?.content).toBe('Terms and Conditions 1')
  })
})

describe('#getDefaults', () => {
  test('could get defaults', async () => {
    const result = await crudSystems.getDefaults()
    expect(result.tickerIdentities.length).toBe(3)
    expect(result.traderEnvs.length).toBe(1)
    expect(result.traderEnvs[0].id).toBe(1)
    expect(result.tickerCategories.length).toBe(2)
  })
})

describe('#getTopTraderProfiles', () => {
  test('could get top trade profiles', async () => {
    const result = await crudSystems.getTopTraderProfiles()
    expect(result.yearly[0].trader.id).toBe(6)
    expect(result.yearly[0].trader.yearlyPercentNumber).toBe(55)
    expect(result.yearly[1].trader.id).toBe(5)
    expect(result.yearly[1].trader.yearlyPercentNumber).toBe(54)
    expect(result.yearly[2].trader.id).toBe(53)
    expect(result.yearly[2].trader.yearlyPercentNumber).toBe(51)
    expect(result.yearly[3].trader.id).toBe(4)
    expect(result.yearly[3].trader.yearlyPercentNumber).toBe(43)
    expect(result.yearly[4].trader.id).toBe(3)
    expect(result.yearly[4].trader.yearlyPercentNumber).toBe(42)

    expect(result.pastYear[0].trader.id).toBe(5)
    expect(result.pastYear[0].trader.pastYearPercentNumber).toBe(60)
    expect(result.pastYear[1].trader.id).toBe(6)
    expect(result.pastYear[1].trader.pastYearPercentNumber).toBe(50)
    expect(result.pastYear[2].trader.id).toBe(53)
    expect(result.pastYear[2].trader.pastYearPercentNumber).toBe(50)
    expect(result.pastYear[3].trader.id).toBe(4)
    expect(result.pastYear[3].trader.pastYearPercentNumber).toBe(40)
    expect(result.pastYear[4].trader.id).toBe(3)
    expect(result.pastYear[4].trader.pastYearPercentNumber).toBe(30)

    expect(result.pastQuarter[0].trader.id).toBe(53)
    expect(result.pastQuarter[0].trader.pastQuarterPercentNumber).toBe(36)
    expect(result.pastQuarter[1].trader.id).toBe(54)
    expect(result.pastQuarter[1].trader.pastQuarterPercentNumber).toBe(11)
    expect(result.pastQuarter[2].trader.id).toBe(3)
    expect(result.pastQuarter[2].trader.pastQuarterPercentNumber).toBe(7)
    expect(result.pastQuarter[3].trader.id).toBe(2)
    expect(result.pastQuarter[3].trader.pastQuarterPercentNumber).toBe(6)
    expect(result.pastQuarter[4].trader.id).toBe(4)
    expect(result.pastQuarter[4].trader.pastQuarterPercentNumber).toBe(6)

    expect(result.pastMonth[0].trader.id).toBe(53)
    expect(result.pastMonth[0].trader.pastMonthPercentNumber).toBe(49)
    expect(result.pastMonth[1].trader.id).toBe(54)
    expect(result.pastMonth[1].trader.pastMonthPercentNumber).toBe(24)
    expect(result.pastMonth[2].trader.id).toBe(1)
    expect(result.pastMonth[2].trader.pastMonthPercentNumber).toBe(20)
    expect(result.pastMonth[3].trader.id).toBe(2)
    expect(result.pastMonth[3].trader.pastMonthPercentNumber).toBe(19)
    expect(result.pastMonth[4].trader.id).toBe(3)
    expect(result.pastMonth[4].trader.pastMonthPercentNumber).toBe(18)

    expect(result.pastWeek[0].trader.id).toBe(53)
    expect(result.pastWeek[0].trader.pastWeekPercentNumber).toBe(35)
    expect(result.pastWeek[1].trader.id).toBe(6)
    expect(result.pastWeek[1].trader.pastWeekPercentNumber).toBe(13)
    expect(result.pastWeek[2].trader.id).toBe(5)
    expect(result.pastWeek[2].trader.pastWeekPercentNumber).toBe(11)
    expect(result.pastWeek[3].trader.id).toBe(4)
    expect(result.pastWeek[3].trader.pastWeekPercentNumber).toBe(9)
    expect(result.pastWeek[4].trader.id).toBe(54)
    expect(result.pastWeek[4].trader.pastWeekPercentNumber).toBe(9)
  })
})
