import * as interfaces from '@shared/interfaces'
import { instance, mock, when } from 'ts-mockito'
import * as tickerIdentity from './tickerIdentity'

const type = mock<AppState>({})

const tickerType = mock<interfaces.tickerModel.Record>({})
const ticker1 = {
  ...instance(tickerType),
  symbol: 'A',
}
const ticker2 = {
  ...instance(tickerType),
  symbol: 'C',
}
const ticker3 = {
  ...instance(tickerType),
  symbol: 'B',
}

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

const identity = {
  base: {
    1: ticker1,
    2: ticker2,
    3: ticker3,
  },
  detail: {
    '1-1': detail1,
    '1-2': detail2,
    '2-3': detail3,
  },
}

when(type.tickerIdentity).thenReturn(identity)
const stateInstance = instance(type)

describe('#selectTickerIdentityBaseDict', () => {
  test('could select ticker identity base dict', () => {
    expect(tickerIdentity.selectTickerIdentityBaseDict()(stateInstance)).toStrictEqual(identity.base)
  })
})

describe('#selectTickerIdentityBases', () => {
  test('could select ticker identity bases', () => {
    expect(tickerIdentity.selectTickerIdentityBases()(stateInstance)).toStrictEqual([
      ticker1, ticker3, ticker2,
    ])
  })
})

describe('#selectTickerIdentityBaseById', () => {
  test('could select ticker identity base by id', () => {
    expect(tickerIdentity.selectTickerIdentityBaseById(1)(stateInstance)).toStrictEqual(ticker1)
    expect(tickerIdentity.selectTickerIdentityBaseById(2)(stateInstance)).toStrictEqual(ticker2)
    expect(tickerIdentity.selectTickerIdentityBaseById(undefined)(stateInstance)).toBeUndefined()
  })
})
