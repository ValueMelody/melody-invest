import * as interfaces from '@shared/interfaces'
import { context, Context, TraderCombo, TraderEnv } from 'context'
import * as vendorTool from 'tools/vendor'

const useTraderState = () => {
  const store: Context = vendorTool.react.useContext(context)

  // ------------------------------------------------------------ Get --

  const getTraderCombos = (): TraderCombo[] => {
    return Object.values(store.traderCombos)
  }

  const getTraderCombo = (comboId: number | null) => {
    if (comboId === null) return null
    return store.traderCombos[comboId]
  }

  const getTraderEnvs = (): TraderEnv[] => {
    return Object.values(store.traderEnvs)
  }

  const getTraderEnv = (envId: number | null) => {
    if (envId === null) return null
    return store.traderEnvs[envId]
  }

  const getTraderBehavior = (
    traderEnvId: number | null,
    behavior: interfaces.traderPatternModel.Behavior | null,
  ) => {
    if (!traderEnvId || !behavior) return null
    return store.traderBehaviors[`${traderEnvId}-${behavior}`]
  }

  const getTraderTicker = (
    traderEnvId: number | null,
    tickerId: number | null,
  ) => {
    if (!traderEnvId || !tickerId) return null
    return store.traderTickers[`${traderEnvId}-${tickerId}`]
  }

  const getTraderProfile = (traderId: number | null) => {
    if (!traderId) return null
    return store.traderProfiles[traderId] || null
  }

  // ------------------------------------------------------------ Export --

  return {
    getTraderCombos,
    getTraderCombo,
    getTraderEnvs,
    getTraderEnv,
    getTraderBehavior,
    getTraderTicker,
    getTraderProfile,
  }
}

export default useTraderState
