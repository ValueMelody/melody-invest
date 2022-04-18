import { render, screen, fireEvent } from '../../../test.utils'
import WatchButton from './WatchButton'
import * as localeTool from '../../../tools/locale'

test('could render as watched', async () => {
  const onClick = jest.fn()

  render(
    <WatchButton isWatched onToggle={onClick} />,
  )
  const container = screen.getByTestId('watchButton')
  expect(container).toBeTruthy()
  expect(container.querySelector('.eye')).toBeTruthy()
  expect(container.querySelector('.slash')).toBeTruthy()
  expect(container.textContent).toBe(localeTool.t('common.unwatch'))
  expect(container).toHaveClass('grey')
  fireEvent.click(container)
  expect(onClick).toBeCalledTimes(1)
})

test('could render as not watched', async () => {
  const onClick = jest.fn()

  render(
    <WatchButton isWatched={false} onToggle={onClick} />,
  )
  const container = screen.getByTestId('watchButton')
  expect(container).toBeTruthy()
  expect(container.querySelector('.eye')).toBeTruthy()
  expect(container.textContent).toBe(localeTool.t('common.watch'))
  expect(container).toHaveClass('blue')
  fireEvent.click(container)
  expect(onClick).toBeCalledTimes(1)
})
