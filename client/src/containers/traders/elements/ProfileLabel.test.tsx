import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import { render, screen } from 'test.utils'
import ProfileLabel from './ProfileLabel'

describe('#ProfileLabel', () => {
  // @ts-ignore
  const trader: interfaces.traderModel.Record = {
    traderPatternId: 12,
  }

  // @ts-ignore
  const traderEnv: interfaces.traderEnvModel.Record = {
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
      `${parseTool.profileName(12)} - test env ${localeTool.t('common.env')}`,
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
