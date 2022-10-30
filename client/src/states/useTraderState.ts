import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context, TraderCombo } from 'context'

const useTraderState = () => {
  const store: Context = useContext(context)

  // ------------------------------------------------------------ Get --

  const getTraderCombos = (): TraderCombo[] => {
    return Object.values(store.traderCombos)
  }

  const getTraderCombo = (comboId: number | null) => {
    if (comboId === null) return null
    return store.traderCombos[comboId] || null
  }

  const getTraderBehavior = (
    traderEnvId: number | null,
    behavior: interfaces.traderPatternModel.Behavior | null,
  ) => {
    if (!traderEnvId || !behavior) return null
    return store.traderBehaviors[`${traderEnvId}-${behavior}`] || null
  }

  const getTraderTicker = (
    traderEnvId: number | null,
    tickerId: number | null | undefined,
  ) => {
    if (!traderEnvId || !tickerId) return null
    return store.traderTickers[`${traderEnvId}-${tickerId}`] || null
  }

  const getTraderProfile = (traderId: number | null | undefined) => {
    if (!traderId) return null
    return store.traderProfiles[traderId] || null
  }

  // ------------------------------------------------------------ Export --

  return {
    getTraderCombos,
    getTraderCombo,
    getTraderBehavior,
    getTraderTicker,
    getTraderProfile,
  }
}

export default useTraderState
