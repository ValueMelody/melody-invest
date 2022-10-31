import { useContext } from 'react'
import { context, Context } from 'context'

const useTraderState = () => {
  const store: Context = useContext(context)

  // ------------------------------------------------------------ Get --

  const getTraderProfile = (traderId: number | null | undefined) => {
    if (!traderId) return null
    return store.traderProfiles[traderId] || null
  }

  // ------------------------------------------------------------ Export --

  return {
    getTraderProfile,
  }
}

export default useTraderState
