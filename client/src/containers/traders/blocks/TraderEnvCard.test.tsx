import * as constants from '@shared/constants'
import { render, screen, fireEvent } from 'test.utils'
import { Context } from 'context'
import * as parseTool from 'tools/parse'
import * as localeTool from 'tools/locale'
import TraderEnvCard from './TraderEnvCard'

const traderEnv = {
  id: 123,
  name: 'test env',
  isSystem: false,
  startDate: '2001-01-02',
  tickerIds: [1, 2, 3, 4, 5],
  activeTotal: 100,
}

// @ts-ignore
const store: Context = {
  // @ts-ignore
  resources: {
    userType: constants.User.Type.Pro,
    userTraderIds: [],
  },
  traderCombos: {
  },
  traderEnvs: {
    // @ts-ignore
    123: {
      // @ts-ignore
      record: traderEnv,
    },
  },
}

describe('#traderComboCard', () => {
  test('do not render if there is no combo', () => {
    render(
      <TraderEnvCard
        traderEnv={null}
        isActive
      />,
      { store },
    )
    const container = screen.queryByTestId('traderEnvCard')
    expect(container).toBeFalsy()
  })

  test('could render', () => {
    render(
      <TraderEnvCard
        traderEnv={traderEnv}
      />,
      { store },
    )
    const container = screen.getByTestId('traderEnvCard')
    expect(container).toBeTruthy()
    expect(screen.getByText(`Env: ${traderEnv.name}`)).toBeTruthy()
    expect(screen.getByText(parseTool.traderEnvStartDate(traderEnv))).toBeTruthy()
    expect(screen.queryByText('System')).toBeFalsy()
    expect(screen.getByText('Trade based on selected 5 stocks')).toBeTruthy()
    expect(screen.queryByText('Trade based on all stocks available')).toBeFalsy()

    expect(container.className).not.toContain('isActive')

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
      { store },
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
      { store },
    )
    const container = screen.getByTestId('traderEnvCard')
    expect(container?.className).toContain('isActive')
  })

  test('could render as clickable', () => {
    const onClick = jest.fn()
    render(
      <TraderEnvCard
        traderEnv={traderEnv}
        isActive
        onClick={onClick}
      />,
      { store },
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
      { store },
    )
    const container = screen.getByTestId('traderEnvCard')
    expect(container?.className).toContain('disabled')
    const limitText = localeTool.t('permission.limited')
    expect(screen.getByText(limitText)).toBeTruthy()

    const watchButton = screen.getByTestId('watchButton')
    expect(watchButton).toBeTruthy()

    fireEvent.click(container)
    expect(onClick).toBeCalledTimes(0)
  })
})
