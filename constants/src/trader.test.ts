import * as trader from './trader'

describe('#Day', () => {
  test('contain expected days', () => {
    expect(trader.Day.Week).toBeDefined()
    expect(trader.Day.HalfMonth).toBeDefined()
    expect(trader.Day.Month).toBeDefined()
    expect(trader.Day.HalfQuarter).toBeDefined()
    expect(trader.Day.Quarter).toBeDefined()
    expect(trader.Day.HalfYear).toBeDefined()
    expect(trader.Day.Year).toBeDefined()
  })
})

describe('#Initial', () => {
  test('contain expected initial values', () => {
    expect(trader.Initial.Date).toBeDefined()
    expect(trader.Initial.PricePadding).toBeDefined()
    expect(trader.Initial.Cash).toBeDefined()
  })
})
