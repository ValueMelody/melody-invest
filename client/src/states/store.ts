import { useState } from 'react'
import * as context from './context'
import * as storageAdapter from '../adapters/storage'
import * as requestAdapter from '../adapters/request'

const userType = storageAdapter.get(storageAdapter.KEYS.USER_TYPE)
const currentUserType = userType ? parseInt(userType) : 0
const jwtToken = storageAdapter.get(storageAdapter.KEYS.JWT_TOKEN)
if (jwtToken) requestAdapter.setJWTToken(jwtToken)

const useStore = () => {
  const [common, setCommon] = useState<context.Common>({
    isLoading: false,
    messages: [],
  })

  const [resources, setResources] = useState<context.Resources>({
    topProfiles: null,
    tickerIdentities: null,
    userTraderIds: currentUserType ? null : [],
    userTraderEnvIds: [],
    userType: currentUserType,
    userEmail: '',
  })

  const [traderEnvs, setTraderEnvs] = useState<context.TraderEnvs>({})

  const [traderProfiles, setTraderProfiles] = useState<context.TraderProfiles>({})

  const [profileDetails, setProfileDetails] = useState<context.ProfileDetails>({})

  const loadUserType = (type: number) => {
    setCommon((state) => ({ ...state, userType: type }))
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

  return {
    common,
    loadUserType,
    startLoading,
    stopLoading,
    addMessage,
    removeMessage,
    clearMessages,
    showRequestError,
    resources,
    setResources,
    traderEnvs,
    setTraderEnvs,
    traderProfiles,
    setTraderProfiles,
    profileDetails,
    setProfileDetails,
  }
}

export default useStore
