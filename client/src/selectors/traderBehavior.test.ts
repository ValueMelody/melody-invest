import { instance, mock, when } from 'ts-mockito'
import * as traderBehavior from './traderBehavior'

const type = mock<AppState>({})

const topTraderProfiles = mock<TopTraderProfileIds>({})
const detail1 = {
  topProfiles: instance(topTraderProfiles),
}
const detail2 = {
  topProfiles: instance(topTraderProfiles),
}
const detail3 = {
  topProfiles: instance(topTraderProfiles),
}

const behavior = {
  detail: {
    '1-priceDailyIncreaseBuy': detail1,
    '2-priceDailyIncreaseBuy': detail2,
    '2-3': detail3,
  },
}

when(type.traderBehavior).thenReturn(behavior)
const stateInstance = instance(type)

describe('#selectTraderBehaviorDetail', () => {
  test('could select trader behavior detail', () => {
    expect(traderBehavior.selectTraderBehaviorDetail(1, 'priceDailyIncreaseBuy')(stateInstance)).toStrictEqual(detail1)
    expect(traderBehavior.selectTraderBehaviorDetail(2, 'priceDailyIncreaseBuy')(stateInstance)).toStrictEqual(detail2)
    expect(traderBehavior.selectTraderBehaviorDetail(0, 'priceDailyIncreaseBuy')(stateInstance)).toBeUndefined()
    expect(traderBehavior.selectTraderBehaviorDetail(2, undefined)(stateInstance)).toBeUndefined()
  })
})
