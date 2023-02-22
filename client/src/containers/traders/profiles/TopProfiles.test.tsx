import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { act, fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import TopProfiles from './TopProfiles'
import axios from 'axios'

afterAll(() => {
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
  const actual = jest.requireActual('react-router-dom')
  return {
    __esModule: true,
    ...actual,
    useNavigate: () => navigate,
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
          pastYear: [2],
          pastQuarter: [3],
          pastMonth: [4],
          pastWeek: [5],
        }
      })

    jest.spyOn(selectors, 'selectTraderProfileBaseDict')
      .mockImplementation(() => () => {
        return {
          1: {
            trader: {
              ...instance(traderType), id: 1, traderEnvId: 1, traderPatternId: 11, accessCode: 'aaa',
            },
            pattern: { ...instance(patternType) },
          },
          2: {
            trader: {
              ...instance(traderType), id: 2, traderEnvId: 1, traderPatternId: 12, accessCode: 'bbb',
            },
            pattern: { ...instance(patternType) },
          },
          3: {
            trader: {
              ...instance(traderType), id: 3, traderEnvId: 1, traderPatternId: 13, accessCode: 'ccc',
            },
            pattern: { ...instance(patternType) },
          },
          4: {
            trader: {
              ...instance(traderType), id: 4, traderEnvId: 1, traderPatternId: 14, accessCode: 'ddd',
            },
            pattern: { ...instance(patternType) },
          },
          5: {
            trader: {
              ...instance(traderType), id: 5, traderEnvId: 1, traderPatternId: 15, accessCode: 'eee',
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
    expect(screen.getByTestId('profileLabel').innerHTML).toContain('11')

    fireEvent.click(screen.getByTestId('variantPAST_YEAR'))
    expect(screen.getByTestId('profileLabel').innerHTML).toContain('12')

    fireEvent.click(screen.getByTestId('variantPAST_QUARTER'))
    expect(screen.getByTestId('profileLabel').innerHTML).toContain('13')

    fireEvent.click(screen.getByTestId('variantPAST_MONTH'))
    expect(screen.getByTestId('profileLabel').innerHTML).toContain('14')

    fireEvent.click(screen.getByTestId('variantPAST_WEEK'))
    expect(screen.getByTestId('profileLabel').innerHTML).toContain('15')

    fireEvent.click(screen.getByTestId('variantYEARLY'))
    expect(screen.getByTestId('profileLabel').innerHTML).toContain('11')

    fireEvent.click(screen.getByTestId('traderProfileCard'))
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/traders/profiles/1/aaa')
  })

  test('could trigger fetch function', async () => {
    const get = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation(async () => {
      get()
      return {
        data: {
          yearly: [],
          pastYear: [],
          pastQuarter: [],
          pastMonth: [],
          pastWeek: [],
        },
      }
    })

    jest.spyOn(selectors, 'selectSystemTopTraders')
      .mockImplementation(() => () => {
        return undefined
      })

    await act(() => {
      render(<TopProfiles />)
    })

    expect(get).toBeCalledTimes(1)
  })
})
