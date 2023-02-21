import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { act, fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import EnvDetail from './EnvDetail'
import axios from 'axios'

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
    useParams: () => (
      {
        envId: '1',
      }
    ),
  }
})

const envType = mock<interfaces.traderEnvModel.Record>({})
const env = { ...instance(envType), id: 1, name: 'test env', tickerIds: [1, 2] }

const tickerType = mock<interfaces.tickerModel.Identity>({})
const ticker1 = { ...instance(tickerType), id: 1 }
const ticker2 = { ...instance(tickerType), id: 2 }

describe('#TickerDetail', () => {
  test('could show env info', async () => {
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

    await act(() => {
      render(<EnvDetail />)
    })

    expect(screen.queryByTestId('traderEnvCard')?.innerHTML).toContain('test env')
    const tickers = screen.getAllByTestId('tickerLabel')
    expect(tickers.length).toBe(2)

    fireEvent.click(tickers[1])
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/tickers/2/envs/1')
  })
})
