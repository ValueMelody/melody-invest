import * as calc from './calc'
import * as calcIndicators from 'services/calcIndicators'
import * as calcTickers from 'services/calcTickers'
import * as calcTraders from 'services/calcTraders'

jest.mock('services/calcIndicators', () => {
  const actual = jest.requireActual('services/calcIndicators')
  return {
    __esModule: true,
    ...actual,
  }
})

jest.mock('services/calcTickers', () => {
  const actual = jest.requireActual('services/calcTickers')
  return {
    __esModule: true,
    ...actual,
  }
})

jest.mock('services/calcTraders', () => {
  const actual = jest.requireActual('services/calcTraders')
  return {
    __esModule: true,
    ...actual,
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('#calcPriceMovements', () => {
  const calcAllTickersAveragePrice = jest.fn()
  jest.spyOn(calcTickers, 'calcAllTickersAveragePrice')
    .mockImplementation(calcAllTickersAveragePrice)

  const calcAllTickersPriceMovement = jest.fn()
  jest.spyOn(calcTickers, 'calcAllTickersPriceMovement')
    .mockImplementation(calcAllTickersPriceMovement)

  test('could trigger price movement services', async () => {
    await calc.calcPriceMovements()
    expect(calcAllTickersAveragePrice).toBeCalledTimes(1)
    expect(calcAllTickersPriceMovement).toBeCalledTimes(1)
  })
})

describe('#calcFinancialMovements', () => {
  const calcAllTickersQuarterlyFinancial = jest.fn()
  jest.spyOn(calcTickers, 'calcAllTickersQuarterlyFinancial')
    .mockImplementation(calcAllTickersQuarterlyFinancial)

  const calcAllTickersYearlyFinancial = jest.fn()
  jest.spyOn(calcTickers, 'calcAllTickersYearlyFinancial')
    .mockImplementation(calcAllTickersYearlyFinancial)

  test('could trigger finance movement services', async () => {
    await calc.calcFinancialMovements()
    expect(calcAllTickersQuarterlyFinancial).toBeCalledTimes(1)
    expect(calcAllTickersYearlyFinancial).toBeCalledTimes(1)
  })
})

describe('#calcIndicatorMovements', () => {
  const calcYearly = jest.fn()
  jest.spyOn(calcIndicators, 'calcYearly')
    .mockImplementation(calcYearly)

  const calcQuarterly = jest.fn()
  jest.spyOn(calcIndicators, 'calcQuarterly')
    .mockImplementation(calcQuarterly)

  const calcMonthly = jest.fn()
  jest.spyOn(calcIndicators, 'calcMonthly')
    .mockImplementation(calcMonthly)

  test('could trigger indicator movement services', async () => {
    process.argv[3] = ''
    await calc.calcIndicatorMovements()
    expect(calcYearly).toBeCalledTimes(1)
    expect(calcQuarterly).toBeCalledTimes(1)
    expect(calcMonthly).toBeCalledTimes(1)
    expect(calcMonthly).toBeCalledWith(false)
  })

  test('could trigger indicator movement services and force check month', async () => {
    process.argv[3] = 'true'
    await calc.calcIndicatorMovements()
    expect(calcYearly).toBeCalledTimes(1)
    expect(calcQuarterly).toBeCalledTimes(1)
    expect(calcMonthly).toBeCalledTimes(1)
    expect(calcMonthly).toBeCalledWith(true)
  })
})

describe('#calcDailyTickers', () => {
  const calcDailyAvailableTickers = jest.fn()
  jest.spyOn(calcTickers, 'calcDailyAvailableTickers')
    .mockImplementation(calcDailyAvailableTickers)

  test('could calc daily tickers', async () => {
    await calc.calcDailyTickers(false)
    expect(calcDailyAvailableTickers).toBeCalledTimes(1)
    expect(calcDailyAvailableTickers).toBeCalledWith(false)
  })

  test('could calc daily tickers by force recheck', async () => {
    await calc.calcDailyTickers(true)
    expect(calcDailyAvailableTickers).toBeCalledTimes(1)
    expect(calcDailyAvailableTickers).toBeCalledWith(true)
  })
})

describe('#calcTraderPerformances', () => {
  const calcAllTraderPerformances = jest.fn()
  jest.spyOn(calcTraders, 'calcAllTraderPerformances')
    .mockImplementation(calcAllTraderPerformances)

  test('could calc trader performance', async () => {
    await calc.calcTraderPerformances(false)
    expect(calcAllTraderPerformances).toBeCalledTimes(1)
    expect(calcAllTraderPerformances).toBeCalledWith(false)
  })

  test('could calc trader performance by force recheck', async () => {
    await calc.calcTraderPerformances(true)
    expect(calcAllTraderPerformances).toBeCalledTimes(1)
    expect(calcAllTraderPerformances).toBeCalledWith(true)
  })
})

describe('#calcTraderDescendants', () => {
  const calcAllEnvDescendants = jest.fn()
  jest.spyOn(calcTraders, 'calcAllEnvDescendants')
    .mockImplementation(calcAllEnvDescendants)

  test('could calc trader descendants', async () => {
    await calc.calcTraderDescendants()
    expect(calcAllEnvDescendants).toBeCalledTimes(1)
  })
})

describe('#calcTraderAccessHashs', () => {
  const calcTraderAccessHashs = jest.fn()
  jest.spyOn(calcTraders, 'calcTraderAccessHashs')
    .mockImplementation(calcTraderAccessHashs)

  test('could calc trader access hashs', async () => {
    await calc.calcTraderAccessHashs()
    expect(calcTraderAccessHashs).toBeCalledTimes(1)
  })
})
