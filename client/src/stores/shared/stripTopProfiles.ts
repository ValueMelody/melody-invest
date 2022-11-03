import * as interfaces from '@shared/interfaces'

const stripTopProfiles = (topProfiles: interfaces.response.TopTraderProfiles) => {
  return {
    yearly: topProfiles.yearly.map((profile) => profile.trader.id),
    pastYear: topProfiles.pastYear.map((profile) => profile.trader.id),
    pastQuarter: topProfiles.pastQuarter.map((profile) => profile.trader.id),
    pastMonth: topProfiles.pastMonth.map((profile) => profile.trader.id),
    pastWeek: topProfiles.pastWeek.map((profile) => profile.trader.id),
  }
}

export default stripTopProfiles
