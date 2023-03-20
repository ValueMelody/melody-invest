import * as localeTool from './locale'

describe('#t', () => {
  test('could return translation', () => {
    expect(localeTool.t('holdingShare.new')).toBe('New')
    expect(localeTool.t('account.email')).toBe('Email')
    expect(localeTool.t('common.notexistrandomstring')).toBe('common.notexistrandomstring')
  })
})

describe('#getStateName', () => {
  test('could return state name', () => {
    expect(localeTool.getStateName('CA')).toBe('Canada')
  })
})

describe('#getProvinceName', () => {
  test('could return province name', () => {
    expect(localeTool.getProvinceName('CA', 'ON')).toBe('Ontario')
  })
})
