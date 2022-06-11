import { render, screen, fireEvent } from '../../../test.utils'
import TraderEnvCard from './TraderEnvCard'
import * as parseTool from '../../../tools/parse'

describe('#traderComboCard', () => {
  test('do not render if there is no combo', () => {
    render(
      <TraderEnvCard
        traderEnv={null}
        isActive
      />,
    )
    const container = screen.queryByTestId('traderEnvCard')
    expect(container).toBeFalsy()
  })

  const traderEnv = {
    id: 123,
    name: 'test env',
    isSystem: false,
    startDate: '2001-01-02',
    tickerIds: [1, 2, 3, 4, 5],
    activeTotal: 100,
  }

  test('could render', () => {
    render(
      <TraderEnvCard
        traderEnv={traderEnv}
        isActive={false}
      />,
    )
    const container = screen.getByTestId('traderEnvCard')
    expect(container).toBeTruthy()
    expect(screen.getByText(`Env: ${traderEnv.name}`)).toBeTruthy()
    expect(screen.getByText(parseTool.traderEnvStartDate(traderEnv))).toBeTruthy()
    expect(screen.queryByText('System')).toBeFalsy()
    expect(screen.getByText('Trade based on selected 5 stocks')).toBeTruthy()
    expect(screen.queryByText('Trade based on all stocks available')).toBeFalsy()

    expect(container?.className).not.toContain('isActive')
    expect(container?.classList).not.toContain('click-cursor')

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
        isActive={false}
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
    )
    const container = screen.getByTestId('traderEnvCard')
    expect(container.classList).toContain('click-cursor')

    fireEvent.click(container)
    expect(onClick).toBeCalledTimes(1)
    expect(onClick).toBeCalledWith(123)
  })
})
