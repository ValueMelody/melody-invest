import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { act, fireEvent, render, screen, waitFor } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import { GlobalState } from 'stores/global'
import { UserState } from 'stores/user'
import axios from 'axios'
import ComboBuilder from './ComboBuilder'

jest.mock('selectors', () => {
  const actual = jest.requireActual('selectors')
  return {
    __esModule: true,
    ...actual,
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

const globalState = mock<GlobalState>({})
jest.spyOn(selectors, 'selectGlobal')
  .mockImplementation(() => () => ({
    ...instance(globalState),
    refreshToken: '123',
  }))

afterEach(() => {
  jest.clearAllMocks()
})

const userType = mock<UserState>({})
jest.spyOn(selectors, 'selectUser')
  .mockImplementation(() => () => ({
    ...instance(userType),
    userTraderIds: [1, 2, 3, 4],
  }))

const envType = mock<interfaces.traderEnvModel.Identity>({})
jest.spyOn(selectors, 'selectTraderEnvBaseById')
  .mockImplementation(() => () => instance(envType))

const traderType = mock<interfaces.traderModel.Record>({})
const patternType = mock<interfaces.traderPatternModel.Record>({})

jest.spyOn(selectors, 'selectTraderProfileBaseDict')
  .mockImplementation(() => () => ({
    1: {
      trader: { ...instance(traderType), id: 1 },
      pattern: instance(patternType),
    },
    2: {
      trader: { ...instance(traderType), id: 2 },
      pattern: instance(patternType),
    },
    3: {
      trader: { ...instance(traderType), id: 3 },
      pattern: instance(patternType),
    },
  }))

const comboType = mock<interfaces.traderComboModel.Identity>({})

const post = jest.fn()
jest.spyOn(axios, 'post')
  .mockImplementation(async (url, req) => {
    post(url, req)
    return {
      data: {
        ...instance(comboType),
        id: 11,
        name: 'test combo',
        traderIds: [1, 3],
      },
    }
  })

describe('#ComboBuilder', () => {
  test('disable create button by default', () => {
    render(<ComboBuilder />)
    expect(screen.getByTestId('createBtn')).toBeDisabled()
  })

  test('could trigger create', async () => {
    await act(() => {
      render(<ComboBuilder />)
    })
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'test name' } })
    const traders = screen.getAllByTestId('traderProfileCard')
    expect(traders.length).toBe(3)
    fireEvent.click(traders[0])
    fireEvent.click(traders[2])
    expect(traders[0].className).toContain('card-active')
    expect(traders[2].className).toContain('card-active')

    fireEvent.click(traders[2])
    expect(traders[2].className).not.toContain('card-active')
    fireEvent.click(traders[2])
    expect(traders[2].className).toContain('card-active')
    fireEvent.click(traders[0])
    fireEvent.click(traders[0])
    expect(traders[0].className).toContain('card-active')

    fireEvent.submit(screen.getByTestId('form'))

    await waitFor(() => {
      expect(post).toBeCalledTimes(1)
      expect(post).toBeCalledWith('http://127.0.0.1:3100/traders/combos', {
        name: 'test name',
        traderIds: [1, 3],
      })
      expect(navigate).toBeCalledTimes(1)
      expect(navigate).toBeCalledWith('/traders/combos/11')
    })
  })

  test('do not redirect if create failed', async () => {
    jest.spyOn(axios, 'post')
      .mockImplementation(async (url, req) => {
        post(url, req)
        throw new Error()
      })

    await act(() => {
      render(<ComboBuilder />)
    })
    fireEvent.change(screen.getByTestId('name'), { target: { value: 'test name' } })
    const traders = screen.getAllByTestId('traderProfileCard')
    fireEvent.click(traders[0])
    fireEvent.click(traders[2])

    await act(() => {
      fireEvent.submit(screen.getByTestId('form'))
    })

    await waitFor(() => {
      expect(post).toBeCalledTimes(1)
      expect(navigate).toBeCalledTimes(0)
    })
  })
})
