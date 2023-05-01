import * as dateTool from 'tools/date'
import * as marketEnum from 'enums/market'
import * as sync from './sync'
import * as syncIndicators from 'services/syncIndicators'
import * as syncTickers from 'services/syncTickers'

jest.mock('services/syncTickers', () => {
  const actual = jest.requireActual('services/syncTickers')
  return {
    __esModule: true,
    ...actual,
  }
})

jest.mock('services/syncIndicators', () => {
  const actual = jest.requireActual('services/syncIndicators')
  return {
    __esModule: true,
    ...actual,
  }
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('#syncTickerPrices', () => {
  const syncAllPrices = jest.fn()
  jest.spyOn(syncTickers, 'syncAllPrices')
    .mockImplementation(async (date) => {
      syncAllPrices(date)
      return ['aaa', 'bbb']
    })

  test('could sync ticker prices', async () => {
    const consoleInfo = jest.fn()
    jest.spyOn(console, 'info')
      .mockImplementation((content) => { consoleInfo(content) })

    await sync.syncTickerPrices(dateTool.getCurrentDate())
    expect(syncAllPrices).toBeCalledTimes(1)
    expect(syncAllPrices).toBeCalledWith(dateTool.getCurrentDate())
    expect(consoleInfo).toBeCalledTimes(4)
    expect(consoleInfo).toHaveBeenCalledWith('aaa')
    expect(consoleInfo).toHaveBeenCalledWith('bbb')
  })

  test('could sync ticker prices by a specific date', async () => {
    await sync.syncTickerPrices('2001-01-03')
    expect(syncAllPrices).toBeCalledTimes(1)
    expect(syncAllPrices).toBeCalledWith('2001-01-03')
  })

  test('could throw error for a wrong date', async () => {
    expect(async () => await sync.syncTickerPrices('20010103')).rejects.toThrowError()
  })

  test('could throw error message', async () => {
    jest.spyOn(syncTickers, 'syncAllPrices')
      .mockImplementation(async () => { throw Error('Not found') })
    const consoleError = jest.fn()
    jest.spyOn(console, 'error')
      .mockImplementation(() => { consoleError() })
    await sync.syncTickerPrices('2012-03-03')
    expect(consoleError).toBeCalledTimes(2)
  })
})

describe('#syncEconomyIndicators', () => {
  const syncAllMonthlyIndicators = jest.fn()
  jest.spyOn(syncIndicators, 'syncAllMonthlyIndicators')
    .mockImplementation(syncAllMonthlyIndicators)

  const syncQuarterly = jest.fn()
  jest.spyOn(syncIndicators, 'syncQuarterly')
    .mockImplementation(syncQuarterly)

  const syncAllYearlyIndicators = jest.fn()
  jest.spyOn(syncIndicators, 'syncAllYearlyIndicators')
    .mockImplementation(syncAllYearlyIndicators)

  test('could sync economy indicators', async () => {
    await sync.syncEconomyIndicators()
    expect(syncAllMonthlyIndicators).toBeCalledTimes(1)
    expect(syncQuarterly).toBeCalledTimes(1)
    expect(syncQuarterly).toBeCalledWith(marketEnum.Type.GDP)
    expect(syncAllYearlyIndicators).toBeCalledTimes(1)
  })

  test('could throw error', async () => {
    jest.spyOn(syncIndicators, 'syncAllMonthlyIndicators')
      .mockImplementation(async () => { throw Error('Not found') })
    const consoleError = jest.fn()
    jest.spyOn(console, 'error')
      .mockImplementation(() => { consoleError() })
    await sync.syncEconomyIndicators()
    expect(consoleError).toBeCalledTimes(2)
  })
})
