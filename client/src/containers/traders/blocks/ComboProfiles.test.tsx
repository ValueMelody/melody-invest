import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import { instance, mock, when } from 'ts-mockito'
import { render, screen } from 'test.utils'
import ComboProfiles from './ComboProfiles'

const traderMock1: interfaces.traderModel.Record = mock({})
when(traderMock1.totalValue).thenReturn(200000)
const trader1 = instance(traderMock1)

const traderMock2: interfaces.traderModel.Record = mock({})
when(traderMock2.totalValue).thenReturn(300000)
const trader2 = instance(traderMock2)

const traderMock3: interfaces.traderModel.Record = mock({})
when(traderMock3.totalValue).thenReturn(100000)
const trader3 = instance(traderMock3)

const traderPatternMock1: interfaces.traderPatternModel.Public = mock({})
when(traderPatternMock1.id).thenReturn(1)
const traderPattern1 = instance(traderPatternMock1)

const traderPatternMock2: interfaces.traderPatternModel.Public = mock({})
when(traderPatternMock2.id).thenReturn(2)
const traderPattern2 = instance(traderPatternMock2)

const traderEnvMock1: interfaces.traderEnvModel.Record = mock({})
when(traderEnvMock1.name).thenReturn('profile env 2')
const traderEnv1 = instance(traderEnvMock1)

describe('#ComboProfiles', () => {
  test('could render', () => {
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

    const profile1Name = `${localeTool.t('common.profile')} #1`
    const profile2Name = `${localeTool.t('common.profile')} #2`
    expect(screen.queryByText(profile1Name)).toBeFalsy()
    expect(screen.queryByText(profile2Name)).toBeTruthy()

    const profile2Env = `profile env 2 ${localeTool.t('common.env')}`
    expect(screen.queryByText(profile2Env)).toBeTruthy()
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

    const profile1Name = `${localeTool.t('common.profile')} #1`
    const profile2Name = `${localeTool.t('common.profile')} #2`
    expect(screen.queryByText(profile1Name)).toBeTruthy()
    expect(screen.queryByText(profile2Name)).toBeFalsy()

    const profile2Env = `profile env 2 ${localeTool.t('common.env')}`
    expect(screen.queryByText(profile2Env)).toBeFalsy()
  })
})
