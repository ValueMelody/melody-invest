import * as behavior from './behavior'
import * as behaviorValue from './behaviorValue'

describe('#Preference', () => {
  test('defined preference correctly', () => {
    expect(Object.values(behaviorValue.Preference).length).toBe(22)
    Object.keys(behaviorValue.Preference).forEach((key) => {
      expect(key.includes('Higher') || key.includes('Lower')).toBeTruthy()
    })
  })
})

describe('#Options', () => {
  test('defined options correctly', () => {
    expect(Object.values(behaviorValue.Options).length).toBe(behavior.Behaviors.length)
    Object.values(behaviorValue.Options).forEach((value) => {
      expect(Array.isArray(value)).toBeTruthy()
    })
  })
})
