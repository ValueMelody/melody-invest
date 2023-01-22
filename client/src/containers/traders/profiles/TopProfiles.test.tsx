import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { act, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import TopProfiles from './TopProfiles'

jest.mock('selectors', () => {
  return {
    __esModule: true,
    ...jest.requireActual('selectors'),
  }
})

const traderType = mock<interfaces.traderModel.Record>({})
const patternType = mock<interfaces.traderPatternModel.Public>({})
const envType = mock<interfaces.traderEnvModel.Record>({})

describe('#TopProfiles', () => {
  test('could show top profiles', async () => {
    jest.spyOn(selectors, 'selectSystemTopTraders')
      .mockImplementation(() => () => {
        return {
          yearly: [1],
          pastYear: [],
          pastQuarter: [],
          pastMonth: [],
          pastWeek: [],
        }
      })

    jest.spyOn(selectors, 'selectTraderProfileBaseDict')
      .mockImplementation(() => () => {
        return {
          1: {
            trader: {
              ...instance(traderType), id: 1, traderEnvId: 1,
            },
            pattern: { ...instance(patternType) },
          },
        }
      })

    jest.spyOn(selectors, 'selectTraderEnvBaseById')
      .mockImplementation(() => () => {
        return instance(envType)
      })

    await act(() => {
      render(<TopProfiles />)
    })

    expect(screen.getAllByTestId('traderProfileCard').length).toBe(1)
  })
})
