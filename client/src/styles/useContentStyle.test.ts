import { renderHook } from 'test.utils'
import useContentStyle from './useContentStyle'

describe('#useContentStyle', () => {
  test('could render content style', () => {
    const { result } = renderHook(() => useContentStyle())
    expect(result.current.contentClasses.pageTitle).toBeDefined()
    expect(result.current.contentClasses.contentTextarea).toBeDefined()
  })
})
