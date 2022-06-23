import { renderHook } from 'test.utils'
import useTraderStyle from './useTraderStyle'

describe('#useTraderStyle', () => {
  test('could render trader style', () => {
    const { result } = renderHook(() => useTraderStyle())
    expect(result.current.traderClasses.root).toBeDefined()
    expect(result.current.traderClasses.aside).toBeDefined()
    expect(result.current.traderClasses.main).toBeDefined()
  })
})
