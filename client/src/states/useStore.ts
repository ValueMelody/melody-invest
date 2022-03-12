import { useState } from 'react'
import * as context from './context'

const useStore = () => {
  const [common, setCommon] = useState<context.Common>({
    isLoading: false,
  })

  const startLoading = () => {
    setCommon((state) => ({ ...state, isLoading: true }))
  }

  const stopLoading = () => {
    setCommon((state) => ({ ...state, isLoading: false }))
  }

  const [resources, setResources] = useState<context.Resources>({
    topProfiles: null,
  })

  const [traderProfiles, setTraderProfiles] = useState<context.TraderProfiles>({})

  const [profileHoldings, setProfileHoldings] = useState<context.ProfileHoldings>({})

  return {
    common,
    startLoading,
    stopLoading,
    resources,
    setResources,
    traderProfiles,
    setTraderProfiles,
    profileHoldings,
    setProfileHoldings,
  }
}

export default useStore
