import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as selectors from 'selectors'
import { fireEvent, render, screen } from 'test.utils'
import { mock } from 'ts-mockito'
import ComboProfiles from './ComboProfiles'

jest.mock('selectors', () => {
  const actual = jest.requireActual('selectors')
  return {
    __esModule: true,
    ...actual,
  }
})

const traderMock: interfaces.traderModel.Record = mock({})
const trader1 = { ...traderMock, totalValue: 200000 }
const trader2 = { ...traderMock, totalValue: 300000 }
const trader3 = { ...traderMock, totalValue: 100000 }

const patternMock: interfaces.traderPatternModel.Record = mock({})
const traderPattern1 = { ...patternMock, id: 1 }
const traderPattern2 = { ...patternMock, id: 2 }

const traderEnvMock: interfaces.traderEnvModel.Record = mock({})
const traderEnv1 = { ...traderEnvMock, name: 'profile env 2' }

describe('#ComboProfiles', () => {
  test('could render', () => {
    jest.spyOn(selectors, 'selectTraderEnvBaseById')
      .mockImplementation(() => () => traderEnv1)

    const profilesWithEnvs = [
      {
        profile: {
          pattern: traderPattern1,
          trader: trader1,
        },
      },
      {
        profile: {
          pattern: traderPattern2,
          trader: trader2,
        },
        env: traderEnv1,
      },
    ]
    const onClick = jest.fn()
    render(
      <ComboProfiles
        profilesWithEnvs={profilesWithEnvs}
        onClickProfile={onClick}
      />,
    )

    const profile1Name = `${localeTool.t('entity.profile')} #1`
    const profile2Name = `${localeTool.t('entity.profile')} #2`
    expect(screen.queryByText(profile1Name)).toBeFalsy()
    expect(screen.queryByText(profile2Name)).toBeTruthy()

    const profile2Env = `profile env 2 ${localeTool.t('entity.env')}`
    expect(screen.queryByText(profile2Env)).toBeTruthy()
    const btn = screen.getByTestId('traderProfileCard')
    fireEvent.click(btn)
    expect(onClick).toBeCalledTimes(1)
  })

  test('could render with different active index', () => {
    const profilesWithEnvs = [
      {
        profile: {
          pattern: traderPattern1,
          trader: trader1,
        },
      },
      {
        profile: {
          pattern: traderPattern2,
          trader: trader3,
        },
        env: traderEnv1,
      },
    ]

    const onClick = jest.fn()
    render(
      <ComboProfiles
        profilesWithEnvs={profilesWithEnvs}
        onClickProfile={onClick}
      />,
    )

    const profile1Name = `${localeTool.t('entity.profile')} #1`
    const profile2Name = `${localeTool.t('entity.profile')} #2`
    expect(screen.queryByText(profile1Name)).toBeTruthy()
    expect(screen.queryByText(profile2Name)).toBeFalsy()

    const profile2Env = `profile env 2 ${localeTool.t('entity.env')}`
    expect(screen.queryByText(profile2Env)).toBeFalsy()
  })
})
