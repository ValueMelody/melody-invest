import * as behaviorValue from './behaviorValue'
import * as behavior from './behavior'

test('contain expected values', () => {
  expect(Object.values(behaviorValue.Preference).length).toBe(22)
  expect(Object.values(behaviorValue.options).length).toBe(behavior.Behaviors.length)
})
