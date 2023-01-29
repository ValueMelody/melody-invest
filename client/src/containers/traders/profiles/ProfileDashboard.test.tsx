import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { act, fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import { GlobalState } from 'stores/global'
import ProfileDashboard from './ProfileDashboard'
import { UserState } from 'stores/user'

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

const navigate = jest.fn()
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom')
  return {
    __esModule: true,
    ...actual,
    useNavigate: () => navigate,
  }
})

const userType = mock<UserState>({})

describe('#ProfileDashboard', () => {
  test('render buttons', async () => {
    const traderType = mock<interfaces.traderModel.Record>({})
    const patternType = mock<interfaces.traderPatternModel.Public>({})
    jest.spyOn(selectors, 'selectTraderProfileBaseDict')
      .mockImplementation(() => () => ({
        1: {
          trader: { ...instance(traderType), id: 1, accessCode: 'abc' },
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

    jest.spyOn(selectors, 'selectUser')
      .mockImplementation(() => () => {
        return {
          ...instance(userType),
          userType: 2,
          userTraderIds: [1, 2, 3],
          access: {
            canFollowEnv: true,
            canFollowCombo: true,
            canFollowTrader: true,
            accessibleEnvIds: [],
            accessibleComboIds: [1],
            accessibleTraderIds: [1, 2],
          },
        }
      })

    const envType = mock<interfaces.traderEnvModel.Record>({})
    jest.spyOn(selectors, 'selectTraderEnvBaseById')
      .mockImplementation(() => () => instance(envType))

    jest.spyOn(selectors, 'selectTraderEnvBases')
      .mockImplementation(() => () => [
        { ...instance(envType), id: 1, isSystem: true },
        { ...instance(envType), id: 2 },
      ])

    const comboType = mock<interfaces.traderComboModel.Identity>({})
    jest.spyOn(selectors, 'selectTraderComboBases')
      .mockImplementation(() => () => [
        { ...instance(comboType), id: 1, isSystem: false, traderIds: [] },
      ])

    await act(() => {
      render(<ProfileDashboard />)
    })

    fireEvent.click(screen.getByTestId('addProfileBtn'))
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/traders/profiles/build')

    fireEvent.click(screen.getByTestId('addEnvBtn'))
    expect(navigate).toBeCalledTimes(2)
    expect(navigate).toBeCalledWith('/traders/envs/build')

    fireEvent.click(screen.getByTestId('addComboBtn'))
    expect(navigate).toBeCalledTimes(3)
    expect(navigate).toBeCalledWith('/traders/combos/build')

    const profiles = screen.getAllByTestId('traderProfileCard')
    expect(profiles.length).toBe(3)
    fireEvent.click(profiles[0])
    expect(navigate).toBeCalledTimes(4)
    expect(navigate).toBeCalledWith('/traders/profiles/1/abc')

    const envs = screen.getAllByTestId('traderEnvCard')
    expect(envs.length).toBe(2)
    fireEvent.click(envs[0])
    expect(navigate).toBeCalledTimes(5)
    expect(navigate).toBeCalledWith('/traders/envs/1')

    const combos = screen.getAllByTestId('traderComboCard')
    expect(combos.length).toBe(1)
    fireEvent.click(combos[0])
    expect(navigate).toBeCalledTimes(6)
    expect(navigate).toBeCalledWith('/traders/combos/1')
  })

  test('render empty', async () => {
    jest.spyOn(selectors, 'selectUser')
      .mockImplementation(() => () => {
        return {
          ...instance(userType),
          userType: 0,
          userTraderIds: [],
          access: {
            canFollowEnv: false,
            canFollowCombo: false,
            canFollowTrader: false,
            accessibleEnvIds: [],
            accessibleComboIds: [],
            accessibleTraderIds: [],
          },
        }
      })

    render(<ProfileDashboard />)
    expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument()
  })
})
