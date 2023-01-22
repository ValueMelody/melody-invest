import * as selectors from 'selectors'
import { act, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import ProfileDashboard from './ProfileDashboard'
import { UserState } from 'stores/user'

jest.mock('selectors', () => {
  return {
    __esModule: true,
    ...jest.requireActual('selectors'),
  }
})

const userType = mock<UserState>({})

describe('#ProfileDashboard', () => {
  test('render buttons', async () => {
    jest.spyOn(selectors, 'selectUser')
      .mockImplementation(() => () => {
        return {
          ...instance(userType),
          userType: 2,
          userTraderIds: [],
          access: {
            canFollowEnv: true,
            canFollowCombo: true,
            canFollowTrader: true,
            accessibleEnvIds: [],
            accessibleComboIds: [],
            accessibleTraderIds: [],
          },
        }
      })

    await act(() => {
      render(<ProfileDashboard />)
    })
    expect(screen.queryByTestId('addProfileBtn')).toBeInTheDocument()
    expect(screen.queryByTestId('addEnvBtn')).toBeInTheDocument()
    expect(screen.queryByTestId('addComboBtn')).toBeInTheDocument()
  })
})
