import * as interfaces from '@shared/interfaces'
import * as parseTool from 'tools/parse'
import * as router from 'react-router-dom'
import * as selectors from 'selectors'
import { UserAccess, UserState } from 'stores/user'
import { act, fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import BehaviorDetail from './BehaviorDetail'
import { GlobalState } from 'stores/global'
import axios from 'axios'

afterEach(() => {
  jest.clearAllMocks()
})

jest.mock('selectors', () => {
  return {
    __esModule: true,
    ...jest.requireActual('selectors'),
  }
})

const globalState = mock<GlobalState>({})
jest.spyOn(selectors, 'selectGlobal')
  .mockImplementation(() => () => ({
    ...instance(globalState),
    refreshToken: '123',
  }))

jest.mock('react-router-dom', () => {
  return {
    __esModule: true,
    ...jest.requireActual('react-router-dom'),
  }
})

const navigate = jest.fn()
jest.spyOn(router, 'useParams')
  .mockImplementation(() => ({
    envId: '1',
    behavior: 'priceDailyIncreaseBuy',
  }))
jest.spyOn(router, 'useNavigate')
  .mockImplementation(() => navigate)

const envType = mock<interfaces.traderEnvModel.Identity>({})
const env1 = { ...instance(envType), id: 1 }
const env2 = { ...instance(envType), id: 2 }

jest.spyOn(selectors, 'selectTraderEnvBases')
  .mockImplementation(() => () => {
    return [env1, env2]
  })

jest.spyOn(selectors, 'selectTraderEnvBaseById')
  .mockImplementation((id: number | undefined) => () => {
    if (!id) return undefined
    return { 1: env1, 2: env2 }[id]
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

describe('#BehaviorDetail', () => {
  test('could show behavior info', async () => {
    const userType = mock<UserState>({})
    const accessType = mock<UserAccess>({})
    jest.spyOn(selectors, 'selectUser')
      .mockImplementation(() => () => ({
        ...instance(userType),
        access: {
          ...instance(accessType),
          accessibleEnvIds: [1, 2],
        },
      }))

    await act(() => {
      render(<BehaviorDetail />)
    })

    expect(screen.queryByText(parseTool.behaviorTitle('priceDailyIncreaseBuy'))).toBeInTheDocument()
    const envs = screen.getAllByTestId('traderEnvCard')
    expect(envs.length).toBe(2)

    fireEvent.click(envs[1])
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/behaviors/priceDailyIncreaseBuy/envs/2')
  })

  test('could show empty if env not exists', async () => {
    jest.spyOn(selectors, 'selectTraderEnvBaseById')
      .mockImplementation(() => () => undefined)

    await act(() => {
      render(<BehaviorDetail />)
    })

    expect(screen.queryByTestId('detail-root')).not.toBeInTheDocument()
  })

  test('could show empty if behavior not exists', async () => {
    jest.spyOn(selectors, 'selectTraderEnvBaseById')
      .mockImplementation(() => () => env1)
    jest.spyOn(router, 'useParams')
      .mockImplementation(() => ({
        envId: '1',
        behavior: 'priceDailyIncreaseBuy1',
      }))

    await act(() => {
      render(<BehaviorDetail />)
    })

    expect(screen.queryByTestId('detail-root')).not.toBeInTheDocument()
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/404')
  })
})
