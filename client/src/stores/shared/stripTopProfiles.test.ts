import * as interfaces from '@shared/interfaces'
import stripTopProfiles from './stripTopProfiles'

describe('#stripTopProfiles', () => {
  test('could stripTopProfiles', () => {
    const topProfiles: interfaces.response.TopTraderProfiles = {
      yearly: [
        // @ts-ignore
        { trader: { id: 1 } },
        // @ts-ignore
        { trader: { id: 3 } },
        // @ts-ignore
        { trader: { id: 5 } },
      ],
      pastYear: [
        // @ts-ignore
        { trader: { id: 1 } },
      ],
      pastQuarter: [
        // @ts-ignore
        { trader: { id: 1 } },
        // @ts-ignore
        { trader: { id: 2 } },
      ],
      pastWeek: [
        // @ts-ignore
        { trader: { id: 3 } },
      ],
      pastMonth: [
        // @ts-ignore
        { trader: { id: 3 } },
        // @ts-ignore
        { trader: { id: 4 } },
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
