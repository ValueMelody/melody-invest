import * as interfaces from '@shared/interfaces'
import * as router from 'react-router-dom'
import * as selectors from 'selectors'
import { UserAccess, UserState } from 'stores/user'
import { act, fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import { GlobalState } from 'stores/global'
import ProfileDetail from './ProfileDetail'
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
jest.spyOn(router, 'useNavigate')
  .mockImplementation(() => navigate)
jest.spyOn(router, 'useParams')
  .mockImplementation(() => {
    return {
      traderId: '1',
      accessCode: 'aaaaaaaaaaaaaaaa',
    }
  })

const envType = mock<interfaces.traderEnvModel.Record>({})
const env1 = { ...instance(envType), id: 1, name: 'test env' }
const env2 = { ...instance(envType), id: 2, name: 'test env2' }

const traderType = mock<interfaces.traderModel.Record>({})
const patternType = mock<interfaces.traderPatternModel.Record>({})

const profile = {
  trader: {
    ...instance(traderType),
    traderPatternId: 123,
    id: 1,
  },
  pattern: instance(patternType),
}
const detailType = mock<interfaces.response.ProfileDetail>({})
const detail = {
  ...instance(detailType),
  profileEnvs: [
    { traderEnvId: 1, traderId: 1, traderPatternId: 123, accessCode: 'aaaaaaaaaaaaaaaa' },
    { traderEnvId: 2, traderId: 1, traderPatternId: 123, accessCode: 'bbbbbbbbbbbbbbbb' },
  ],
}

const holdingType = mock<interfaces.traderHoldingModel.Record>({})

jest.spyOn(selectors, 'selectTraderEnvBaseById')
  .mockImplementation((id) => () => {
    if (id === 1) return env1
    return env2
  })

jest.spyOn(selectors, 'selectTraderEnvBaseDict')
  .mockImplementation(() => () => ({
    1: env1,
    2: env2,
  }))

describe('#ProfileDetail', () => {
  test('could show profile info', async () => {
    jest.spyOn(selectors, 'selectTraderProfileBaseById')
      .mockImplementation(() => () => {
        return profile
      })

    jest.spyOn(selectors, 'selectTraderProfileDetailById')
      .mockImplementation(() => () => {
        return {
          ...detail,
          holdings: (new Array(15)).fill(null).map((_, index) => {
            return {
              ...instance(holdingType),
              id: `a${index}`,
              items: [],
              totalValue: index + 1,
            }
          }),
        }
      })

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
      render(<ProfileDetail />)
    })

    const cards = screen.getAllByTestId('holdingCard')
    expect(cards.length).toBe(5)

    expect(screen.queryByTestId('showMore')).toBeInTheDocument()

    expect(screen.queryByTestId('profileLabel')?.innerHTML).toContain('123')
    const envs = screen.getAllByTestId('traderEnvCard')
    expect(envs.length).toBe(2)

    fireEvent.click(envs[1])
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/traders/profiles/1/bbbbbbbbbbbbbbbb')

    expect(screen.getAllByTestId('holdingCard').length).toBe(5)
    await act(() => {
      fireEvent.click(screen.getByTestId('showMore'))
    })
    expect(screen.getAllByTestId('holdingCard').length).toBe(15)
    expect(screen.getAllByTestId('holdingDiffer').length).toBe(14)
  })

  test('could fetch profile', async () => {
    jest.spyOn(selectors, 'selectTraderProfileBaseById')
      .mockImplementationOnce(() => () => {
        return undefined
      })

    jest.spyOn(selectors, 'selectTraderProfileDetailById')
      .mockImplementation(() => () => {
        return undefined
      })

    const get = jest.fn()
    jest.spyOn(axios, 'get').mockImplementation(async (url) => {
      get()
      if (url === 'http://127.0.0.1:3100/traders/profiles/1/aaaaaaaaaaaaaaaa') {
        return { data: profile }
      } else {
        return { data: detail }
      }
    })

    await act(() => {
      render(<ProfileDetail />)
    })

    expect(get).toBeCalledTimes(2)
  })

  test('could redirect if id not eixst', async () => {
    jest.spyOn(router, 'useParams')
      .mockImplementation(() => {
        return {
          accessCode: 'aaaaaaaaaaaaaaaa',
        }
      })
    await act(() => {
      render(<ProfileDetail />)
    })
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/404')
  })

  test('could redirect if accessCode not eixst', async () => {
    jest.spyOn(router, 'useParams')
      .mockImplementation(() => {
        return {
          traderId: '1',
        }
      })
    await act(() => {
      render(<ProfileDetail />)
    })
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/404')
  })

  test('could redirect if accessCode length is wrong', async () => {
    jest.spyOn(router, 'useParams')
      .mockImplementation(() => {
        return {
          traderId: '1',
          accessCode: 'aaaaaaaaaaaaaaa',
        }
      })
    await act(() => {
      render(<ProfileDetail />)
    })
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/404')
  })
})
