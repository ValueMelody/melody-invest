import { TraderProfileBase } from 'stores/traderProfile'

const selectTraderProfileBaseDict = () => (
  state: AppState,
): TraderProfileBase => {
  return state.traderProfile.base
}

const selectSystemTopTraders = () => (
  state: AppState,
): TopTraderProfileIds | undefined => {
  return state.traderProfile.systemTops
}

export {
  selectTraderProfileBaseDict,
  selectSystemTopTraders,
}
