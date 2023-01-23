import * as cacheTask from 'tasks/cache'
import * as calcTask from 'tasks/calc'
import * as dateTool from 'tools/date'
import * as emailTask from 'tasks/email'
import * as syncTask from 'tasks/sync'
import * as taskEnum from 'enums/task'

import { run } from './cli'

jest.mock('tasks/cache', () => ({
  ...jest.requireActual('tasks/cache'),
  __esModule: true,
}))

jest.mock('tasks/calc', () => ({
  ...jest.requireActual('tasks/calc'),
  __esModule: true,
}))

jest.mock('tasks/sync', () => ({
  ...jest.requireActual('tasks/sync'),
  __esModule: true,
}))

jest.mock('tasks/email', () => ({
  ...jest.requireActual('tasks/email'),
  __esModule: true,
}))

afterEach(() => {
  process.argv[2] = ''
  process.argv[3] = ''
  process.argv[4] = ''
  process.argv[5] = ''
})

describe('generateSystemCaches', () => {
  test('could trigger generateSystemCaches', async () => {
    const generateSystemCaches = jest.fn()
    jest.spyOn(cacheTask, 'generateSystemCaches')
      .mockImplementation(generateSystemCaches)

    process.argv[2] = taskEnum.Name.generateSystemCaches
    await run()
    expect(generateSystemCaches).toBeCalledTimes(1)
  })
})

describe('sendPendingEmails', () => {
  test('could trigger sendPendingEmails', async () => {
    const sendPendingEmails = jest.fn()
    jest.spyOn(emailTask, 'sendPendingEmails')
      .mockImplementation(sendPendingEmails)

    process.argv[2] = taskEnum.Name.sendPendingEmails
    await run()
    expect(sendPendingEmails).toBeCalledTimes(1)
  })
})

describe('calcDailyTickers', () => {
  test('could trigger calcDailyTickers by true', async () => {
    const calcDailyTickers = jest.fn()
    jest.spyOn(calcTask, 'calcDailyTickers')
      .mockImplementation(calcDailyTickers)

    process.argv[2] = taskEnum.Name.calcDailyTickers
    await run()
    expect(calcDailyTickers).toBeCalledTimes(1)
    expect(calcDailyTickers).toBeCalledWith(false)
  })

  test('could trigger calcDailyTickers by true', async () => {
    const calcDailyTickers = jest.fn()
    jest.spyOn(calcTask, 'calcDailyTickers')
      .mockImplementation(calcDailyTickers)

    process.argv[2] = taskEnum.Name.calcDailyTickers
    process.argv[3] = 'true'
    await run()
    expect(calcDailyTickers).toBeCalledTimes(1)
    expect(calcDailyTickers).toBeCalledWith(true)
  })
})

describe('calcTraderAccessHashs', () => {
  test('could trigger calcTraderAccessHashs', async () => {
    const calcTraderAccessHashs = jest.fn()
    jest.spyOn(calcTask, 'calcTraderAccessHashs')
      .mockImplementation(calcTraderAccessHashs)

    process.argv[2] = taskEnum.Name.calcTraderAccessHashs
    await run()
    expect(calcTraderAccessHashs).toBeCalledTimes(1)
  })
})

describe('calcTraderPerformances', () => {
  test('could trigger calcTraderPerformances by true', async () => {
    const calcTraderPerformances = jest.fn()
    jest.spyOn(calcTask, 'calcTraderPerformances')
      .mockImplementation(calcTraderPerformances)

    process.argv[2] = taskEnum.Name.calcTraderPerformances
    await run()
    expect(calcTraderPerformances).toBeCalledTimes(1)
    expect(calcTraderPerformances).toBeCalledWith(false)
  })

  test('could trigger calcTraderPerformances by true', async () => {
    const calcTraderPerformances = jest.fn()
    jest.spyOn(calcTask, 'calcTraderPerformances')
      .mockImplementation(calcTraderPerformances)

    process.argv[2] = taskEnum.Name.calcTraderPerformances
    process.argv[3] = 'true'
    await run()
    expect(calcTraderPerformances).toBeCalledTimes(1)
    expect(calcTraderPerformances).toBeCalledWith(true)
  })
})

describe('calcTraderDescendants', () => {
  test('could trigger calcTraderDescendants', async () => {
    const calcTraderDescendants = jest.fn()
    jest.spyOn(calcTask, 'calcTraderDescendants')
      .mockImplementation(calcTraderDescendants)

    process.argv[2] = taskEnum.Name.calcTraderDescendants
    await run()
    expect(calcTraderDescendants).toBeCalledTimes(1)
  })
})

