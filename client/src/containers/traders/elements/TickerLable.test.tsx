import * as interfaces from '@shared/interfaces'
import { render, screen, fireEvent } from '../../../test.utils'
import TickerLabel from './TickerLabel'

describe('#tickerLabel', () => {
  test('do not render if there is no ticker', () => {
    render(
      <TickerLabel
        ticker={null}
        color='green'
      />,
    )
    const container = screen.queryByTestId('tickerLabel')
    expect(container).toBeFalsy()
  })

  // @ts-ignore
  const ticker: interfaces.tickerModel.Identity = {
    id: 123,
    name: 'test name',
    symbol: 'test symbol',
  }

  test('could render ticker label', () => {
    render(
      <TickerLabel
        ticker={ticker}
        color='green'
      />,
    )
    const container = screen.getByTestId('tickerLabel')
    expect(container).toBeTruthy()
    expect(screen.getByText(ticker.symbol)).toBeTruthy()
    expect(container.getAttribute('title')).toBe(ticker.name)
    expect(container.classList).toContain('green')
    expect(container.classList).not.toContain('red')
    expect(container.classList).not.toContain('click-cursor')

    fireEvent.click(container)
  })

  test('could render as red', () => {
    render(
      <TickerLabel
        ticker={ticker}
        color='red'
      />,
    )
    const container = screen.getByTestId('tickerLabel')
    expect(container.classList).toContain('red')
    expect(container.classList).not.toContain('green')
  })

  test('could be clickable', () => {
    const onClick = jest.fn()
    render(
      <TickerLabel
        ticker={ticker}
        color='red'
        onClick={onClick}
      />,
    )
    const container = screen.getByTestId('tickerLabel')
    expect(container.classList).toContain('click-cursor')

    fireEvent.click(container)
    expect(onClick).toBeCalledTimes(1)
    expect(onClick).toBeCalledWith(123)
  })
})
