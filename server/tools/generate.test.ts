import * as generate from './generate'

describe('#toSHA256', () => {
  test('could generate sha256', () => {
    const first = generate.toSHA256('123')
    const second = generate.toSHA256('abcdefg')
    expect(first.length).toEqual(64)
    expect(second.length).toEqual(64)
    expect(first).toEqual(generate.toSHA256('123'))
    expect(first).not.toEqual(second)
  })
})

describe('#toSHA512', () => {
  test('could generate sha512', () => {
    const first = generate.toSHA512('123')
    const second = generate.toSHA512('abcdefg')
    expect(first.length).toEqual(128)
    expect(second.length).toEqual(128)
    expect(first).toEqual(generate.toSHA512('123'))
    expect(first).not.toEqual(second)
  })
})

describe('buildAccessHash', () => {
  test('could generate accessHash', () => {
    const accesses = [
      generate.buildAccessHash(0),
      generate.buildAccessHash(1),
      generate.buildAccessHash(10),
      generate.buildAccessHash(32),
      generate.buildAccessHash(33),
    ]
    expect(accesses[0].length).toEqual(0)
    expect(accesses[1].length).toEqual(1)
    expect(accesses[2].length).toEqual(10)
    expect(accesses[3].length).toEqual(32)
    expect(accesses[4].length).toEqual(32)

    const uniqueAccesses = Array.from(new Set(accesses))
    expect(accesses.length).toEqual(uniqueAccesses.length)
  })
})

describe('#buildEncryptedPassword', () => {
  test('could encrypt password', () => {
    const first = generate.buildEncryptedPassword('123')
    const second = generate.buildEncryptedPassword('abcdefg')
    expect(first.length).toEqual(64)
    expect(second.length).toEqual(64)
    expect(first).not.toEqual(second)
  })
})

describe('#buildAccessCode', () => {
  test('could generate activation code', () => {
    const first = generate.buildAccessCode()
    const second = generate.buildAccessCode()
    expect(first.length).toEqual(64)
    expect(second.length).toEqual(64)
    expect(first).not.toEqual(second)
  })
})

describe('#encodeJWT', () => {
  test('could encode jwt', () => {
    const first = generate.encodeJWT({ id: 1, email: 'abc', type: 1 }, '12h')
    const second = generate.encodeJWT({ id: 1, email: 'abc', type: 2 }, '30d')
    const third = generate.encodeJWT({ id: 2, email: 'abc', type: 3 }, '30d')
    expect(first.length).toBeTruthy()
    expect(second.length).toBeTruthy()
    expect(third.length).toBeTruthy()
    expect(first).not.toEqual(second)
    expect(second).not.toEqual(third)
    expect(third).not.toEqual(first)
  })
})

describe('#decodeJWT', () => {
  test('could decode accessToken', () => {
    const jwt = generate.encodeJWT({ id: 1, email: 'abc', type: 1 }, '12h')
    const result = generate.decodeJWT(jwt, false)
    expect(result?.id).toBe(1)
    expect(result?.email).toBe('abc')
    expect(result?.type).toBe(1)
  })
  test('could decode refreshToken', () => {
    const jwt = generate.encodeJWT({ id: 1, email: 'abc', type: 1 }, '12h', true)
    const result = generate.decodeJWT(jwt, true)
    expect(result?.id).toBe(1)
    expect(result?.email).toBe('abc')
    expect(result?.type).toBe(1)
  })
  test('return null if not valid', () => {
    // @ts-ignore
    const wrongJwt = generate.encodeJWT({ code: 1, name: 'abc' }, '12h')
    const result = generate.decodeJWT(wrongJwt, false)
    expect(result).toBeNull()
  })
})

describe('#pickNumberInRange', () => {
  test('could pick number in range', () => {
    const num1 = generate.pickNumberInRange(1, 2)
    expect(num1).toBeGreaterThanOrEqual(1)
    expect(num1).toBeLessThanOrEqual(2)
    const num2 = generate.pickNumberInRange(3, 5)
    expect(num2).toBeGreaterThanOrEqual(3)
    expect(num2).toBeLessThanOrEqual(5)
  })
})

describe('#pickOneNumber', () => {
  test('could pick one number', () => {
    const num1 = generate.pickOneNumber(1, 2)
    expect([1, 2]).toContain(num1)
    const num2 = generate.pickOneNumber(3, 5)
    expect([3, 5]).toContain(num2)
    const num3 = generate.pickOneNumber(-1, -2)
    expect([-1, -2]).toContain(num3)
    const num4 = generate.pickOneNumber(-1, -3)
    expect([-1, -3]).toContain(num4)
    const num5 = generate.pickOneNumber(0, 100)
    expect([0, 100]).toContain(num5)
    const num6 = generate.pickOneNumber(0, 1)
    expect([0, 1]).toContain(num6)
    const num7 = generate.pickOneNumber(0, -1)
    expect([0, -1]).toContain(num7)
    const num8 = generate.pickOneNumber(1, -1)
    expect([1, -1]).toContain(num8)
    const num9 = generate.pickOneNumber(2, -2)
    expect([2, -2]).toContain(num9)
    const num10 = generate.pickOneNumber(3, -3)
    expect([3, -3]).toContain(num10)
  })
})

describe('#getNumbersInRange', () => {
  test('could get numbers in range', () => {
    expect(generate.getNumbersInRange(1, 2)).toStrictEqual([1, 2])
    expect(generate.getNumbersInRange(1, 5)).toStrictEqual([1, 2, 3, 4, 5])
    expect(() => generate.getNumbersInRange(1, 1)).toThrowError()
  })
})

describe('#getChangePercent', () => {
  test('could get changed percent', () => {
    expect(generate.getChangePercent(100, 10)).toBe(90000)
    expect(generate.getChangePercent(90, 100)).toBe(-1000)
  })
})

describe('#sortNumsToString', () => {
  test('could sort numbers to string', () => {
    expect(generate.sortNumsToString([1, 2, 3, 4, 5])).toBe('1,2,3,4,5')
    expect(generate.sortNumsToString([5, 4, 3])).toBe('3,4,5')
    expect(generate.sortNumsToString([3, 1, 2])).toBe('1,2,3')
  })
})

describe('#buildEmail', () => {
  test('could build activation email', () => {
    const activationOptions = [
      { label: 'title', value: 'some title' },
      { label: 'content', value: 'some content' },
      { label: 'desc', value: 'some desc' },
      { label: 'link', value: 'some link' },
      { label: 'buttonTitle', value: 'some buttonTitle' },
    ]
    const rawActivation = generate.buildEmailContent('userActivation')
    const activation = generate.buildEmailContent('userActivation', activationOptions)
    activationOptions.forEach((option) => {
      expect(rawActivation).toContain(`{{{${option.label}}}}`)
      expect(activation).toContain(option.value)
      expect(activation).not.toContain(`{{{${option.label}}}}`)
    })
  })
  test('could build resetPassword email', () => {
    const resetOptions = [
      { label: 'title', value: 'some title' },
      { label: 'content', value: 'some content' },
      { label: 'desc', value: 'some desc' },
      { label: 'link', value: 'some link' },
      { label: 'buttonTitle', value: 'some buttonTitle' },
    ]
    const rawReset = generate.buildEmailContent('passwordReset')
    const reset = generate.buildEmailContent('passwordReset', resetOptions)
    resetOptions.forEach((option) => {
      expect(rawReset).toContain(`{{{${option.label}}}}`)
      expect(reset).toContain(option.value)
      expect(reset).not.toContain(`{{{${option.label}}}}`)
    })
  })
})
