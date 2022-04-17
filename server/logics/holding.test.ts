import * as holding from './holding'

test('could get default initial cash', () => {
  expect(holding.getInitialCash()).toEqual(10000000)
})
