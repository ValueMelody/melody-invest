import * as vendor from './vendor'

describe('#', () => {
  test('have vendor defined', () => {
    expect(vendor.classNames).toBeDefined()
    expect(vendor.chart).toBeDefined()
    expect(vendor.dom).toBeDefined()
    expect(vendor.jss).toBeDefined()
    expect(vendor.ui).toBeDefined()
    expect(vendor.react).toBeDefined()
    expect(vendor.router).toBeDefined()
    expect(vendor.request).toBeDefined()
    expect(vendor.DatePicker).toBeDefined()
    expect(vendor.PasswordValidator).toBeDefined()
    expect(vendor.paypal).toBeDefined()
  })
})
