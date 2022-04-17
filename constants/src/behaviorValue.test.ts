import * as behaviorValue from './behaviorValue'
import * as behavior from './behavior'

test('contain expected values', () => {
  expect(Object.values(behaviorValue.preference).length).toBe(22)
  expect(Object.values(behaviorValue.options).length).toBe(behavior.behaviors.length)
})
