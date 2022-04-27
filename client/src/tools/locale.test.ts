import * as localeTool from './locale'

describe('#t', () => {
  test('could return translation', () => {
    expect(localeTool.t('common.new')).toBe('New')
    expect(localeTool.t('common.email')).toBe('Email')
    expect(localeTool.t('common.notexistrandomstring')).toBe('common.notexistrandomstring')
  })
})
