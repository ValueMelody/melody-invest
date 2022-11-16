import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import { fireEvent, render, screen } from 'test.utils'
import TraderComboCard from './TraderComboCard'
import { store } from 'stores'
import { traderComboSlice } from 'stores/traderCombo'
import { userSlice } from 'stores/user'

const traderCombo = {
  id: 123,
  name: 'test combo',
  traderIds: [2, 3, 4, 5, 6],
  isSystem: false,
}

afterEach(() => {
  jest.clearAllMocks()
})

const setupStore = () => {
  store.dispatch(userSlice.actions._updateForTest({
    userType: constants.User.Type.Pro,
  }))
  store.dispatch(traderComboSlice.actions._updateForTest({
    base: { 123: traderCombo },
  }))
}

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

  test('could render', () => {
    setupStore()
    render(
      <TraderComboCard
        traderCombo={traderCombo}
      />,
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
    )
    const container = screen.getByTestId('traderComboCard')
    expect(container?.className).toContain('card-active')
  })

  test('could render as clickable', () => {
    setupStore()
    const onClick = jest.fn()
    render(
      <TraderComboCard
        traderCombo={traderCombo}
        isActive
        onClick={onClick}
      />,
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
