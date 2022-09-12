import ComboProfiles from './ComboProfiles'
import { render, screen } from 'test.utils'
import * as localeTool from 'tools/locale'

describe('#ComboProfiles', () => {
  test('could render', () => {
    const profilesWithEnvs = [
      {
        profile: {
          pattern: {
            id: 1,
          },
          trader: {
            totalValue: 200000,
          },
        },
      },
      {
        profile: {
          pattern: {
            id: 2,
          },
          trader: {
            totalValue: 300000,
          },
        },
        env: {
          name: 'profile env 2',
        },
      },
    ]

    const onClick = jest.fn()
    render(
      <ComboProfiles
        // @ts-ignore
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
          pattern: {
            id: 1,
          },
          trader: {
            totalValue: 200000,
          },
        },
      },
      {
        profile: {
          pattern: {
            id: 2,
          },
          trader: {
            totalValue: 100000,
          },
        },
        env: {
          name: 'profile env 2',
        },
      },
    ]

    const onClick = jest.fn()
    render(
      <ComboProfiles
        // @ts-ignore
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
