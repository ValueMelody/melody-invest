import * as dateTool from 'tools/date'
import * as emailAdapter from 'adapters/email'
import * as marketEnum from 'enums/market'
import * as sync from './sync'
import * as syncIndicators from 'services/syncIndicators'
import * as syncTickers from 'services/syncTickers'
import { instance, mock } from 'ts-mockito'
import { Transporter } from 'nodemailer'

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

jest.mock('adapters/email', () => {
  const actual = jest.requireActual('adapters/email')
  return {
    __esModule: true,
    ...actual,
  }
})

const transporter: Transporter = mock({})
const transporterInstance = instance(transporter)

const initTransporterMock = () => {
  return transporterInstance
}

jest.spyOn(emailAdapter, 'initTransporter')
  .mockImplementation(initTransporterMock)

afterEach(() => {
  jest.clearAllMocks()
})

describe('#syncTickerPrices', () => {
  const syncAllPrices = jest.fn()
  jest.spyOn(syncTickers, 'syncAllPrices')
    .mockImplementation(syncAllPrices)

  test('could sync ticker prices', async () => {
    await sync.syncTickerPrices(dateTool.getCurrentDate())
    expect(syncAllPrices).toBeCalledTimes(1)
    expect(syncAllPrices).toBeCalledWith(dateTool.getCurrentDate())
  })

  test('could sync ticker prices by a specific date', async () => {
    await sync.syncTickerPrices('2001-01-03')
    expect(syncAllPrices).toBeCalledTimes(1)
    expect(syncAllPrices).toBeCalledWith('2001-01-03')
  })

  test('could throw error for a wrong date', async () => {
    expect(async () => await sync.syncTickerPrices('20010103')).rejects.toThrowError()
  })
})

describe('#syncTickerEarnings', () => {
  const syncAllEarnings = jest.fn()
  jest.spyOn(syncTickers, 'syncAllEarnings')
    .mockImplementation(syncAllEarnings)

  test('could sync ticker earnings', async () => {
    await sync.syncTickerEarnings(dateTool.getCurrentQuater(), false, null)
    expect(syncAllEarnings).toBeCalledTimes(1)
    expect(syncAllEarnings).toBeCalledWith(dateTool.getCurrentQuater(), false, null)
  })

  test('could sync ticker earnings till a specific quarter', async () => {
    await sync.syncTickerEarnings('2012-03', false, null)
    expect(syncAllEarnings).toBeCalledTimes(1)
    expect(syncAllEarnings).toBeCalledWith('2012-03', false, null)
  })

  test('could throw error for a wrong quarter', async () => {
    expect(async () => await sync.syncTickerEarnings('201203', false, null)).rejects.toThrowError()
  })

  test('could sync ticker earnings and force recheck', async () => {
    await sync.syncTickerEarnings('2012-03', true, null)
    expect(syncAllEarnings).toBeCalledTimes(1)
    expect(syncAllEarnings).toBeCalledWith('2012-03', true, null)
  })

  test('could sync ticker earnings and target a ticker', async () => {
    await sync.syncTickerEarnings('2012-03', true, 12)
    expect(syncAllEarnings).toBeCalledTimes(1)
    expect(syncAllEarnings).toBeCalledWith('2012-03', true, 12)
  })
})

describe('#syncTickerIncomes', () => {
  const syncAllIncomes = jest.fn()
  jest.spyOn(syncTickers, 'syncAllIncomes')
    .mockImplementation(syncAllIncomes)

  test('could sync ticker incomes', async () => {
    await sync.syncTickerIncomes(dateTool.getCurrentQuater(), false, null)
    expect(syncAllIncomes).toBeCalledTimes(1)
    expect(syncAllIncomes).toBeCalledWith(dateTool.getCurrentQuater(), false, null)
  })

  test('could sync ticker incomes till a specific quarter', async () => {
    await sync.syncTickerIncomes('2012-03', false, null)
    expect(syncAllIncomes).toBeCalledTimes(1)
    expect(syncAllIncomes).toBeCalledWith('2012-03', false, null)
  })

  test('could throw error for a wrong quarter', async () => {
    expect(async () => await sync.syncTickerIncomes('201203', false, null)).rejects.toThrowError()
  })

  test('could sync ticker incomes and force recheck', async () => {
    await sync.syncTickerIncomes('2012-03', true, null)
    expect(syncAllIncomes).toBeCalledTimes(1)
    expect(syncAllIncomes).toBeCalledWith('2012-03', true, null)
  })

  test('could sync ticker incomes and target a ticker', async () => {
    await sync.syncTickerIncomes('2012-03', true, 12)
    expect(syncAllIncomes).toBeCalledTimes(1)
    expect(syncAllIncomes).toBeCalledWith('2012-03', true, 12)
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
})
