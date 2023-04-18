import * as interfaces from '@shared/interfaces'
import * as router from 'react-router-dom'
import * as selectors from 'selectors'
import { act, fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import ComboDetail from './ComboDetail'
import { GlobalState } from 'stores/global'
import axios from 'axios'

afterEach(() => {
  jest.clearAllMocks()
})

const holdingType = mock<interfaces.traderHoldingModel.Record>({})
const comboType = mock<interfaces.traderComboModel.Identity>({})
const combo = { ...instance(comboType), id: 1, name: 'test combo', traderIds: [1, 2] }
const comboDetail = mock<interfaces.response.ComboDetail>({})
const date = new Date()
const detail = {
  ...instance(comboDetail),
  id: 1,
  holdings: (new Array(15)).fill(null).map((_, index) => {
    return {
      ...instance(holdingType),
      totalValue: index + 1,
      date: (date.setDate(date.getDate() + index)).toString(),
      items: [],
    }
  }),
  profiles: [],
  totalValue: 1000,
  oneDecadeTrends: [999, 999, 998],
  oneYearTrends: [111, 111, 112],
  yearlyPercentNumber: 10000,
  pastYearPercentNumber: 2000,
  pastQuarterPercentNumber: 1000,
  pastMonthPercentNumber: 500,
  pastWeekPercentNumber: 100,
}

const get = jest.fn()
jest.spyOn(axios, 'get').mockImplementation(async (url) => {
  get(url)
  return { data: detail }
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

const navigate = jest.fn()
jest.spyOn(router, 'useNavigate')
  .mockImplementation(() => navigate)
jest.spyOn(router, 'useParams')
  .mockImplementation(() => {
    return {
      comboId: '1',
    }
  })

const globalState = mock<GlobalState>({})
jest.spyOn(selectors, 'selectGlobal')
  .mockImplementation(() => () => ({
    ...instance(globalState),
    refreshToken: '123',
  }))

jest.spyOn(selectors, 'selectTraderComboBaseById')
  .mockImplementation((id: number | undefined) => () => {
    if (id !== 1) return undefined
    return {
      ...combo,
      traderIds: [1, 2, 3],
    }
  })

const envType = mock<interfaces.traderEnvModel.Identity>({})
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

describe('#ComboDetail', () => {
  test('could show combo info', async () => {
    await act(() => {
      render(<ComboDetail />)
    })

    expect(get).toBeCalledTimes(1)
    expect(get).toBeCalledWith('http://127.0.0.1:3100/traders/combos/1')

    expect(screen.queryByTestId('traderComboCardName')?.innerHTML).toContain('test combo')
    const profiles = screen.getAllByTestId('profileValue')
    expect(profiles.length).toBe(2)

    const holdings = screen.getAllByTestId('holdingCard')
    expect(holdings.length).toBe(5)
    await act(() => {
      fireEvent.click(screen.getByTestId('showMore'))
    })
    expect(screen.getAllByTestId('holdingCard').length).toBe(15)
    expect(screen.getAllByTestId('holdingDiffer').length).toBe(14)

    expect(screen.getByTestId('yearlyNumber').innerHTML).toBe('100%')
    expect(screen.getByTestId('pastYearNumber').innerHTML).toBe('20%')
    expect(screen.getByTestId('pastQuarterNumber').innerHTML).toBe('10%')
    expect(screen.getByTestId('pastMonthNumber').innerHTML).toBe('5%')
    expect(screen.getByTestId('pastWeekNumber').innerHTML).toBe('1%')

    expect(screen.queryByTestId('decadeChart')).toBeInTheDocument()
    expect(screen.queryByTestId('yearChart')).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('yearChartBtn'))
    expect(screen.queryByTestId('decadeChart')).not.toBeInTheDocument()
    expect(screen.queryByTestId('yearChart')).toBeInTheDocument()

    fireEvent.click(profiles[1])
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/traders/profiles/2/bbb')
  })

  test('could redirect if combo not exist', async () => {
    jest.spyOn(router, 'useParams')
      .mockImplementation(() => {
        return {}
      })

    await act(() => {
      render(<ComboDetail />)
    })
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/404')
  })

  test('render nothing if combo not found', async () => {
    jest.spyOn(router, 'useParams')
      .mockImplementation(() => {
        return {
          comboId: '2',
        }
      })

    await act(() => {
      render(<ComboDetail />)
    })
    expect(screen.queryByTestId('comboDetail')).not.toBeInTheDocument()
  })
})
