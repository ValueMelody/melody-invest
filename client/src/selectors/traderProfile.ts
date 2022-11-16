import * as interfaces from '@shared/interfaces'
import { TraderProfileBase } from 'stores/traderProfile'

const selectTraderProfileBaseDict = () => (
  state: AppState,
): TraderProfileBase => {
  return state.traderProfile.base
}

const selectTraderProfileBaseById = (id?: number) => (
  state: AppState,
): interfaces.response.TraderProfile | undefined => {
  if (!id) return undefined
  return state.traderProfile.base[id]
}

const selectTraderProfileDetailById = (id?: number) => (
  state: AppState,
): interfaces.response.ProfileDetail | undefined => {
  if (!id) return undefined
  return state.traderProfile.detail[id]
}

const selectSystemTopTraders = () => (
  state: AppState,
): TopTraderProfileIds | undefined => {
  return state.traderProfile.systemTops
}

export {
  selectTraderProfileBaseDict,
  selectTraderProfileBaseById,
  selectTraderProfileDetailById,
  selectSystemTopTraders,
}
