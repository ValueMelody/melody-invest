import * as verify from './verify'

describe('#isEmail', () => {
  test('could test email', () => {
    expect(verify.isEmail('a@email.com')).toBeTruthy()
    expect(verify.isEmail('abc@outlook.com')).toBeTruthy()
    expect(verify.isEmail('abc@outlook')).toBeFalsy()
    expect(verify.isEmail('@outlook.com')).toBeFalsy()
    expect(verify.isEmail('abcoutlook.com')).toBeFalsy()
    expect(verify.isEmail('abc@outlook.')).toBeFalsy()
  })
})

describe('#isGreaterThanZero', () => {
  test('could test value', () => {
    expect(verify.isGreaterThanZero(2)).toBeTruthy()
    expect(verify.isGreaterThanZero(1)).toBeTruthy()
    expect(verify.isGreaterThanZero(0)).toBeFalsy()
    expect(verify.isGreaterThanZero(-1)).toBeFalsy()
  })
})
