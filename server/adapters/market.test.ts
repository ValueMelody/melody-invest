import * as market from './market'

describe('#getCooldownPerMin', () => {
  test('could get cooldown per min', () => {
    expect(market.getCooldownPerMin()).toBe(5)
  })
})
