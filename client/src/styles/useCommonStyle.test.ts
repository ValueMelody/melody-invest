import { renderHook } from 'test.utils'
import useCommonStyle from './useCommonStyle'

describe('#useCommonStyle', () => {
  test('could render common style', () => {
    const { result } = renderHook(() => useCommonStyle())
    expect(result.current.commonClasses.rowBetween).toBeDefined()
    expect(result.current.commonClasses.rowAround).toBeDefined()
    expect(result.current.commonClasses.rowStart).toBeDefined()
    expect(result.current.commonClasses.rowCenter).toBeDefined()
    expect(result.current.commonClasses.columnCenter).toBeDefined()
    expect(result.current.commonClasses.columnStart).toBeDefined()
    expect(result.current.commonClasses.cursorInfo).toBeDefined()
    expect(result.current.commonClasses.cursorClickable).toBeDefined()
  })
})
