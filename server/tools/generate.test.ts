import * as generate from './generate'

test('could generate sha256', async () => {
  const first = generate.toSHA256('123')
  const second = generate.toSHA256('abcdefg')
  expect(first.length).toEqual(64)
  expect(second.length).toEqual(64)
  expect(first).not.toEqual(second)
})

test('could generate sha512', async () => {
  const first = generate.toSHA512('123')
  const second = generate.toSHA512('abcdefg')
  expect(first.length).toEqual(128)
  expect(second.length).toEqual(128)
  expect(first).not.toEqual(second)
})

test('could generate accessHash', async () => {
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

test('could encrypt password', async () => {
  const first = generate.buildEncryptedPassword('123')
  const second = generate.buildEncryptedPassword('abcdefg')
  expect(first.length).toEqual(64)
  expect(second.length).toEqual(64)
  expect(first).not.toEqual(second)
})

test('could generate activation code', async () => {
  const first = generate.buildActivationCode()
  const second = generate.buildActivationCode()
  expect(first.length).toEqual(64)
  expect(second.length).toEqual(64)
  expect(first).not.toEqual(second)
})

test('could encode jwt', async () => {
  const first = generate.encodeJWT({ id: 1, email: 'abc' }, '12h')
  const second = generate.encodeJWT({ id: 1, email: 'abc' }, '30d')
  expect(first.length).toBeTruthy()
  expect(second.length).toBeTruthy()
  expect(first).not.toEqual(second)
})
