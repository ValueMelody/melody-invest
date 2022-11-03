import { renderHook, fireEvent, render, screen, act } from 'test.utils'
import useShowMore from './useShowMore'

describe('#usePasswordValidator', () => {
  test('could validate password', async () => {
    const { result } = renderHook(useShowMore)
    expect(result.current.displayedTotal).toBe(5)
    const element = result.current.renderShowMoreButton()
    const { rerender } = render(element)
    const container = screen.getByTestId('showMore')
    const button = container.querySelector('button')!

    act(() => { fireEvent.click(button) })
    expect(result.current.displayedTotal).toBe(15)

    const element1 = result.current.renderShowMoreButton()
    rerender(element1)
    const container1 = screen.getByTestId('showMore')
    const button1 = container1.querySelector('button')!

    act(() => { fireEvent.click(button1) })
    expect(result.current.displayedTotal).toBe(25)
  })
})
