import * as tax from './tax'

describe('#getTaxAmount', () => {
  test('could get correct amount', () => {
    expect(tax.getTaxAmount('100', 'CA', 'ON')).toBe('13.00')
  })
  test('could get correct amount', () => {
    expect(tax.getTaxAmount('100', 'CA', 'AB')).toBe('5.00')
  })
  test('could get correct amount', () => {
    expect(tax.getTaxAmount('100', 'US', '')).toBe('0.00')
  })
})
