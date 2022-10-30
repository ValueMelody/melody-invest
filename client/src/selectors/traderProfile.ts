import { TraderProfileBase } from 'stores/traderProfile'

const selectTraderProfileBaseDict = () => (
  state: AppState,
): TraderProfileBase => {
  return state.traderProfile.base
}

export {
  selectTraderProfileBaseDict,
}
