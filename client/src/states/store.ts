import * as context from '../context'
import * as vendorTool from '../tools/vendor'
import * as localeTool from '../tools/locale'
import * as routerTool from '../tools/router'
import * as storageAdapter from '../adapters/storage'
import * as requestAdapter from '../adapters/request'

const userType = storageAdapter.get(storageAdapter.Key.UserType)
const currentUserType = userType ? parseInt(userType) : 0
const jwtToken = storageAdapter.get(storageAdapter.Key.JWTToken)
if (jwtToken) requestAdapter.setJWTToken(jwtToken)

const useStore = () => {
  const navigate = vendorTool.router.useNavigate()

  const [common, setCommon] = vendorTool.react.useState<context.Common>({
    isLoading: false,
    messages: [],
    activeChartIndex: 0,
  })

  const [resources, setResources] = vendorTool.react.useState<context.Resources>({
    tickerIdentities: {},
    tickerCategories: {},
    userTraderIds: currentUserType ? null : [],
    userType: currentUserType,
    userEmail: '',
    planStartAtUTC: null,
    planEndAtUTC: null,
    overallTopTraderProfiles: null,
  })

  const [traderProfiles, setTraderProfiles] = vendorTool.react.useState<context.TraderProfiles>({})

  const [traderBehaviors, setTraderBehaviors] = vendorTool.react.useState<context.TraderBehaviors>({})

  const [traderTickers, setTraderTickers] = vendorTool.react.useState<context.TraderTickers>({})

  const [traderEnvs, setTraderEnvs] = vendorTool.react.useState<context.TraderEnvs>({})

  const [traderCombos, setTraderCombos] = vendorTool.react.useState<context.TraderCombos>({})

  const loadUserType = (type: number) => {
    setResources((state) => ({ ...state, userType: type }))
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

  const clearMessages = (options?: { onlyErrors: boolean }) => {
    setCommon((state) => ({
      ...state,
      messages: state.messages.filter((message) => {
        if (options?.onlyErrors) {
          return message.type === 'success'
        }
        return false
      }),
    }))
  }

  const showRequestError = (err: any) => {
    const message = err?.message || ''
    if (message) {
      addMessage({
        id: Math.random(),
        title: message,
        type: 'error',
      })
    }
    if (message === localeTool.t('error.401')) {
      setResources((resources) => ({
        ...resources,
        userType: 0,
      }))
      storageAdapter.remove(storageAdapter.Key.JWTToken)
      storageAdapter.remove(storageAdapter.Key.UserType)
      const url = routerTool.signInRoute()
      navigate(url)
    }
  }

  return {
    common,
    setCommon,
    loadUserType,
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
    traderBehaviors,
    setTraderBehaviors,
    traderTickers,
    setTraderTickers,
    traderEnvs,
    setTraderEnvs,
    traderCombos,
    setTraderCombos,
  }
}

export default useStore
