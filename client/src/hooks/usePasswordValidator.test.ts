import * as localeTool from 'tools/locale'
import { renderHook } from 'test.utils'
import usePasswordValidator from './usePasswordValidator'

describe('#usePasswordValidator', () => {
  test('could validate password', () => {
    const { result } = renderHook(usePasswordValidator)

    const minError = localeTool.t('error.password.requireMin', { num: 10 })
    expect(result.current.validatePassword('123456789')).toBe(minError)

    const upperError = localeTool.t('error.password.requireUpper')
    expect(result.current.validatePassword('a123456789')).toBe(upperError)

    const lowerError = localeTool.t('error.password.requireLower')
    expect(result.current.validatePassword('A123456789')).toBe(lowerError)

    const symbolError = localeTool.t('error.password.requireSymbol')
    expect(result.current.validatePassword('Aa12345678')).toBe(symbolError)

    expect(result.current.validatePassword('Aa1234567!')).toBe('')
  })
})
