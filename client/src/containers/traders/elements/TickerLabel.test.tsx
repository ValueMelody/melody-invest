import * as interfaces from '@shared/interfaces'
import { fireEvent, render, screen } from 'test.utils'
import TickerLabel from './TickerLabel'
import { mock } from 'ts-mockito'

describe('#tickerLabel', () => {
  test('do not render if there is no ticker', () => {
    render(
      <TickerLabel
        ticker={null}
        color='info'
      />,
    )
    const container = screen.queryByTestId('tickerLabel')
    expect(container).toBeFalsy()
  })

  const identityMock: interfaces.tickerModel.Record = mock({})
  const ticker = {
    ...identityMock,
    id: 123,
    name: 'test name',
    region: 'US',
    symbol: 'test symbol',
  }

  test('could render ticker label', () => {
    render(
      <TickerLabel
        ticker={ticker}
        color='info'
      />,
    )
    const container = screen.getByTestId('tickerLabel')
    expect(container).toBeTruthy()
    expect(screen.getByText(ticker.symbol)).toBeTruthy()
    expect(container.getAttribute('title')).toBe(`US: ${ticker.symbol}`)
    expect(container.className).not.toContain('cursor-pointer')

    fireEvent.click(container)
  })

  test('could render as gray', () => {
    render(
      <TickerLabel
        ticker={ticker}
        color='gray'
      />,
    )
    const container = screen.getByTestId('tickerLabel')
    expect(container.classList).toContain('bg-gray-100')
  })

  test('could be clickable', () => {
    const onClick = jest.fn()
    render(
      <TickerLabel
        ticker={ticker}
        color='gray'
        onClick={onClick}
      />,
    )
    const container = screen.getByTestId('tickerLabel')
    expect(container.className).toContain('cursor-pointer')

    fireEvent.click(container)
    expect(onClick).toBeCalledTimes(1)
    expect(onClick).toBeCalledWith(123)
  })
})
