import * as behavior from './behavior'

test('contain Buy Behaviors', () => {
  expect(behavior.priceIncreaseBuyBehaviors).toBeDefined()
  expect(behavior.priceDecreaseBuyBehaviors).toBeDefined()
  expect(behavior.financialImproveBuyBehaviors).toBeDefined()
  expect(behavior.financialWorsenBuyBehaviors).toBeDefined()
  expect(behavior.indicatorIncreaseBuyBehaviors).toBeDefined()
  expect(behavior.indicatorDecreaseBuyBehaviors).toBeDefined()
  expect(behavior.economyImproveBuyBehaviors).toBeDefined()
  expect(behavior.economyWorsenBuyBehaviors).toBeDefined()
  expect(behavior.buyBehaviors).toStrictEqual([
    ...behavior.priceIncreaseBuyBehaviors,
    ...behavior.priceDecreaseBuyBehaviors,
    ...behavior.financialImproveBuyBehaviors,
    ...behavior.financialWorsenBuyBehaviors,
    ...behavior.indicatorIncreaseBuyBehaviors,
    ...behavior.indicatorDecreaseBuyBehaviors,
    ...behavior.economyImproveBuyBehaviors,
    ...behavior.economyWorsenBuyBehaviors,
  ])
})

test('contain Sell Behaviors', () => {
  expect(behavior.priceIncreaseSellBehaviors).toBeDefined()
  expect(behavior.priceDecreaseSellBehaviors).toBeDefined()
  expect(behavior.financialImproveSellBehaviors).toBeDefined()
  expect(behavior.financialWorsenSellBehaviors).toBeDefined()
  expect(behavior.indicatorIncreaseSellBehaviors).toBeDefined()
  expect(behavior.indicatorDecreaseSellBehaviors).toBeDefined()
  expect(behavior.economyImproveSellBehaviors).toBeDefined()
  expect(behavior.economyWorsenSellBehaviors).toBeDefined()
  expect(behavior.sellBehaviors).toStrictEqual([
    ...behavior.priceIncreaseSellBehaviors,
    ...behavior.priceDecreaseSellBehaviors,
    ...behavior.financialImproveSellBehaviors,
    ...behavior.financialWorsenSellBehaviors,
    ...behavior.indicatorIncreaseSellBehaviors,
    ...behavior.indicatorDecreaseSellBehaviors,
    ...behavior.economyImproveSellBehaviors,
    ...behavior.economyWorsenSellBehaviors,
  ])
})

test('contain Other Behaviors', () => {
  expect(behavior.allocateBehaviors).toBeDefined()
  expect(behavior.frequencyBehaviors).toBeDefined()
  expect(behavior.preferenceBehaviors).toBeDefined()
})

test('contain All Behaviors', () => {
  expect(behavior.behaviors).toStrictEqual([
    ...behavior.buyBehaviors,
    ...behavior.sellBehaviors,
    ...behavior.allocateBehaviors,
    ...behavior.frequencyBehaviors,
    ...behavior.preferenceBehaviors,
  ])
})
