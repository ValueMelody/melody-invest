import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as selectors from 'selectors'
import { act, fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import TickerDetail from './TickerDetail'
import axios from 'axios'

afterEach(() => {
  jest.clearAllMocks()
})

jest.mock('selectors', () => {
  return {
    __esModule: true,
    ...jest.requireActual('selectors'),
  }
})

const navigate = jest.fn()
jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => navigate,
    useParams: () => ({
      envId: '1',
      tickerId: '1',
    }),
  }
})

const envType = mock<interfaces.traderEnvModel.Record>({})
const env1 = { ...instance(envType), id: 1, isSystem: true }
const env2 = { ...instance(envType), id: 2, isSystem: true }
const tickerType = mock<interfaces.tickerModel.Identity>({})
const ticker = { ...instance(tickerType), id: 1, name: 'AAPL' }

jest.spyOn(selectors, 'selectTraderEnvBases')
  .mockImplementation(() => () => {
    return [env1, env2]
  })

jest.spyOn(selectors, 'selectTickerIdentityBaseById')
  .mockImplementation(() => () => {
    return ticker
  })

jest.spyOn(axios, 'get')
  .mockImplementation(async () => {
    return {
      data: {
        topProfiles: {
          yearly: [],
          pastYear: [],
          pastQuarter: [],
          pastMonth: [],
          pastWeek: [],
        },
      },
    }
  })

describe('#TickerDetail', () => {
  test('could show ticker info', async () => {
    jest.spyOn(selectors, 'selectTraderEnvBaseById')
      .mockImplementation((id?: number) => () => {
        if (id === 1) return env1
        if (id === 2) return env2
        return undefined
      })
    await act(() => {
      render(<TickerDetail />)
    })

    expect(screen.queryByText('AAPL')).toBeInTheDocument()
    const envs = screen.queryAllByTestId('traderEnvCard')
    expect(envs.length).toBe(2)

    fireEvent.click(envs[1])
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/tickers/1/envs/2')
  })

  test('could indicate is delisted', async () => {
    jest.spyOn(selectors, 'selectTraderEnvBaseById')
      .mockImplementation(() => () => env1)
    jest.spyOn(selectors, 'selectTickerIdentityBaseById')
      .mockImplementation(() => () => {
        return {
          ...ticker,
          isDelisted: true,
        }
      })
    await act(() => {
      render(<TickerDetail />)
    })

    const title = screen.getByTestId('detail-title')
    expect(title.innerHTML).toContain(localeTool.t('ticker.delisted'))
  })

  test('could show empty if ticker not found', async () => {
    jest.spyOn(selectors, 'selectTraderEnvBaseById')
      .mockImplementation(() => () => env1)
    jest.spyOn(selectors, 'selectTickerIdentityBaseById')
      .mockImplementation(() => () => undefined)
    jest.spyOn(selectors, 'selectHasTickerIdentity')
      .mockImplementation(() => () => true)
    await act(() => {
      render(<TickerDetail />)
    })

    expect(screen.queryByTestId('detail-root')).not.toBeInTheDocument()
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/404')
  })

  test('could show empty if env not found', async () => {
    jest.spyOn(selectors, 'selectTraderEnvBaseById')
      .mockImplementation(() => () => undefined)
    jest.spyOn(selectors, 'selectTickerIdentityBaseById')
      .mockImplementation(() => () => ticker)
    await act(() => {
      render(<TickerDetail />)
    })

    expect(screen.queryByTestId('detail-root')).not.toBeInTheDocument()
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/404')
  })
})
