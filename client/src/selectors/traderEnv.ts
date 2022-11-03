import * as interfaces from '@shared/interfaces'
import { TraderEnvBase } from 'stores/traderEnv'

const selectTraderEnvBaseDict = () => (
  state: AppState,
): TraderEnvBase => {
  return state.traderEnv.base
}

const selectTraderEnvBases = () => (
  state: AppState,
): interfaces.traderEnvModel.Record[] => {
  return Object.values(state.traderEnv.base)
}

const selectTraderEnvBaseById = (id?: number) => (
  state: AppState,
): interfaces.traderEnvModel.Record | undefined => {
  if (!id) return undefined
  const env = state.traderEnv.base[id]
  return env
}

const selectTraderEnvDetailById = (id?: number) => (
  state: AppState,
): { topProfiles: TopTraderProfileIds } | undefined => {
  if (!id) return undefined
  const detail = state.traderEnv.detail[id]
  return detail
}

export {
  selectTraderEnvBaseDict,
  selectTraderEnvBases,
  selectTraderEnvBaseById,
  selectTraderEnvDetailById,
}
