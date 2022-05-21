import * as index from './index'

describe('index', () => {
  test('has defined al constants', () => {
    expect(index.Trader).toBeDefined()
    expect(index.Behavior).toBeDefined()
    expect(index.BehaviorValue).toBeDefined()
    expect(index.Email).toBeDefined()
    expect(index.User).toBeDefined()
  })
})
