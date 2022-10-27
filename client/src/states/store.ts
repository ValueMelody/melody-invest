import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as constants from '@shared/constants'
import * as context from 'context'
import * as localeTool from 'tools/locale'
import * as routerTool from 'tools/router'
import * as commonEnum from 'enums/common'
import * as storageAdapter from 'adapters/storage'
import * as requestAdapter from 'adapters/request'

const useStore = (defaultState?: {
  initCommon?: context.Common;
  initResources?: context.Resources;
  initTraderEnvs?: context.TraderEnvs;
  initTraderCombos?: context.TraderCombos;
  initTraderProfiles?: context.TraderProfiles;
  initTraderBehaviors?: context.TraderBehaviors;
  initTraderTickers?: context.TraderTickers;
}) => {
  const {
    initCommon,
    initResources,
    initTraderEnvs,
    initTraderCombos,
    initTraderProfiles,
    initTraderBehaviors,
    initTraderTickers,
  } = defaultState || {}

  const navigate = useNavigate()

  const authToken = storageAdapter.get(commonEnum.StorageKey.AuthToken)

  const [common, setCommon] = useState<context.Common>(initCommon || {
    isLoading: false,
    messages: [],
    activeChartIndex: 0,
  })

  const [resources, setResources] = useState<context.Resources>(initResources || {
    tickerIdentities: {},
    tickerCategories: {},
    hasLogin: !!authToken,
    userTraderIds: [],
    userType: 0,
    userEmail: '',
    planStartAtUTC: null,
    planEndAtUTC: null,
    overallTopTraderProfiles: null,
    privacyPolicy: null,
    termsPolicy: null,
  })

  const [traderProfiles, setTraderProfiles] = useState<context.TraderProfiles>(
    initTraderProfiles || {},
  )

  const [traderBehaviors, setTraderBehaviors] = useState<context.TraderBehaviors>(
    initTraderBehaviors || {},
  )

  const [traderTickers, setTraderTickers] = useState<context.TraderTickers>(
    initTraderTickers || {},
  )

  const [traderEnvs, setTraderEnvs] = useState<context.TraderEnvs>(
    initTraderEnvs || {},
  )

  const [traderCombos, setTraderCombos] = useState<context.TraderCombos>(
    initTraderCombos || {},
  )

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

  const cleanUserState = () => {
    setResources((resources) => ({
      ...resources,
      hasLogin: false,
      userEmail: '',
      userType: constants.User.Type.Guest,
      userTraderIds: [],
      planStartAtUTC: null,
      planEndAtUTC: null,
    }))

    setTraderCombos((combos) => {
      const systemCombos = Object.values(combos).filter((combo: context.TraderCombo) => combo.identity.isSystem)
      const systemComboMap = systemCombos.reduce((comboMap, combo) => ({
        ...comboMap,
        [combo.identity.id]: combo,
      }), {})
      return systemComboMap
    })

    setTraderEnvs((envs) => {
      const systemEnvs = Object.values(envs).filter((env: context.TraderEnv) => env.record.isSystem)
      const systemEnvMap = systemEnvs.reduce((envMap, env) => ({
        ...envMap,
        [env.record.id]: env,
      }), {})
      return systemEnvMap
    })

    requestAdapter.setAuthToken('')
    storageAdapter.remove(commonEnum.StorageKey.AuthToken)
  }

  const showRequestError = (err: any) => {
    const message = err?.message || ''
    if (message) {
      addMessage({
        id: Math.random(),
        title: message,
        type: 'failure',
      })
    }
    if (message === localeTool.t('error.401')) {
      cleanUserState()
      const url = routerTool.signInRoute()
      navigate(url)
    }
  }

  return {
    // states
    common,
    setCommon,
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

    // helper functions
    startLoading,
    stopLoading,
    addMessage,
    removeMessage,
    cleanUserState,
    showRequestError,
  }
}

export default useStore
