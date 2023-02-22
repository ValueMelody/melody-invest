import * as constants from '@shared/constants'
import * as interfaces from '@shared/interfaces'
import * as selectors from 'selectors'
import { fireEvent, render, screen } from 'test.utils'
import { instance, mock } from 'ts-mockito'
import ProfileBuilder from './ProfileBuilder'

jest.mock('selectors', () => {
  return {
    __esModule: true,
    ...jest.requireActual('selectors'),
  }
})

const envType = mock<interfaces.traderEnvModel.Record>({})
const env1 = { ...instance(envType), id: 1, isSystem: true }
const env2 = { ...instance(envType), id: 2, isSystem: true }

describe('#ProfileBuilder', () => {
  test('disable create button by default', async () => {
    jest.spyOn(selectors, 'selectTraderEnvBases')
      .mockImplementation(() => () => {
        return [env1, env2]
      })

    render(<ProfileBuilder />)
    expect(screen.getByTestId('createBtn')).toBeDisabled()

    const envs = screen.getAllByTestId('traderEnvCard')
    expect(envs.length).toBe(2)
    expect(envs[0].className).toContain('card-active')
    expect(envs[1].className).not.toContain('card-active')

    fireEvent.click(envs[0])
    expect(envs[0].className).toContain('card-active')
    expect(envs[1].className).not.toContain('card-active')

    fireEvent.click(envs[1])
    expect(envs[0].className).not.toContain('card-active')
    expect(envs[1].className).toContain('card-active')

    const headers = screen.getAllByTestId('profileBuilderHeader')
    expect(headers.length).toBe(5)
    expect(screen.queryAllByTestId('profileBuilderGroup').length).toBe(16)

    const behaviorLabels = screen.getAllByTestId('behaviorLabel')
    expect(behaviorLabels.length).toBe(constants.Behavior.Behaviors.length)

    fireEvent.click(behaviorLabels[0])
    expect(screen.getAllByTestId('behaviorEditor').length).toBe(1)

    fireEvent.click(screen.getAllByTestId('behaviorLabel')[0])
    expect(screen.queryAllByTestId('behaviorEditor').length).toBe(0)

    fireEvent.click(screen.getAllByTestId('behaviorLabel')[1])
    fireEvent.change(screen.getByTestId('select'), { target: { value: 3 } })
    expect(screen.queryAllByTestId('behaviorEditor').length).toBe(0)
    expect(screen.getAllByTestId('behaviorLabel')[1].innerHTML).toContain(': 3')
  })
})
