import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { act, fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import ComboDetail from './ComboDetail'
import { GlobalState } from 'stores/global'

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

const globalState = mock<GlobalState>({})
jest.spyOn(selectors, 'selectGlobal')
  .mockImplementation(() => () => ({
    ...instance(globalState),
    refreshToken: '123',
  }))

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
              accessCode: 'aaa',
            },
            pattern: instance(patternType),
          },
          2: {
            trader: {
              ...instance(traderType),
              id: 2,
              traderPatternId: 2,
              traderEnvId: 1,
              accessCode: 'bbb',
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

    fireEvent.click(profiles[1])
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/traders/profiles/2/bbb')
  })
})
