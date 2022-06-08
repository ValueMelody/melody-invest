import * as interfaces from '@shared/interfaces'
import { render, screen, fireEvent } from '../../../test.utils'
import ProfileLabel from './ProfileLabel'
import * as parseTool from '../../../tools/parse'
import * as localeTool from '../../../tools/locale'

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
        color='green'
      />,
    )
    const container = screen.getByTestId('profileLabel')
    expect(container).toBeTruthy()
    expect(container.classList).toContain('green')
    expect(container.innerHTML).toBe(`${parseTool.profileName(12)} - test env ${localeTool.t('common.env')}`)
  })

  test('could render color', () => {
    render(
      <ProfileLabel
        trader={trader}
        traderEnv={traderEnv}
        color='red'
      />,
    )
    const container = screen.getByTestId('profileLabel')
    expect(container.classList).toContain('red')
    expect(container.classList).not.toContain('green')
  })
})
