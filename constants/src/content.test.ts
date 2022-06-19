import * as content from './content'

describe('Status', () => {
  test('has defined email status', () => {
    expect(content.PolicyType.Privacy).toBeDefined()
    expect(content.PolicyType.TermsAndConditions).toBeDefined()
  })
})
