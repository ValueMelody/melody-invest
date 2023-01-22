import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { act, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import EnvDetail from './EnvDetail'
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
      }
    ),
  }
})

const envType = mock<interfaces.traderEnvModel.Record>({})
const env = { ...instance(envType), id: 1, name: 'test env' }

describe('#TickerDetail', () => {
  test('could show env info', async () => {
    jest.spyOn(selectors, 'selectTraderEnvBaseById')
      .mockImplementation(() => () => {
        return env
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
      render(<EnvDetail />)
    })

    expect(screen.queryByTestId('traderEnvCard')?.innerHTML).toContain('test env')
  })
})
