import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as selectors from 'selectors'
import { act, fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import TraderProfileCard from './TraderProfileCard'
import { UserState } from 'stores/user'
import axios from 'axios'
import { contentSlice } from 'stores/content'
import { store } from 'stores'

afterEach(() => {
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
    userTraderIds: [12],
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

const remove = jest.fn()
jest.spyOn(axios, 'delete')
  .mockImplementation(async (url) => {
    remove(url)
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
  test('could render profile', async () => {
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
    expect(post).toBeCalledWith('http://127.0.0.1:3100/traders/profiles/11')

    fireEvent.click(screen.getByTestId('forkBtn'))
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/traders/profiles/build', expect.anything())
  })

  test('could unfollow a profile', async () => {
    await act(() => {
      render(
        <TraderProfileCard
          profile={{
            trader: {
              ...traderType,
              id: 12,
            },
            pattern: patternType,
          }}
          isActive
        />,
      )
    })

    await act(() => {
      fireEvent.click(screen.getByTestId('watchButton'))
    })
    expect(remove).toBeCalledTimes(1)
    expect(remove).toBeCalledWith('http://127.0.0.1:3100/traders/profiles/12')
  })

  test('could prevent by permission', async () => {
    jest.spyOn(selectors, 'selectUser')
      .mockImplementation(() => () => ({
        ...instance(userType),
        userType: 2,
        userTraderIds: [],
        access: {
          ...instance(userType).access,
          canFollowTrader: false,
        },
      }))

    await act(() => {
      render(
        <TraderProfileCard
          profile={{
            trader: {
              ...traderType,
              id: 12,
            },
            pattern: patternType,
          }}
          isActive
        />,
      )
    })

    await act(() => {
      fireEvent.click(screen.getByTestId('watchButton'))
    })
    expect(post).toBeCalledTimes(0)
    expect(store.getState().global.messages[0].title).toBe(localeTool.t('permission.limited'))
    expect(store.getState().global.messages[0].type).toBe('failure')

    fireEvent.click(screen.getByTestId('traderProfileCard'))
    expect(navigate).toBeCalledTimes(0)
  })

  test('do not render when there is no trader', async () => {
    await act(() => {
      render(
        <TraderProfileCard
          isActive
        />,
      )
    })

    expect(screen.queryByTestId('traderProfileCard')).not.toBeInTheDocument()
  })
})
