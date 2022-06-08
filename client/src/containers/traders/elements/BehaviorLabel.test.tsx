import { render, screen, fireEvent } from '../../../test.utils'
import BehaviorLabel from './BehaviorLabel'
import * as parseTool from '../../../tools/parse'

describe('#BehaviorLabel', () => {
  const behavior = 'priceDailyIncreaseBuy'
  test('could render label', () => {
    render(
      <BehaviorLabel
        behavior={behavior}
        value={3}
        color='green'
      />,
    )
    const container = screen.getByTestId('behaviorLabel')
    expect(container).toBeTruthy()
    expect(container.innerHTML).toBe(`${parseTool.behaviorTitle(behavior)}: ${parseTool.behaviorValue(behavior, 3)}`)
    expect(container.classList).toContain('info-cursor')
    expect(container.classList).not.toContain('click-cursor')
    expect(container.classList).toContain('green')
    expect(container.getAttribute('title')).toBe(parseTool.behaviorDesc(behavior))

    fireEvent.click(container)
  })

  test('could render color', () => {
    render(
      <BehaviorLabel
        behavior={behavior}
        value={3}
        color='red'
      />,
    )
    const container = screen.getByTestId('behaviorLabel')
    expect(container.classList).toContain('red')
    expect(container.classList).not.toContain('green')
  })

  test('could render without value', () => {
    render(
      <BehaviorLabel
        behavior={behavior}
        color='red'
      />,
    )
    const container = screen.getByTestId('behaviorLabel')
    expect(container.innerHTML).toBe(parseTool.behaviorTitle(behavior))
  })

  test('could render as clickable', () => {
    const onClick = jest.fn()

    render(
      <BehaviorLabel
        behavior={behavior}
        value={3}
        color='green'
        onClick={onClick}
      />,
    )
    const container = screen.getByTestId('behaviorLabel')
    expect(container?.classList).toContain('click-cursor')
    expect(container?.classList).not.toContain('info-cursor')

    fireEvent.click(container)
    expect(onClick).toBeCalledTimes(1)
    expect(onClick).toBeCalledWith(behavior)
  })
})
