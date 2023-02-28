import { act, fireEvent, render, renderHook, screen } from 'test.utils'
import useShowMore from './useShowMore'

describe('#usePasswordValidator', () => {
  test('could validate password', async () => {
    const { result } = renderHook(useShowMore)
    expect(result.current.displayedTotal).toBe(5)
    const element = result.current.renderShowMoreButton()
    const { rerender } = render(element)

    await act(() => { fireEvent.click(screen.getByTestId('showMore')) })
    expect(result.current.displayedTotal).toBe(15)

    const element1 = result.current.renderShowMoreButton()
    rerender(element1)

    await act(() => { fireEvent.click(screen.getByTestId('showMore')) })
    expect(result.current.displayedTotal).toBe(25)
  })
})
