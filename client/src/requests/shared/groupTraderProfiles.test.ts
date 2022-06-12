import * as interfaces from '@shared/interfaces'
import groupTraderProfiles from './groupTraderProfiles'

describe('#groupTraderProfiles', () => {
  test('could group trader profiles', () => {
    const traderProfiles: interfaces.response.TraderProfile[] = [
      // @ts-ignore
      { trader: { id: 1 } },
      // @ts-ignore
      { trader: { id: 3 } },
      // @ts-ignore
      { trader: { id: 5 } },
      // @ts-ignore
      { trader: { id: 6 } },
    ]
    const result = groupTraderProfiles(traderProfiles)
    expect(result).toStrictEqual({
      1: { trader: { id: 1 } },
      3: { trader: { id: 3 } },
      5: { trader: { id: 5 } },
      6: { trader: { id: 6 } },
    })
  })
})
