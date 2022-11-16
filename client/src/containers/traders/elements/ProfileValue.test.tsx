import * as interfaces from '@shared/interfaces'
import { fireEvent, render, screen } from 'test.utils'
import { instance, mock, when } from 'ts-mockito'
import ProfileValue from './ProfileValue'

describe('#ProfileValue', () => {
  const traderMock: interfaces.traderModel.Record = mock({})
  when(traderMock.id).thenReturn(1)
  when(traderMock.totalValue).thenReturn(20000000)
  const trader = instance(traderMock)

  const traderEnvMock: interfaces.traderEnvModel.Record = mock({})
  when(traderEnvMock.id).thenReturn(2)
  const env = instance(traderEnvMock)

  test('could render', () => {
    render(
      <ProfileValue
        trader={trader}
        env={env}
      />,
    )

    const container = screen.getByTestId('profileValue')
    expect(container).toBeTruthy()
    expect(screen.getByTestId('profileLabel')).toBeTruthy()
    expect(screen.getByTestId('valueDiffer')).toBeTruthy()
    expect(screen.getByText('100.00%')).toBeTruthy()

    fireEvent.click(container)
  })

  test('could render as clickable', () => {
    const onClick = jest.fn()
    render(
      <ProfileValue
        trader={trader}
        env={env}
        onClick={onClick}
      />,
    )
    const container = screen.getByTestId('profileValue')
    fireEvent.click(container)
    expect(onClick).toBeCalledTimes(1)
    expect(onClick).toBeCalledWith(trader)
  })

  test('could render as empty', () => {
    const { container } = render(
      <ProfileValue
        trader={null}
        env={null}
        onClick={() => {}}
      />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  test('could render without differ', () => {
    render(
      <ProfileValue
        trader={{ ...trader, totalValue: 0 }}
        env={env}
      />,
    )

    expect(screen.getByTestId('profileValue')).toBeTruthy()
    expect(screen.getByTestId('profileLabel')).toBeTruthy()
    expect(screen.queryByTestId('valueDiffer')).toBeFalsy()
    expect(screen.queryByTestId('100.00%')).toBeFalsy()
  })
})
