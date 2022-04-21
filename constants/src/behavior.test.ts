import * as behavior from './behavior'

test('contain Buy Behaviors', () => {
  expect(behavior.PriceIncreaseBuyBehaviors.length).toBe(5)
  expect(behavior.PriceDecreaseBuyBehaviors.length).toBe(5)
  expect(behavior.FinancialImproveBuyBehaviors.length).toBe(7)
  expect(behavior.FinancialWorsenBuyBehaviors.length).toBe(7)
  expect(behavior.IndicatorIncreaseBuyBehaviors.length).toBe(11)
  expect(behavior.IndicatorDecreaseBuyBehaviors.length).toBe(11)
  expect(behavior.EconomyImproveBuyBehaviors.length).toBe(3)
  expect(behavior.EconomyWorsenBuyBehaviors.length).toBe(3)
  expect(behavior.BuyBehaviors).toStrictEqual([
    ...behavior.PriceIncreaseBuyBehaviors,
    ...behavior.PriceDecreaseBuyBehaviors,
    ...behavior.FinancialImproveBuyBehaviors,
    ...behavior.FinancialWorsenBuyBehaviors,
    ...behavior.IndicatorIncreaseBuyBehaviors,
    ...behavior.IndicatorDecreaseBuyBehaviors,
    ...behavior.EconomyImproveBuyBehaviors,
    ...behavior.EconomyWorsenBuyBehaviors,
  ])
})

test('contain Sell Behaviors', () => {
  expect(behavior.PriceIncreaseSellBehaviors.length).toBe(5)
  expect(behavior.PriceDecreaseSellBehaviors.length).toBe(5)
  expect(behavior.FinancialImproveSellBehaviors.length).toBe(7)
  expect(behavior.FinancialWorsenSellBehaviors.length).toBe(7)
  expect(behavior.IndicatorIncreaseSellBehaviors.length).toBe(11)
  expect(behavior.IndicatorDecreaseSellBehaviors.length).toBe(11)
  expect(behavior.EconomyImproveSellBehaviors.length).toBe(3)
  expect(behavior.EconomyWorsenSellBehaviors.length).toBe(3)
  expect(behavior.SellBehaviors).toStrictEqual([
    ...behavior.PriceIncreaseSellBehaviors,
    ...behavior.PriceDecreaseSellBehaviors,
    ...behavior.FinancialImproveSellBehaviors,
    ...behavior.FinancialWorsenSellBehaviors,
    ...behavior.IndicatorIncreaseSellBehaviors,
    ...behavior.IndicatorDecreaseSellBehaviors,
    ...behavior.EconomyImproveSellBehaviors,
    ...behavior.EconomyWorsenSellBehaviors,
  ])
})

test('contain Other Behaviors', () => {
  expect(behavior.AllocateBehaviors.length).toBe(5)
  expect(behavior.FrequencyBehaviors.length).toBe(2)
  expect(behavior.PreferenceBehaviors.length).toBe(2)
})

test('contain All Behaviors', () => {
  expect(behavior.Behaviors).toStrictEqual([
    ...behavior.BuyBehaviors,
    ...behavior.SellBehaviors,
    ...behavior.AllocateBehaviors,
    ...behavior.FrequencyBehaviors,
    ...behavior.PreferenceBehaviors,
  ])
})
