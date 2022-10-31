import { useContext } from 'react'
import { context, Context } from 'context'

const useTraderState = () => {
  const store: Context = useContext(context)

  // ------------------------------------------------------------ Get --

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
    getTraderTicker,
    getTraderProfile,
  }
}

export default useTraderState
