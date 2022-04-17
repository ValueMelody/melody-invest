import * as trader from './trader'

test('contain expected days', () => {
  expect(trader.day.WEEK).toBeDefined()
  expect(trader.day.HALF_MONTH).toBeDefined()
  expect(trader.day.MONTH).toBeDefined()
  expect(trader.day.HALF_QUARTER).toBeDefined()
  expect(trader.day.QUARTER).toBeDefined()
  expect(trader.day.HALF_YEAR).toBeDefined()
  expect(trader.day.YEAR).toBeDefined()
})

test('contain expected initial values', () => {
  expect(trader.initial.DATE).toBeDefined()
  expect(trader.initial.PRICE_PADDING).toBeDefined()
  expect(trader.initial.CASH).toBeDefined()
})
