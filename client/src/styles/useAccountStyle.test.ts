import { renderHook } from '@testing-library/react-hooks'
import useAccountStyle from './useAccountStyle'

describe('#useAccountStyle', () => {
  test('could render account style', () => {
    const { result } = renderHook(() => useAccountStyle())
    expect(result.current.accountClasses.container).toBeDefined()
    expect(result.current.accountClasses.title).toBeDefined()
    expect(result.current.accountClasses.row).toBeDefined()
    expect(result.current.accountClasses.routerButton).toBeDefined()
  })
})
