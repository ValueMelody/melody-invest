import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { act, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import ComboDetail from './ComboDetail'

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
        comboId: '1',
      }
    ),
  }
})

const comboType = mock<interfaces.traderComboModel.Identity>({})
const combo = { ...instance(comboType), id: 1, name: 'test combo', traderIds: [1, 2] }
const comboDetail = mock<interfaces.response.ComboDetail>({})
const detail = {
  ...instance(comboDetail),
  holdings: [],
}

describe('#ComboDetail', () => {
  test('could show combo info', async () => {
    jest.spyOn(selectors, 'selectTraderComboBaseById')
      .mockImplementation(() => () => {
        return combo
      })
    jest.spyOn(selectors, 'selectTraderComboDetailById')
      .mockImplementation(() => () => {
        return detail
      })

    const envType = mock<interfaces.traderEnvModel.Record>({})
    jest.spyOn(selectors, 'selectTraderEnvBaseDict')
      .mockImplementation(() => () => {
        return {
          1: instance(envType),
        }
      })

    const traderType = mock<interfaces.traderModel.Record>({})
    const patternType = mock<interfaces.traderPatternModel.Public>({})
    jest.spyOn(selectors, 'selectTraderProfileBaseDict')
      .mockImplementation(() => () => {
        return {
          1: {
            trader: {
              ...instance(traderType),
              id: 1,
              traderPatternId: 1,
              traderEnvId: 1,
            },
            pattern: instance(patternType),
          },
          2: {
            trader: {
              ...instance(traderType),
              id: 2,
              traderPatternId: 2,
              traderEnvId: 1,
            },
            pattern: instance(patternType),
          },
        }
      })

    await act(() => {
      render(<ComboDetail />)
    })

    expect(screen.queryByTestId('traderComboCardName')?.innerHTML).toContain('test combo')
    const profiles = screen.getAllByTestId('profileValue')
    expect(profiles.length).toBe(2)
  })
})
