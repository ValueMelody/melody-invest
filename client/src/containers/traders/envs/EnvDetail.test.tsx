import * as interfaces from '@shared/interfaces'
import * as router from 'react-router-dom'
import * as selectors from 'selectors'
import { act, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import axios from 'axios'
import EnvDetail from './EnvDetail'

afterEach(() => {
  jest.clearAllMocks()
})

jest.mock('selectors', () => {
  return {
    __esModule: true,
    ...jest.requireActual('selectors'),
  }
})

jest.mock('react-router-dom', () => {
  return {
    __esModule: true,
    ...jest.requireActual('react-router-dom'),
  }
})

jest.spyOn(router, 'useParams')
  .mockImplementation(() => {
    return {
      envId: '1',
    }
  })

const navigate = jest.fn()
jest.spyOn(router, 'useNavigate')
  .mockImplementation(() => navigate)

const envType = mock<interfaces.traderEnvModel.Record>({})
const env = { ...instance(envType), id: 1, name: 'test env', tickerIds: [1, 2] }

const tickerType = mock<interfaces.tickerModel.Record>({})
const ticker1 = { ...instance(tickerType), id: 1 }
const ticker2 = { ...instance(tickerType), id: 2 }

jest.spyOn(selectors, 'selectTraderEnvBaseById')
  .mockImplementation(() => () => {
    return env
  })

jest.spyOn(selectors, 'selectTickerIdentityBaseDict')
  .mockImplementation(() => () => ({
    1: ticker1,
    2: ticker2,
  }))

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
  test('could show env info', async () => {
    await act(() => {
      render(<EnvDetail />)
    })

    expect(screen.queryByTestId('traderEnvCard')?.innerHTML).toContain('test env')
    const tickers = screen.getAllByTestId('tickerLabel')
    expect(tickers.length).toBe(2)
  })

  test('could handle no envId', async () => {
    jest.spyOn(router, 'useParams')
      .mockImplementation(() => {
        return {}
      })

    await act(() => {
      render(<EnvDetail />)
    })

    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/404')
  })
})
