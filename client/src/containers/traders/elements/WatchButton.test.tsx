import * as localeTool from 'tools/locale'
import { fireEvent, render, screen } from 'test.utils'
import WatchButton from './WatchButton'

describe('#WatchButton', () => {
  test('could render as watched', () => {
    const onClick = jest.fn()

    render(
      <WatchButton
        isWatched
        onToggle={onClick}
      />,
    )
    const container = screen.getByTestId('watchButton')
    expect(container).toBeTruthy()
    expect(container.textContent).toBe(localeTool.t('watchButton.unwatch'))
    expect(container).not.toHaveClass('bg-blue-700')
    fireEvent.click(container)
    expect(onClick).toBeCalledTimes(1)
  })

  test('could render as not watched', () => {
    const onClick = jest.fn()

    render(
      <WatchButton
        isWatched={false}
        onToggle={onClick}
      />,
    )
    const container = screen.getByTestId('watchButton')
    expect(container).toBeTruthy()
    expect(container.textContent).toBe(localeTool.t('watchButton.watch'))
    expect(container).toHaveClass('bg-blue-700')
    fireEvent.click(container)
    expect(onClick).toBeCalledTimes(1)
  })
})
