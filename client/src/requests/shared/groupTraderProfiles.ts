import * as interfaces from '@shared/interfaces'
import { TraderProfiles } from '../../context'

const groupTraderProfiles = (
  traderProfiles: interfaces.response.TraderProfile[],
): TraderProfiles => {
  return traderProfiles.reduce((containedProfiles, traderProfile) => ({
    ...containedProfiles,
    [traderProfile.trader.id]: traderProfile,
  }), {})
}

export default groupTraderProfiles
