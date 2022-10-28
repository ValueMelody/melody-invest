import { render, screen, fireEvent } from 'test.utils'
import BehaviorLabel from './BehaviorLabel'
import * as parseTool from 'tools/parse'

describe('#BehaviorLabel', () => {
  const behavior = 'priceDailyIncreaseBuy'
  test('could render label', () => {
    render(
      <BehaviorLabel
        behavior={behavior}
        value={3}
        color='info'
      />,
    )
    const container = screen.getByTestId('behaviorLabel')
    expect(container).toBeTruthy()
    expect(container.children[0].innerHTML).toBe(
      `${parseTool.behaviorTitle(behavior)}: ${parseTool.behaviorValue(behavior, 3)}`
    )
    expect(container.className).toContain('cursorInfo')
    expect(container.className).not.toContain('cursorClickable')
    expect(container.getAttribute('title')).toBe(parseTool.behaviorDesc(behavior))

    fireEvent.click(container)
  })

  test('could render color', () => {
    render(
      <BehaviorLabel
        behavior={behavior}
        value={3}
        color='gray'
      />,
    )
    const container = screen.getByTestId('behaviorLabel')
    expect(container.classList).toContain('bg-gray-100')
  })

  test('could render without value', () => {
    render(
      <BehaviorLabel
        behavior={behavior}
        color='gray'
      />,
    )
    const container = screen.getByTestId('behaviorLabel')
    expect(container.children[0].innerHTML).toBe(parseTool.behaviorTitle(behavior))
  })

  test('could render as clickable', () => {
    const onClick = jest.fn()

    render(
      <BehaviorLabel
        behavior={behavior}
        value={3}
        color='info'
        onClick={onClick}
      />,
    )
    const container = screen.getByTestId('behaviorLabel')
    expect(container.className).toContain('cursorClickable')
    expect(container.classList).not.toContain('cursorInfo')

    fireEvent.click(container)
    expect(onClick).toBeCalledTimes(1)
    expect(onClick).toBeCalledWith(behavior)
  })
})
