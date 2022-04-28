import * as task from './task'

describe('#Name', () => {
  test('correctly defined Name', () => {
    expect(task.Name.syncTickerPrices).toBeDefined()
    expect(task.Name.syncTickerIncomes).toBeDefined()
    expect(task.Name.syncTickerEarnings).toBeDefined()
    expect(task.Name.syncMonthlyIndicators).toBeDefined()
    expect(task.Name.syncQuarterlyIndicators).toBeDefined()
    expect(task.Name.syncYearlyIndicators).toBeDefined()
    expect(task.Name.calcPriceMovements).toBeDefined()
    expect(task.Name.calcFinancialMovements).toBeDefined()
    expect(task.Name.calcIndicatorMovements).toBeDefined()
    expect(task.Name.calcDailyTickers).toBeDefined()
    expect(task.Name.calcTraderPerformances).toBeDefined()
  })
})
