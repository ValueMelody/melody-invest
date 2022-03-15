import { useState } from 'react'
import * as context from './context'

const useStore = () => {
  const [common, setCommon] = useState<context.Common>({
    isLoading: false,
    messages: [],
  })

  const startLoading = () => {
    setCommon((state) => ({ ...state, isLoading: true }))
  }

  const stopLoading = () => {
    setCommon((state) => ({ ...state, isLoading: false }))
  }

  const addMessage = (message: context.Message) => {
    setCommon((state) => {
      const messages = [...state.messages, message]
      return { ...state, messages }
    })
  }

  const removeMessage = (id: number) => {
    setCommon((state) => {
      const messages = state.messages.filter((message) => message.id !== id)
      return { ...state, messages }
    })
  }

  const clearMessages = () => {
    setCommon((state) => ({ ...state, messages: [] }))
  }

  const showRequestError = (message?: string) => {
    if (!message) return
    addMessage({
      id: Math.random(),
      title: message,
      type: 'error',
    })
  }

  const [resources, setResources] = useState<context.Resources>({
    topProfiles: null,
    tickerIdentities: null,
  })

  const [traderProfiles, setTraderProfiles] = useState<context.TraderProfiles>({})

  const [profileHoldings, setProfileHoldings] = useState<context.ProfileHoldings>({})

  return {
    common,
    startLoading,
    stopLoading,
    addMessage,
    removeMessage,
    clearMessages,
    showRequestError,
    resources,
    setResources,
    traderProfiles,
    setTraderProfiles,
    profileHoldings,
    setProfileHoldings,
  }
}

export default useStore
