import * as interfaces from '@shared/interfaces'

export const _updateForTest = (
  state: any,
  action: any,
) => {
  Object.keys(action.payload).forEach((key) => {
    state[key] = action.payload[key]
  })
}

export const _resetForTest = (
  state: any,
  initState: any,
) => {
  Object.keys(initState).forEach((key) => {
    state[key] = initState[key]
  })
}

export const stripTopProfiles = (topProfiles: interfaces.response.TopTraderProfiles) => {
  return {
    yearly: topProfiles.yearly.map((profile) => profile.trader.id),
    pastYear: topProfiles.pastYear.map((profile) => profile.trader.id),
    pastQuarter: topProfiles.pastQuarter.map((profile) => profile.trader.id),
    pastMonth: topProfiles.pastMonth.map((profile) => profile.trader.id),
    pastWeek: topProfiles.pastWeek.map((profile) => profile.trader.id),
  }
}
