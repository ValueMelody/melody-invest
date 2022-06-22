import { renderHook } from '@testing-library/react-hooks'
import useCardStyle from './useCardStyle'

describe('#useCardStyle', () => {
  test('could render card style', () => {
    const { result } = renderHook(() => useCardStyle())
    expect(result.current.cardClasses.container).toBeDefined()
    expect(result.current.cardClasses.isActive).toBeDefined()
    expect(result.current.cardClasses.disabled).toBeDefined()
  })
})
