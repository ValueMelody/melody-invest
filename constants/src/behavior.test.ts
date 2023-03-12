import * as behavior from './behavior'

describe('#BuyBehaviors', () => {
  test('contain all type of buy behaviors', () => {
    expect(behavior.PriceIncreaseBuyBehaviors.length).toBe(5)
    expect(behavior.PriceDecreaseBuyBehaviors.length).toBe(5)
    expect(behavior.FinancialImproveBuyBehaviors.length).toBe(7)
    expect(behavior.FinancialWorsenBuyBehaviors.length).toBe(7)
    expect(behavior.IndicatorIncreaseBuyBehaviors.length).toBe(11)
    expect(behavior.IndicatorDecreaseBuyBehaviors.length).toBe(11)
    expect(behavior.EconomyImproveBuyBehaviors.length).toBe(3)
    expect(behavior.EconomyWorsenBuyBehaviors.length).toBe(3)
    expect(behavior.TickerMovementBuyBehaviors).toStrictEqual([
      ...behavior.PriceIncreaseBuyBehaviors,
      ...behavior.PriceDecreaseBuyBehaviors,
      ...behavior.FinancialImproveBuyBehaviors,
      ...behavior.FinancialWorsenBuyBehaviors,
    ])
    expect(behavior.IndicatorMovementBuyBehaviors).toStrictEqual([
      ...behavior.IndicatorIncreaseBuyBehaviors,
      ...behavior.IndicatorDecreaseBuyBehaviors,
    ])
    expect(behavior.MovementBuyBehaviors).toStrictEqual([
      ...behavior.TickerMovementBuyBehaviors,
      ...behavior.IndicatorMovementBuyBehaviors,
    ])
    expect(behavior.IndicatorCompareBuyBehaviors).toStrictEqual([
      ...behavior.EconomyImproveBuyBehaviors,
      ...behavior.EconomyWorsenBuyBehaviors,
    ])
    expect(behavior.CompareBuyBehaviors).toStrictEqual([
      ...behavior.IndicatorCompareBuyBehaviors,
    ])
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
})

describe('#SellBehaviors', () => {
  test('contain all type of sell behaviors', () => {
    expect(behavior.PriceIncreaseSellBehaviors.length).toBe(5)
    expect(behavior.PriceDecreaseSellBehaviors.length).toBe(5)
    expect(behavior.FinancialImproveSellBehaviors.length).toBe(7)
    expect(behavior.FinancialWorsenSellBehaviors.length).toBe(7)
    expect(behavior.IndicatorIncreaseSellBehaviors.length).toBe(11)
    expect(behavior.IndicatorDecreaseSellBehaviors.length).toBe(11)
    expect(behavior.EconomyImproveSellBehaviors.length).toBe(3)
    expect(behavior.EconomyWorsenSellBehaviors.length).toBe(3)
    expect(behavior.TickerMovementSellBehaviors).toStrictEqual([
      ...behavior.PriceIncreaseSellBehaviors,
      ...behavior.PriceDecreaseSellBehaviors,
      ...behavior.FinancialImproveSellBehaviors,
      ...behavior.FinancialWorsenSellBehaviors,
    ])
    expect(behavior.IndicatorMovementSellBehaviors).toStrictEqual([
      ...behavior.IndicatorIncreaseSellBehaviors,
      ...behavior.IndicatorDecreaseSellBehaviors,
    ])
    expect(behavior.MovementSellBehaviors).toStrictEqual([
      ...behavior.TickerMovementSellBehaviors,
      ...behavior.IndicatorMovementSellBehaviors,
    ])
    expect(behavior.IndicatorCompareSellBehaviors).toStrictEqual([
      ...behavior.EconomyImproveSellBehaviors,
      ...behavior.EconomyWorsenSellBehaviors,
    ])
    expect(behavior.CompareSellBehaviors).toStrictEqual([
      ...behavior.IndicatorCompareSellBehaviors,
    ])
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
})

describe('#Other Behaviors', () => {
  test('contain other behaviors', () => {
    expect(behavior.AllocateBehaviors.length).toBe(5)
    expect(behavior.FrequencyBehaviors.length).toBe(2)
    expect(behavior.PreferenceBehaviors.length).toBe(2)
  })
})

describe('#Behaviors', () => {
  test('contain All Behaviors', () => {
    expect(behavior.Behaviors).toStrictEqual([
      ...behavior.BuyBehaviors,
      ...behavior.SellBehaviors,
      ...behavior.AllocateBehaviors,
      ...behavior.FrequencyBehaviors,
      ...behavior.PreferenceBehaviors,
    ])
  })
})
