import * as interfaces from '@shared/interfaces'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import { instance, mock, when } from 'ts-mockito'
import { render, screen } from 'test.utils'
import ProfileLabel from './ProfileLabel'

describe('#ProfileLabel', () => {
  const traderMock: interfaces.traderModel.Record = mock({})
  when(traderMock.traderPatternId).thenReturn(12)
  const trader = instance(traderMock)

  const traderEnvMock: interfaces.traderEnvModel.Record = mock({})
  when(traderEnvMock.name).thenReturn('test env')
  const traderEnv = instance(traderEnvMock)

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
