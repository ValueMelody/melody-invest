import * as interfaces from '@shared/interfaces'
import { fireEvent, render, screen } from 'test.utils'
import ProfileValue from './ProfileValue'

describe('#ProfileValue', () => {
  // @ts-ignore
  const trader: interfaces.traderModel.Record = { id: 1, totalValue: 20000000 }
  // @ts-ignore
  const env: interfaces.traderEnvModel.Record = { id: 2 }

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
