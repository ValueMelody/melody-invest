import * as constants from '@shared/constants'
import { render, screen, fireEvent } from 'test.utils'
import { Context } from 'context'
import * as parseTool from 'tools/parse'
import * as localeTool from 'tools/locale'
import TraderComboCard from './TraderComboCard'

const traderCombo = {
  id: 123,
  name: 'test combo',
  traderIds: [2, 3, 4, 5, 6],
  isSystem: false,
}

// @ts-ignore
const store: Context = {
  // @ts-ignore
  resources: {
    userType: constants.User.Type.Pro,
    userTraderIds: [],
  },
  traderCombos: {
    123: {
      identity: traderCombo,
    },
  },
  traderEnvs: {
    // @ts-ignore
    1: {
      // @ts-ignore
      record: { isSystem: true },
    },
  },
}

describe('#traderComboCard', () => {
  test('do not render if there is no combo', () => {
    render(
      <TraderComboCard
        traderCombo={null}
        isActive
      />,
      { store },
    )
    const container = screen.queryByTestId('traderComboCard')
    expect(container).toBeFalsy()
  })

  test('could render', () => {
    render(
      <TraderComboCard
        traderCombo={traderCombo}
      />,
      { store },
    )
    const container = screen.getByTestId('traderComboCard')
    expect(container).toBeTruthy()
    expect(screen.getByText(`Combo: ${traderCombo.name}`)).toBeTruthy()
    expect(screen.getByText(parseTool.traderComboTraders(traderCombo))).toBeTruthy()
    expect(container?.className).not.toContain('card-active')

    const watchButton = screen.queryByTestId('watchButton')
    expect(watchButton).toBeFalsy()

    fireEvent.click(container)
  })

  test('could render as active', () => {
    render(
      <TraderComboCard
        traderCombo={traderCombo}
        isActive
      />,
      { store },
    )
    const container = screen.getByTestId('traderComboCard')
    expect(container?.className).toContain('card-active')
  })

  test('could render as clickable', () => {
    const onClick = jest.fn()
    render(
      <TraderComboCard
        traderCombo={traderCombo}
        isActive
        onClick={onClick}
      />,
      { store },
    )
    const container = screen.getByTestId('traderComboCard')

    fireEvent.click(container)
    expect(onClick).toBeCalledTimes(1)
    expect(onClick).toBeCalledWith(123)
  })

  test('could render as disabled', () => {
    const onClick = jest.fn()
    render(
      <TraderComboCard
        traderCombo={{
          ...traderCombo,
          id: 234,
        }}
        onClick={onClick}
      />,
      { store },
    )
    const container = screen.getByTestId('traderComboCard')
    expect(container?.className).toContain('card-disabled')
    const limitText = localeTool.t('permission.limited')
    expect(screen.getByText(limitText)).toBeTruthy()

    const watchButton = screen.queryByTestId('watchButton')
    expect(watchButton).toBeTruthy()

    fireEvent.click(container)
    expect(onClick).toBeCalledTimes(0)
  })
})
