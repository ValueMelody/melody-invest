import * as context from './context'
import * as vendorTool from '../tools/vendor'
import * as storageAdapter from '../adapters/storage'
import * as requestAdapter from '../adapters/request'

const userType = storageAdapter.get(storageAdapter.KEYS.USER_TYPE)
const currentUserType = userType ? parseInt(userType) : 0
const jwtToken = storageAdapter.get(storageAdapter.KEYS.JWT_TOKEN)
if (jwtToken) requestAdapter.setJWTToken(jwtToken)

const useStore = () => {
  const [common, setCommon] = vendorTool.react.useState<context.Common>({
    isLoading: false,
    messages: [],
  })

  const [resources, setResources] = vendorTool.react.useState<context.Resources>({
    tickerIdentities: {},
    tickerCategories: {},
    userTraderIds: currentUserType ? null : [],
    userTraderEnvs: [],
    userTraderCombos: [],
    userType: currentUserType,
    userEmail: '',
  })

  const [profileDetails, setProfileDetails] = vendorTool.react.useState<context.ProfileDetails>({})

  const [behaviorDetails, setBehaviorDetails] = vendorTool.react.useState<context.BehaviorDetails>({})

  const [tickerDetails, setTickerDetails] = vendorTool.react.useState<context.TickerDetails>({})

  const [topProfiles, setTopProfiles] = vendorTool.react.useState<context.TopProfiles>({})

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
    profileDetails,
    setProfileDetails,
    behaviorDetails,
    setBehaviorDetails,
    tickerDetails,
    setTickerDetails,
    topProfiles,
    setTopProfiles,
  }
}

export default useStore
