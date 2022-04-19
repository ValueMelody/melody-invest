import * as generate from './generate'

test('could generate sha256', () => {
  const first = generate.toSHA256('123')
  const second = generate.toSHA256('abcdefg')
  expect(first.length).toEqual(64)
  expect(second.length).toEqual(64)
  expect(first).not.toEqual(second)
})

test('could generate sha512', () => {
  const first = generate.toSHA512('123')
  const second = generate.toSHA512('abcdefg')
  expect(first.length).toEqual(128)
  expect(second.length).toEqual(128)
  expect(first).not.toEqual(second)
})

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

test('could encrypt password', () => {
  const first = generate.buildEncryptedPassword('123')
  const second = generate.buildEncryptedPassword('abcdefg')
  expect(first.length).toEqual(64)
  expect(second.length).toEqual(64)
  expect(first).not.toEqual(second)
})

test('could generate activation code', () => {
  const first = generate.buildActivationCode()
  const second = generate.buildActivationCode()
  expect(first.length).toEqual(64)
  expect(second.length).toEqual(64)
  expect(first).not.toEqual(second)
})

test('could encode jwt', () => {
  const first = generate.encodeJWT({ id: 1, email: 'abc' }, '12h')
  const second = generate.encodeJWT({ id: 1, email: 'abc' }, '30d')
  const third = generate.encodeJWT({ id: 2, email: 'abc' }, '30d')
  expect(first.length).toBeTruthy()
  expect(second.length).toBeTruthy()
  expect(third.length).toBeTruthy()
  expect(first).not.toEqual(second)
  expect(second).not.toEqual(third)
  expect(third).not.toEqual(first)
})

test('could decode jwt', () => {
  const jwt = generate.encodeJWT({ id: 1, email: 'abc' }, '12h')
  const result = generate.decodeJWT(jwt)
  expect(result?.id).toBe(1)
  expect(result?.email).toBe('abc')
})

test('could pick number in range', () => {
  const num1 = generate.pickNumberInRange(1, 2)
  expect(num1).toBeGreaterThanOrEqual(1)
  expect(num1).toBeLessThanOrEqual(2)
  const num2 = generate.pickNumberInRange(3, 5)
  expect(num2).toBeGreaterThanOrEqual(3)
  expect(num2).toBeLessThanOrEqual(5)
})

test('could pick one number', () => {
  const num1 = generate.pickOneNumber(1, 2)
  expect(num1).toBeGreaterThanOrEqual(1)
  expect(num1).toBeLessThanOrEqual(2)
  const num2 = generate.pickOneNumber(3, 5)
  expect(num2).toBeGreaterThanOrEqual(3)
  expect(num2).toBeLessThanOrEqual(5)
})

test('could get numbers in range', () => {
  expect(generate.getNumbersInRange(1, 2)).toStrictEqual([1, 2])
  expect(generate.getNumbersInRange(1, 5)).toStrictEqual([1, 2, 3, 4, 5])
  expect(() => generate.getNumbersInRange(1, 1)).toThrowError()
})

test('could get changed percent', () => {
  expect(generate.getChangePercent(100, 10)).toBe(90000)
  expect(generate.getChangePercent(90, 100)).toBe(-1000)
})

test('could sort numbers to string', () => {
  expect(generate.sortNumsToString([1, 2, 3, 4, 5])).toBe('1,2,3,4,5')
  expect(generate.sortNumsToString([5, 4, 3])).toBe('3,4,5')
  expect(generate.sortNumsToString([3, 1, 2])).toBe('1,2,3')
})
