import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'

const useTickerState = () => {
  const store: Context = useContext(context)

  // ------------------------------------------------------------ Get --

  const getTickerIdentity = (
    tickerId: number,
  ): interfaces.tickerModel.Identity | null => {
    const identities = store.resources.tickerIdentities || {}
    if (!identities[tickerId]) return null
    return identities[tickerId]
  }

  const getTickerIdentities = (): interfaces.tickerModel.Identity[] => {
    return Object.values(store.resources.tickerIdentities || {})
  }

  // ------------------------------------------------------------ export --

  return {
    getTickerIdentity,
    getTickerIdentities,
  }
}

export default useTickerState
