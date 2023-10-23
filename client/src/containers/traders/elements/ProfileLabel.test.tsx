import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import { render, screen } from 'test.utils'
import { mock } from 'ts-mockito'
import ProfileLabel from './ProfileLabel'

describe('#ProfileLabel', () => {
  const traderMock: interfaces.traderModel.Record = mock({})
  const trader = {
    ...traderMock,
    traderPatternId: 12,
  }

  const traderEnvMock: interfaces.traderEnvModel.Record = mock({})
  const traderEnv = {
    ...traderEnvMock,
    name: 'test env',
  }

  test('could render', () => {
    render(
      <ProfileLabel
        trader={trader}
        traderEnv={traderEnv}
        color='info'
      />,
    )
    const container = screen.getByTestId('profileLabel')
    expect(container).toBeTruthy()
    expect(container.children[0].innerHTML).toBe(
      `${parseTool.profileName(12)} - test env ${localeTool.t('entity.env')}`,
    )
  })

  test('could render color', () => {
    render(
      <ProfileLabel
        trader={trader}
        traderEnv={traderEnv}
        color='gray'
      />,
    )
    const container = screen.getByTestId('profileLabel')
    expect(container.classList).toContain('bg-gray-100')
  })
})
