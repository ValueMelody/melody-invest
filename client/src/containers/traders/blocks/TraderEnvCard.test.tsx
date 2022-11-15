import * as constants from '@shared/constants'
import * as localeTool from 'tools/locale'
import * as parseTool from 'tools/parse'
import { fireEvent, render, screen } from 'test.utils'
import TraderEnvCard from './TraderEnvCard'
import { store } from 'stores'
import { traderEnvSlice } from 'stores/traderEnv'
import { userSlice } from 'stores/user'

const traderEnv = {
  id: 123,
  name: 'test env',
  isSystem: false,
  startDate: '2001-01-02',
  tickerIds: [1, 2, 3, 4, 5],
  activeTotal: 100,
}

const setupStore = () => {
  store.dispatch(userSlice.actions._updateForTest({
    userType: constants.User.Type.Pro,
  }))
  store.dispatch(traderEnvSlice.actions._updateForTest({
    base: { 123: traderEnv },
  }))
}

afterEach(() => {
  jest.clearAllMocks()
})

describe('#traderComboCard', () => {
  test('do not render if there is no env', () => {
    render(
      <TraderEnvCard
        traderEnv={null}
        isActive
      />,
    )
    const container = screen.queryByTestId('traderEnvCard')
    expect(container).toBeFalsy()
  })

  test('could render', () => {
    setupStore()
    render(
      <TraderEnvCard
        traderEnv={traderEnv}
      />,
    )
    const container = screen.getByTestId('traderEnvCard')
    expect(container).toBeTruthy()

    expect(screen.getByText(`Env: ${traderEnv.name}`)).toBeTruthy()
    expect(screen.getByText(parseTool.traderEnvStartDate(traderEnv))).toBeTruthy()
    expect(screen.queryByText('System')).toBeFalsy()
    expect(screen.queryByText('Trade based on selected 5 stocks')).toBeTruthy()
    expect(screen.queryByText('Trade based on all stocks available')).toBeFalsy()
    expect(container.className).not.toContain('card-active')

    const watchButton = screen.queryByTestId('watchButton')
    expect(watchButton).toBeFalsy()

    fireEvent.click(container)
  })

  test('could render as system and all tickers', () => {
    render(
      <TraderEnvCard
        traderEnv={{
          ...traderEnv,
          isSystem: true,
          tickerIds: null,
        }}
      />,
    )
    const container = screen.getByTestId('traderEnvCard')
    expect(container).toBeTruthy()
    expect(screen.getByText('System')).toBeTruthy()
    expect(screen.getByText('Trade based on all stocks available')).toBeTruthy()
  })

  test('could render as active', () => {
    render(
      <TraderEnvCard
        traderEnv={traderEnv}
        isActive
      />,
    )
    const container = screen.getByTestId('traderEnvCard')
    expect(container?.className).toContain('card-active')
  })

  test('could render as clickable', () => {
    setupStore()
    const onClick = jest.fn()
    render(
      <TraderEnvCard
        traderEnv={traderEnv}
        isActive
        onClick={onClick}
      />,
    )
    const container = screen.getByTestId('traderEnvCard')

    fireEvent.click(container)
    expect(onClick).toBeCalledTimes(1)
    expect(onClick).toBeCalledWith(123)
  })

  test('could render as disabled', () => {
    const onClick = jest.fn()
    render(
      <TraderEnvCard
        traderEnv={{
          ...traderEnv,
          id: 234,
        }}
        onClick={onClick}
      />,
    )
    const container = screen.getByTestId('traderEnvCard')
    expect(container?.className).toContain('card-disabled')
    const limitText = localeTool.t('permission.limited')
    expect(screen.getByText(limitText)).toBeTruthy()

    const watchButton = screen.getByTestId('watchButton')
    expect(watchButton).toBeTruthy()

    fireEvent.click(container)
    expect(onClick).toBeCalledTimes(0)
  })
})
