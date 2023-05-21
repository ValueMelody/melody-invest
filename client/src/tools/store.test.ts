import * as interfaces from '@shared/interfaces'
import { instance, mock } from 'ts-mockito'
import { stripTopProfiles } from './store'

describe('#stripTopProfiles', () => {
  test('could stripTopProfiles', () => {
    const traderMock: interfaces.traderModel.Record = mock({})
    const trader1 = { ...traderMock, id: 1 }
    const trader2 = { ...traderMock, id: 2 }
    const trader3 = { ...traderMock, id: 3 }
    const trader4 = { ...traderMock, id: 4 }
    const trader5 = { ...traderMock, id: 5 }

    const patternMock: interfaces.traderPatternModel.Record = mock({})
    const pattern = instance(patternMock)

    const topProfiles: interfaces.response.TopTraderProfiles = {
      yearly: [
        { trader: trader1, pattern },
        { trader: trader3, pattern },
        { trader: trader5, pattern },
      ],
      pastYear: [
        { trader: trader1, pattern },
      ],
      pastQuarter: [
        { trader: trader1, pattern },
        { trader: trader2, pattern },
      ],
      pastWeek: [
        { trader: trader3, pattern },
      ],
      pastMonth: [
        { trader: trader3, pattern },
        { trader: trader4, pattern },
      ],
    }
    const result = stripTopProfiles(topProfiles)
    expect(result).toStrictEqual({
      yearly: [1, 3, 5],
      pastYear: [1],
      pastQuarter: [1, 2],
      pastWeek: [3],
      pastMonth: [3, 4],
    })
  })
})
