import * as interfaces from '@shared/interfaces'
import * as parseTool from 'tools/parse'
import * as selectors from 'selectors'
import { act, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import BehaviorDetail from './BehaviorDetail'
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
        behavior: 'priceDailyIncreaseBuy',
      }
    ),
  }
})

const envType = mock<interfaces.traderEnvModel.Record>({})
const env = { ...instance(envType), id: 1 }

describe('#BehaviorDetail', () => {
  test('could show behavior info', async () => {
    jest.spyOn(selectors, 'selectTraderEnvBases')
      .mockImplementation(() => () => {
        return [env]
      })

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
      render(<BehaviorDetail />)
    })

    expect(screen.queryByText(parseTool.behaviorTitle('priceDailyIncreaseBuy'))).toBeInTheDocument()
  })
})
