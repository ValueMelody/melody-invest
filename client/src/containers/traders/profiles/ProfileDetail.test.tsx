import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { act, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import ProfileDetail from './ProfileDetail'

jest.mock('selectors', () => {
  return {
    __esModule: true,
    ...jest.requireActual('selectors'),
  }
})

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: () => (
      {
        traderId: '1',
        accessCode: 'abc',
      }
    ),
  }
})

const envType = mock<interfaces.traderEnvModel.Record>({})
const env = { ...instance(envType), id: 1, name: 'test env' }

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
const detail = instance(detailType)

describe('#ProfileDetail', () => {
  test('could show profile info', async () => {
    jest.spyOn(selectors, 'selectTraderProfileBaseById')
      .mockImplementation(() => () => {
        return profile
      })

    jest.spyOn(selectors, 'selectTraderEnvBaseById')
      .mockImplementation(() => () => {
        return env
      })

    jest.spyOn(selectors, 'selectTraderProfileDetailById')
      .mockImplementation(() => () => {
        return detail
      })

    await act(() => {
      render(<ProfileDetail />)
    })

    expect(screen.queryByTestId('profileLabel')?.innerHTML).toContain('123')
  })
})
