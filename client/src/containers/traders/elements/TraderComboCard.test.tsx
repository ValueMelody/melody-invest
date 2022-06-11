import { render, screen, fireEvent } from '../../../test.utils'
import TraderComboCard from './TraderComboCard'
import * as parseTool from '../../../tools/parse'

describe('#traderComboCard', () => {
  test('do not render if there is no combo', () => {
    render(
      <TraderComboCard
        traderCombo={null}
        isActive
      />,
    )
    const container = screen.queryByTestId('traderComboCard')
    expect(container).toBeFalsy()
  })

  const traderCombo = {
    id: 123,
    name: 'test combo',
    traderIds: [2, 3, 4, 5, 6],
    isSystem: false,
  }

  test('could render', () => {
    render(
      <TraderComboCard
        traderCombo={traderCombo}
        isActive={false}
      />,
    )
    const container = screen.getByTestId('traderComboCard')
    expect(container).toBeTruthy()
    expect(screen.getByText(`Combo: ${traderCombo.name}`)).toBeTruthy()
    expect(screen.getByText(parseTool.traderComboTraders(traderCombo))).toBeTruthy()
    expect(container?.className).not.toContain('isActive')
    expect(container?.classList).not.toContain('click-cursor')

    fireEvent.click(container)
  })

  test('could render as active', () => {
    render(
      <TraderComboCard
        traderCombo={traderCombo}
        isActive
      />,
    )
    const container = screen.getByTestId('traderComboCard')
    expect(container?.className).toContain('isActive')
  })

  test('could render as clickable', () => {
    const onClick = jest.fn()
    render(
      <TraderComboCard
        traderCombo={traderCombo}
        isActive
        onClick={onClick}
      />,
    )
    const container = screen.getByTestId('traderComboCard')
    expect(container.classList).toContain('click-cursor')

    fireEvent.click(container)
    expect(onClick).toBeCalledTimes(1)
    expect(onClick).toBeCalledWith(123)
  })
})
