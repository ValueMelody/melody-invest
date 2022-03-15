import { useState } from 'react'
import * as context from './context'
import * as storageAdpater from '../adapters/storage'

const token = storageAdpater.get(storageAdpater.KEYS.JWT_TOKEN)

const useStore = () => {
  const [common, setCommon] = useState<context.Common>({
    jwtToken: token || '',
    isLoading: false,
    messages: [],
  })

  const saveJWTToken = (token: string) => {
    setCommon((state) => ({ ...state, jwtToken: token }))
  }

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
    saveJWTToken,
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
