import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { act, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import TickerDetail from './TickerDetail'
import axios from 'axios'

jest.mock('selectors', () => {
  return {
    __esModule: true,
    ...jest.requireActual('selectors'),
  }
})

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: () => (
      {
        envId: '1',
        tickerId: '1',
      }
    ),
  }
})

const envType = mock<interfaces.traderEnvModel.Record>({})
const env = { ...instance(envType), id: 1 }
const tickerType = mock<interfaces.tickerModel.Identity>({})
const ticker = { ...instance(tickerType), id: 1, name: 'AAPL' }

describe('#TickerDetail', () => {
  test('could show ticker info', async () => {
    jest.spyOn(selectors, 'selectTraderEnvBases')
      .mockImplementation(() => () => {
        return [env]
      })

    jest.spyOn(selectors, 'selectTraderEnvBaseById')
      .mockImplementation(() => () => {
        return env
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

    await act(() => {
      render(<TickerDetail />)
    })

    expect(screen.queryByText('AAPL')).toBeInTheDocument()
  })
})
