import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { act, fireEvent, render, screen } from 'test.utils'
import TraderProfileCard from './TraderProfileCard'
import { instance, mock } from 'ts-mockito'
import { UserState } from 'stores/user'
import { contentSlice } from 'stores/content'
import { store } from 'stores'
import axios from 'axios'

afterAll(() => {
  jest.clearAllMocks()
  store.dispatch(contentSlice.actions._resetForTest())
})

const traderType = mock<interfaces.traderModel.Record>({})
const patternType = mock<interfaces.traderPatternModel.Public>({})

jest.mock('selectors', () => {
  const actual = jest.requireActual('selectors')
  return {
    __esModule: true,
    ...actual,
  }
})

const userType = mock<UserState>({})

jest.spyOn(selectors, 'selectUser')
  .mockImplementation(() => () => ({
    ...instance(userType),
    userType: 2,
    userTraderIds: [],
    access: {
      ...instance(userType).access,
      canFollowTrader: true,
      accessibleComboIds: [],
    },
  }))

const post = jest.fn()
jest.spyOn(axios, 'post')
  .mockImplementation(async (url) => {
    post(url)
    return { data: true }
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

const envType = mock<interfaces.traderEnvModel.Record>({})
jest.spyOn(selectors, 'selectTraderEnvBaseById')
  .mockImplementation(() => () => instance(envType))

describe('#TraderProfileCard', () => {
  test('could fork a profile', async () => {
    await act(() => {
      render(
        <TraderProfileCard
          profile={{
            trader: {
              ...traderType,
              id: 11,
              totalValue: 10000,
              oneYearTrends: [1000, 2000],
              oneDecadeTrends: [10000, 20000],
            },
            pattern: patternType,
          }}
          isActive
        />,
      )
    })

    expect(store.getState().content.activeTraderChartIndex).toBe(0)
    fireEvent.click(screen.getByTestId('yearChartBtn'))
    expect(store.getState().content.activeTraderChartIndex).toBe(1)
    fireEvent.click(screen.getByTestId('decadeChartBtn'))
    expect(store.getState().content.activeTraderChartIndex).toBe(0)

    await act(() => {
      fireEvent.click(screen.getByTestId('watchButton'))
    })
    expect(post).toBeCalledTimes(1)

    fireEvent.click(screen.getByTestId('forkBtn'))
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/traders/profiles/build', expect.anything())
  })
})