describe('syncTickerPrices', () => {
  test('could sync syncTickerPrices by true', async () => {
    const syncTickerPrices = jest.fn()
    jest.spyOn(syncTask, 'syncTickerPrices')
      .mockImplementation(syncTickerPrices)

    process.argv[2] = taskEnum.Name.syncTickerPrices
    await run()
    expect(syncTickerPrices).toBeCalledTimes(1)
    expect(syncTickerPrices).toBeCalledWith(dateTool.getCurrentDate())
  })

  test('could trigger syncTickerPrices by date', async () => {
    const syncTickerPrices = jest.fn()
    jest.spyOn(syncTask, 'syncTickerPrices')
      .mockImplementation(syncTickerPrices)

    process.argv[2] = taskEnum.Name.syncTickerPrices
    process.argv[3] = '2000-01-01'
    await run()
    expect(syncTickerPrices).toBeCalledTimes(1)
    expect(syncTickerPrices).toBeCalledWith('2000-01-01')
  })
})

describe('syncTickerEarnings', () => {
  test('could sync syncTickerEarnings by true', async () => {
    const syncTickerEarnings = jest.fn()
    jest.spyOn(syncTask, 'syncTickerEarnings')
      .mockImplementation(syncTickerEarnings)

    process.argv[2] = taskEnum.Name.syncTickerEarnings
    await run()
    expect(syncTickerEarnings).toBeCalledTimes(1)
    expect(syncTickerEarnings).toBeCalledWith(
      dateTool.getCurrentQuater(), false, null,
    )
  })

  test('could trigger syncTickerEarnings by date', async () => {
    const syncTickerEarnings = jest.fn()
    jest.spyOn(syncTask, 'syncTickerEarnings')
      .mockImplementation(syncTickerEarnings)

    process.argv[2] = taskEnum.Name.syncTickerEarnings
    process.argv[3] = '2000-01'
    process.argv[4] = 'true'
    process.argv[5] = '11'
    await run()
    expect(syncTickerEarnings).toBeCalledTimes(1)
    expect(syncTickerEarnings).toBeCalledWith(
      '2000-01', true, 11,
    )
  })
})

describe('syncTickerIncomes', () => {
  test('could sync syncTickerIncomes by true', async () => {
    const syncTickerIncomes = jest.fn()
    jest.spyOn(syncTask, 'syncTickerIncomes')
      .mockImplementation(syncTickerIncomes)

    process.argv[2] = taskEnum.Name.syncTickerIncomes
    await run()
    expect(syncTickerIncomes).toBeCalledTimes(1)
    expect(syncTickerIncomes).toBeCalledWith(
      dateTool.getCurrentQuater(), false, null,
    )
  })

  test('could trigger syncTickerIncomes by date', async () => {
    const syncTickerIncomes = jest.fn()
    jest.spyOn(syncTask, 'syncTickerIncomes')
      .mockImplementation(syncTickerIncomes)

    process.argv[2] = taskEnum.Name.syncTickerIncomes
    process.argv[3] = '2000-01'
    process.argv[4] = 'true'
    process.argv[5] = '11'
    await run()
    expect(syncTickerIncomes).toBeCalledTimes(1)
    expect(syncTickerIncomes).toBeCalledWith(
      '2000-01', true, 11,
    )
  })
})

describe('calcPriceMovements', () => {
  test('could trigger calcPriceMovements', async () => {
    const calcPriceMovements = jest.fn()
    jest.spyOn(calcTask, 'calcPriceMovements')
      .mockImplementation(calcPriceMovements)

    process.argv[2] = taskEnum.Name.calcPriceMovements
    await run()
    expect(calcPriceMovements).toBeCalledTimes(1)
  })
})

describe('calcFinancialMovements', () => {
  test('could trigger calcFinancialMovements', async () => {
    const calcFinancialMovements = jest.fn()
    jest.spyOn(calcTask, 'calcFinancialMovements')
      .mockImplementation(calcFinancialMovements)

    process.argv[2] = taskEnum.Name.calcFinancialMovements
    await run()
    expect(calcFinancialMovements).toBeCalledTimes(1)
  })
})

describe('syncEconomyIndicators', () => {
  test('could trigger syncEconomyIndicators', async () => {
    const syncEconomyIndicators = jest.fn()
    jest.spyOn(syncTask, 'syncEconomyIndicators')
      .mockImplementation(syncEconomyIndicators)

    process.argv[2] = taskEnum.Name.syncEconomyIndicators
    await run()
    expect(syncEconomyIndicators).toBeCalledTimes(1)
  })
})

describe('calcIndicatorMovements', () => {
  test('could trigger calcIndicatorMovements', async () => {
    const calcIndicatorMovements = jest.fn()
    jest.spyOn(calcTask, 'calcIndicatorMovements')
      .mockImplementation(calcIndicatorMovements)

    process.argv[2] = taskEnum.Name.calcIndicatorMovements
    await run()
    expect(calcIndicatorMovements).toBeCalledTimes(1)
  })
})

describe('no matched', () => {
  test('could throw error', async () => {
    process.argv[2] = 'test'
    expect(async () => await run()).rejects.toThrowError()
  })
})
