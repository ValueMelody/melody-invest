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
    process.argv[3] = ''
    await sync.syncTickerPrices()
    expect(syncAllPrices).toBeCalledTimes(1)
    expect(syncAllPrices).toBeCalledWith(dateTool.getCurrentDate())
  })

  test('could sync ticker prices by a specific date', async () => {
    process.argv[3] = '2001-01-03'
    await sync.syncTickerPrices()
    expect(syncAllPrices).toBeCalledTimes(1)
    expect(syncAllPrices).toBeCalledWith('2001-01-03')
  })

  test('could throw error for a wrong date', async () => {
    process.argv[3] = '20010103'
    expect(async () => await sync.syncTickerPrices()).rejects.toThrowError()
  })
})

describe('#syncTickerEarnings', () => {
  const syncAllEarnings = jest.fn()
  jest.spyOn(syncTickers, 'syncAllEarnings')
    .mockImplementation(syncAllEarnings)

  test('could sync ticker earnings', async () => {
    process.argv[3] = ''
    process.argv[4] = ''
    process.argv[5] = ''
    await sync.syncTickerEarnings()
    expect(syncAllEarnings).toBeCalledTimes(1)
    expect(syncAllEarnings).toBeCalledWith(dateTool.getCurrentQuater(), false, null)
  })

  test('could sync ticker earnings till a specific quarter', async () => {
    process.argv[3] = '2012-03'
    process.argv[4] = ''
    process.argv[5] = ''
    await sync.syncTickerEarnings()
    expect(syncAllEarnings).toBeCalledTimes(1)
    expect(syncAllEarnings).toBeCalledWith('2012-03', false, null)
  })

  test('could throw error for a wrong quarter', async () => {
    process.argv[3] = '201203'
    process.argv[4] = ''
    process.argv[5] = ''
    expect(async () => await sync.syncTickerEarnings()).rejects.toThrowError()
  })

  test('could sync ticker earnings and force recheck', async () => {
    process.argv[3] = '2012-03'
    process.argv[4] = 'true'
    process.argv[5] = ''
    await sync.syncTickerEarnings()
    expect(syncAllEarnings).toBeCalledTimes(1)
    expect(syncAllEarnings).toBeCalledWith('2012-03', true, null)
  })

  test('could sync ticker earnings and target a ticker', async () => {
    process.argv[3] = '2012-03'
    process.argv[4] = 'true'
    process.argv[5] = '12'
    await sync.syncTickerEarnings()
    expect(syncAllEarnings).toBeCalledTimes(1)
    expect(syncAllEarnings).toBeCalledWith('2012-03', true, 12)
  })
})

describe('#syncTickerIncomes', () => {
  const syncAllIncomes = jest.fn()
  jest.spyOn(syncTickers, 'syncAllIncomes')
    .mockImplementation(syncAllIncomes)

  test('could sync ticker incomes', async () => {
    process.argv[3] = ''
    process.argv[4] = ''
    process.argv[5] = ''
    await sync.syncTickerIncomes()
    expect(syncAllIncomes).toBeCalledTimes(1)
    expect(syncAllIncomes).toBeCalledWith(dateTool.getCurrentQuater(), false, null)
  })

  test('could sync ticker incomes till a specific quarter', async () => {
    process.argv[3] = '2012-03'
    process.argv[4] = ''
    process.argv[5] = ''
    await sync.syncTickerIncomes()
    expect(syncAllIncomes).toBeCalledTimes(1)
    expect(syncAllIncomes).toBeCalledWith('2012-03', false, null)
  })

  test('could throw error for a wrong quarter', async () => {
    process.argv[3] = '201203'
    process.argv[4] = ''
    process.argv[5] = ''
    expect(async () => await sync.syncTickerIncomes()).rejects.toThrowError()
  })

  test('could sync ticker incomes and force recheck', async () => {
    process.argv[3] = '2012-03'
    process.argv[4] = 'true'
    process.argv[5] = ''
    await sync.syncTickerIncomes()
    expect(syncAllIncomes).toBeCalledTimes(1)
    expect(syncAllIncomes).toBeCalledWith('2012-03', true, null)
  })

  test('could sync ticker incomes and target a ticker', async () => {
    process.argv[3] = '2012-03'
    process.argv[4] = 'true'
    process.argv[5] = '12'
    await sync.syncTickerIncomes()
    expect(syncAllIncomes).toBeCalledTimes(1)
    expect(syncAllIncomes).toBeCalledWith('2012-03', true, 12)
  })
})

describe('#syncMonthlyIndicators', () => {
  const syncAllMonthlyIndicators = jest.fn()
  jest.spyOn(syncIndicators, 'syncAllMonthlyIndicators')
    .mockImplementation(syncAllMonthlyIndicators)

  test('could sync monthly indicators', async () => {
    await sync.syncMonthlyIndicators()
    expect(syncAllMonthlyIndicators).toBeCalledTimes(1)
  })
})

describe('#syncQuarterlyIndicators', () => {
  const syncQuarterly = jest.fn()
  jest.spyOn(syncIndicators, 'syncQuarterly')
    .mockImplementation(syncQuarterly)

  test('could sync quarterly indicators', async () => {
    await sync.syncQuarterlyIndicators()
    expect(syncQuarterly).toBeCalledTimes(1)
    expect(syncQuarterly).toBeCalledWith(marketEnum.Type.GDP)
  })
})

describe('#syncYearlyIndicators', () => {
  const syncAllYearlyIndicators = jest.fn()
  jest.spyOn(syncIndicators, 'syncAllYearlyIndicators')
    .mockImplementation(syncAllYearlyIndicators)

  test('could sync monthly indicators', async () => {
    await sync.syncYearlyIndicators()
    expect(syncAllYearlyIndicators).toBeCalledTimes(1)
  })
})
