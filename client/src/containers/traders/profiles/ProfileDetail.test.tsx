import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { act, fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import ProfileDetail from './ProfileDetail'

afterEach(() => {
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
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => navigate,
    useParams: () => (
      {
        traderId: '1',
        accessCode: 'aaaaaaaaaaaaaaaa',
      }
    ),
  }
})

const envType = mock<interfaces.traderEnvModel.Record>({})
const env1 = { ...instance(envType), id: 1, name: 'test env', isSystem: true }
const env2 = { ...instance(envType), id: 2, name: 'test env2', isSystem: true }

const traderType = mock<interfaces.traderModel.Record>({})
const patternType = mock<interfaces.traderPatternModel.Public>({})

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

describe('#ProfileDetail', () => {
  test('could show profile info', async () => {
    jest.spyOn(selectors, 'selectTraderProfileBaseById')
      .mockImplementation(() => () => {
        return profile
      })

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

    jest.spyOn(selectors, 'selectTraderProfileDetailById')
      .mockImplementation(() => () => {
        return detail
      })

    await act(() => {
      render(<ProfileDetail />)
    })

    expect(screen.queryByTestId('profileLabel')?.innerHTML).toContain('123')
    const envs = screen.getAllByTestId('traderEnvCard')
    expect(envs.length).toBe(2)

    fireEvent.click(envs[1])
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/traders/profiles/1/bbbbbbbbbbbbbbbb')
  })
})
