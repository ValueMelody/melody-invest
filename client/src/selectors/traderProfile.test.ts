import * as interfaces from '@shared/interfaces'
import { instance, mock, when } from 'ts-mockito'
import * as traderProfile from './traderProfile'

const type = mock<AppState>({})

const profileType = mock<interfaces.response.TraderProfile>({})
const profile1 = {
  ...instance(profileType),
}
const profile2 = {
  ...instance(profileType),
}
const profile3 = {
  ...instance(profileType),
}

const detailType = mock<interfaces.response.ProfileDetail>({})
const detail1 = instance(detailType)
const detail2 = instance(detailType)
const detail3 = instance(detailType)

const trader = {
  base: {
    1: profile1,
    2: profile2,
    3: profile3,
  },
  detail: {
    1: detail1,
    2: detail2,
    3: detail3,
  },
}

when(type.traderProfile).thenReturn(trader)
const stateInstance = instance(type)

describe('#selectTraderProfileBaseDict', () => {
  test('could select trader profile base dict', () => {
    expect(traderProfile.selectTraderProfileBaseDict()(stateInstance)).toStrictEqual(trader.base)
  })
})

describe('#selectTraderProfileBaseById', () => {
  test('could select trader profile base by id', () => {
    expect(traderProfile.selectTraderProfileBaseById(1)(stateInstance)).toStrictEqual(profile1)
    expect(traderProfile.selectTraderProfileBaseById(3)(stateInstance)).toStrictEqual(profile3)
    expect(traderProfile.selectTraderProfileBaseById(undefined)(stateInstance)).toBeUndefined()
  })
})

describe('#selectTraderProfileDetailById', () => {
  test('could select trader profile detail by id', () => {
    expect(traderProfile.selectTraderProfileDetailById(1)(stateInstance)).toStrictEqual(detail1)
    expect(traderProfile.selectTraderProfileDetailById(3)(stateInstance)).toStrictEqual(detail3)
    expect(traderProfile.selectTraderProfileDetailById(undefined)(stateInstance)).toBeUndefined()
  })
})
