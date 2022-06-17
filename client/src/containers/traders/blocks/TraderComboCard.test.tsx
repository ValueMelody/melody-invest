import * as constants from '@shared/constants'
import { render, screen, fireEvent } from 'test.utils'
import { context, Context } from 'context'
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
      <context.Provider value={store}>
        <TraderComboCard
          traderCombo={null}
          isActive
        />
      </context.Provider>,
    )
    const container = screen.queryByTestId('traderComboCard')
    expect(container).toBeFalsy()
  })

  test('could render', () => {
    render(
      <context.Provider value={store}>
        <TraderComboCard
          traderCombo={traderCombo}
        />
      </context.Provider>,
    )
    const container = screen.getByTestId('traderComboCard')
    expect(container).toBeTruthy()
    expect(screen.getByText(`Combo: ${traderCombo.name}`)).toBeTruthy()
    expect(screen.getByText(parseTool.traderComboTraders(traderCombo))).toBeTruthy()
    expect(container?.className).not.toContain('isActive')

    fireEvent.click(container)
  })

  test('could render as active', () => {
    render(
      <context.Provider value={store}>
        <TraderComboCard
          traderCombo={traderCombo}
          isActive
        />
      </context.Provider>,
    )
    const container = screen.getByTestId('traderComboCard')
    expect(container?.className).toContain('isActive')
  })

  test('could render as clickable', () => {
    const onClick = jest.fn()
    render(
      <context.Provider value={store}>
        <TraderComboCard
          traderCombo={traderCombo}
          isActive
          onClick={onClick}
        />
      </context.Provider>,
    )
    const container = screen.getByTestId('traderComboCard')

    fireEvent.click(container)
    expect(onClick).toBeCalledTimes(1)
    expect(onClick).toBeCalledWith(123)
  })

  test('could render as disabled', () => {
    const onClick = jest.fn()
    render(
      <context.Provider value={store}>
        <TraderComboCard
          traderCombo={{
            ...traderCombo,
            id: 234,
          }}
          onClick={onClick}
        />
      </context.Provider>,
    )
    const container = screen.getByTestId('traderComboCard')
    expect(container?.className).toContain('disabled')
    const limitText = localeTool.t('permission.limited')
    expect(screen.getByText(limitText)).toBeTruthy()

    fireEvent.click(container)
    expect(onClick).toBeCalledTimes(0)
  })
})
