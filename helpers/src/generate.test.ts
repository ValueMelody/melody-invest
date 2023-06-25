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
