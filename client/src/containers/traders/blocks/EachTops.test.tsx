import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import EachTops from './EachTops'

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

const traderType = mock<interfaces.traderModel.Record>({})
const patternType = mock<interfaces.traderPatternModel.Public>({})

describe('#EachTops', () => {
  test('could show top profiles', () => {
    const envType = mock<interfaces.traderEnvModel.Record>({})
    jest.spyOn(selectors, 'selectTraderEnvBaseById')
      .mockImplementation(() => () => instance(envType))

    jest.spyOn(selectors, 'selectTraderProfileBaseDict')
      .mockImplementation(() => () => ({
        11: {
          trader: {
            ...instance(traderType),
            traderPatternId: 111,
            id: 1,
            accessCode: 'A',
          },
          pattern: instance(patternType),
        },
        22: {
          trader: {
            ...instance(traderType),
            traderPatternId: 222,
            id: 2,
            accessCode: 'B',
          },
          pattern: instance(patternType),
        },
        33: {
          trader: {
            ...instance(traderType),
            traderPatternId: 333,
            id: 3,
            accessCode: 'C',
          },
          pattern: instance(patternType),
        },
        44: {
          trader: {
            ...instance(traderType),
            traderPatternId: 444,
            id: 4,
            accessCode: 'D',
          },
          pattern: instance(patternType),
        },
      }))

    render(
      <EachTops
        bestOveralls={[22]}
        bestPastYears={[11]}
        bestPastQuarters={[33]}
        bestPastMonths={[22]}
        bestPastWeeks={[44]}
      />,
    )

    const labels = screen.queryAllByTestId('profileLabel')
    expect(labels.length).toBe(5)
    expect(labels[0].innerHTML).toContain('222')
    expect(labels[1].innerHTML).toContain('111')
    expect(labels[2].innerHTML).toContain('333')
    expect(labels[3].innerHTML).toContain('222')
    expect(labels[4].innerHTML).toContain('444')

    const profiles = screen.queryAllByTestId('traderProfileCard')
    fireEvent.click(profiles[1])
    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('/traders/profiles/1/A')
  })

  test('could show top profiles', () => {
    const envType = mock<interfaces.traderEnvModel.Record>({})
    jest.spyOn(selectors, 'selectTraderEnvBaseById')
      .mockImplementation(() => () => instance(envType))

    jest.spyOn(selectors, 'selectTraderProfileBaseDict')
      .mockImplementation(() => () => ({}))

    render(
      <EachTops
        bestOveralls={[]}
        bestPastYears={[]}
        bestPastQuarters={[]}
        bestPastMonths={[]}
        bestPastWeeks={[]}
      />,
    )

    const labels = screen.queryAllByTestId('profileLabel')
    expect(labels.length).toBe(0)
  })
})
