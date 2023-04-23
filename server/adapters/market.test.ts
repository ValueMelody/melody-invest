import * as market from './market'

describe('#getCoolDownSeconds', () => {
  test('could get cooldown seconds', () => {
    expect(market.getCoolDownSeconds()).toBe(5)
  })
})
