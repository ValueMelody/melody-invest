import { renderHook, act } from 'test.utils'
import useCommonState from './useCommonState'

describe('#activeChartIndex', () => {
  test('could getActiveChartIndex', () => {
    const { result } = renderHook(useCommonState)
    expect(result.current.getActiveChartIndex()).toBe(0)
  })

  test('could trigger setActiveChartIndex', () => {
    const { result } = renderHook(useCommonState)
    act(() => result.current.setActiveChartIndex(1))
    expect(result.current.getActiveChartIndex()).toBe(1)
    act(() => result.current.setActiveChartIndex(0))
    expect(result.current.getActiveChartIndex()).toBe(0)
  })
})

describe('#messages', () => {
  test('could getMessages', () => {
    const { result } = renderHook(useCommonState)
    expect(result.current.getMessages()).toStrictEqual([])
  })

  const message1 = {
    id: 111,
    title: 'this is title',
    type: 'success',
    desc: 'this is desc',
  }
  const message2 = {
    id: 222,
    title: 'this is title',
    type: 'success',
    desc: 'this is desc',
  }

  test('could addMessage', () => {
    const { result } = renderHook(useCommonState)
    act(() => result.current.addMessage(message1))
    expect(result.current.getMessages()).toStrictEqual([message1])
    act(() => result.current.addMessage(message2))
    expect(result.current.getMessages()).toStrictEqual([message1, message2])
  })

  test('could removeMessage', () => {
    const { result } = renderHook(useCommonState)
    act(() => result.current.addMessage(message1))
    act(() => result.current.addMessage(message2))

    act(() => result.current.removeMessage(222))
    expect(result.current.getMessages()).toStrictEqual([message1])

    act(() => result.current.removeMessage(111))
    expect(result.current.getMessages()).toStrictEqual([])
  })
})
