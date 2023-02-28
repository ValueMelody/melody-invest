import * as interfaces from '@shared/interfaces'
import * as router from 'react-router-dom'
import * as selectors from 'selectors'
import { act, fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import TopCombos from './TopCombos'
import axios from 'axios'
import { contentSlice } from 'stores/content'
import { store } from 'stores'
import { traderComboSlice } from 'stores/traderCombo'

afterEach(() => {
  jest.clearAllMocks()
  store.dispatch(contentSlice.actions._resetForTest())
  store.dispatch(traderComboSlice.actions._resetForTest())
})

jest.mock('selectors', () => {
  return {
    __esModule: true,
    ...jest.requireActual('selectors'),
  }
})

const comboType = mock<interfaces.traderComboModel.Identity>({})
const combo = {
  ...instance(comboType),
  id: -1,
  isSystem: true,
  name: 'default combo',
  traderIds: [1, 2, 3, 4],
}

const combo1 = {
  ...instance(comboType),
  id: -2,
  isSystem: true,
  name: 'another combo',
  traderIds: [],
}

const comboDetail = mock<interfaces.response.ComboDetail>({})
const detail = { ...instance(comboDetail), holdings: [] }

const holdingType = mock<interfaces.traderHoldingModel.Record>({})

jest.mock('react-router-dom', () => {
  return {
    __esModule: true,
    ...jest.requireActual('react-router-dom'),
  }
})

const navigate = jest.fn()
jest.spyOn(router, 'useNavigate')
  .mockImplementation(() => navigate)

jest.spyOn(selectors, 'selectTraderComboBases')
  .mockImplementation(() => () => {
    return [combo, combo1]
  })

const traderType = mock<interfaces.traderModel.Record>({})
const patternType = mock<interfaces.traderPatternModel.Public>({})
jest.spyOn(selectors, 'selectTraderProfileBaseDict')
  .mockImplementation(() => () => {
    return {
      1: {
        trader: {
          ...instance(traderType),
          accessCode: 'aa11',
          traderPatternId: 1,
          traderEnvId: 1,
          id: 1,
        },
        pattern: instance(patternType),
      },
      2: {
        trader: {
          ...instance(traderType),
          traderPatternId: 2,
          traderEnvId: 1,
          id: 2,
        },
        pattern: instance(patternType),
      },
      3: {
        trader: {
          ...instance(traderType),
          traderPatternId: 2,
          traderEnvId: 2,
          id: 3,
        },
        pattern: instance(patternType),
      },
    }
  })

const envType = mock<interfaces.traderEnvModel.Record>({})
jest.spyOn(selectors, 'selectTraderEnvBaseDict')
  .mockImplementation(() => () => {
    return {
      1: instance(envType),
    }
  })

const get = jest.fn()
const identity = mock<interfaces.traderComboModel.Identity>({})
jest.spyOn(axios, 'get').mockImplementation(async () => {
  get()
  return {
    data: [
      {
        identity: {
          ...instance(identity),
          id: -1,
        },
        detail: {
          profiles: [],
          holdings: [],
          totalValue: 1000,
          oneDecadeTrends: [999, 998, 997],
          oneYearTrends: [1111, 1112, 1113, 1114],
        },
      },
      {
        identity: {
          ...instance(identity),
          id: -2,
        },
        detail: {
          profiles: [],
          holdings: [],
        },
      },
    ],
  }
})

describe('#TopCombos', () => {
  test('could render combo', async () => {
    jest.spyOn(selectors, 'selectTraderComboDetailById')
      .mockImplementationOnce(() => () => {
        const date = new Date()
        return {
          ...detail,
          totalValue: 1000,
          oneDecadeTrends: [999, 998, 997],
          oneYearTrends: [1111, 1112, 1113, 1114],
          yearlyPercentNumber: 10000,
          pastYearPercentNumber: 2000,
          pastQuarterPercentNumber: 1000,
          pastMonthPercentNumber: 500,
          pastWeekPercentNumber: 100,
          holdings: (new Array(20)).fill(null).map((_, index) => {
            return {
              ...instance(holdingType),
              date: (date.setDate(date.getDate() + index)).toString(),
              items: [],
            }
          }),
        }
      })

    await act(() => {
      render(<TopCombos />)
    })

    const comboCards = screen.getAllByTestId('traderComboCard')
    expect(comboCards.length).toBe(2)
    expect(screen.getAllByTestId('traderComboCardName')[0]?.innerHTML).toContain('default combo')
    expect(screen.getAllByTestId('traderComboCardName')[1]?.innerHTML).toContain('another combo')
    const profiles = screen.getAllByTestId('profileValue')
    expect(profiles.length).toBe(2)
    expect(screen.getAllByTestId('holdingCard').length).toBe(20)

    fireEvent.click(profiles[0])
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/traders/profiles/1/aa11')

    expect(screen.getByTestId('yearlyNumber').innerHTML).toBe('100%')
    expect(screen.getByTestId('pastYearNumber').innerHTML).toBe('20%')
    expect(screen.getByTestId('pastQuarterNumber').innerHTML).toBe('10%')
    expect(screen.getByTestId('pastMonthNumber').innerHTML).toBe('5%')
    expect(screen.getByTestId('pastWeekNumber').innerHTML).toBe('1%')

    await act(() => {
      fireEvent.click(comboCards[1])
    })
    const newProfiles = screen.queryAllByTestId('profileValue')
    expect(newProfiles.length).toBe(0)

    expect(screen.queryByTestId('decadeChartBtn')).not.toBeInTheDocument()
    expect(screen.queryByTestId('yearChartBtn')).not.toBeInTheDocument()
    expect(screen.queryByTestId('decadeChart')).not.toBeInTheDocument()
    expect(screen.queryByTestId('yearChart')).not.toBeInTheDocument()

    expect(screen.queryByTestId('yearlyNumber')?.innerHTML).toBeUndefined()
    expect(screen.queryByTestId('pastYearNumber')?.innerHTML).toBeUndefined()
    expect(screen.queryByTestId('pastQuarterNumber')?.innerHTML).toBeUndefined()
    expect(screen.queryByTestId('pastMonthNumber')?.innerHTML).toBeUndefined()
    expect(screen.queryByTestId('pastWeekNumber')?.innerHTML).toBeUndefined()
  })

  test('could fetch combo', async () => {
    await act(() => {
      render(<TopCombos />)
    })

    expect(get).toBeCalledTimes(1)

    expect(screen.queryByTestId('decadeChartBtn')).toBeInTheDocument()
    expect(screen.queryByTestId('yearChartBtn')).toBeInTheDocument()
    expect(screen.queryByTestId('decadeChart')).toBeInTheDocument()
    expect(screen.queryByTestId('yearChart')).not.toBeInTheDocument()
    await act(() => {
      fireEvent.click(screen.getByTestId('yearChartBtn'))
    })
    expect(screen.queryByTestId('decadeChart')).not.toBeInTheDocument()
    expect(screen.queryByTestId('yearChart')).toBeInTheDocument()
  })

  test('could handle no combos', async () => {
    jest.spyOn(selectors, 'selectTraderComboBases')
      .mockImplementation(() => () => {
        return []
      })

    await act(() => {
      render(<TopCombos />)
    })

    expect(screen.queryByTestId('topCombos')).not.toBeInTheDocument()
  })
})
