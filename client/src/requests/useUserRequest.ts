import * as interfaces from '@shared/interfaces'
import { context, Context } from 'context'
import * as requestAdapter from 'adapters/request'
import * as storageAdapter from 'adapters/storage'
import * as routerEnum from 'enums/router'
import * as commonEnum from 'enums/common'
import * as vendorTool from 'tools/vendor'
import * as routerTool from 'tools/router'
import * as localeTool from 'tools/locale'
import groupTraderProfiles from './shared/groupTraderProfiles'

const useUserRequest = () => {
  const store: Context = vendorTool.react.useContext(context)
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ Store --

  const storeUserToken = (userToken: interfaces.response.UserToken) => {
    const { jwtToken } = userToken
    requestAdapter.setAuthToken(jwtToken)
    storageAdapter.set(commonEnum.StorageKey.AuthToken, jwtToken)
    store.setResources((resources) => ({
      ...resources,
      hasLogin: true,
    }))
  }

  const storeUserOverall = (overall: interfaces.response.UserOverall) => {
    const {
      traderProfiles: profiles,
      traderEnvs: envs,
      traderCombos: combos,
      email,
      type,
      planStartAtUTC,
      planEndAtUTC,
    } = overall

    const traderIds = profiles.map((profile) => profile.trader.id)

    store.setResources((resources) => ({
      ...resources,
      userEmail: email,
      userType: type,
      userTraderIds: traderIds,
      planStartAtUTC,
      planEndAtUTC,
    }))

    const traderCombos = combos.reduce((combos, combo) => ({
      ...combos,
      [combo.id]: { identity: combo },
    }), {})
    store.setTraderCombos((combos) => ({ ...combos, ...traderCombos }))

    const traderEnvs = envs.reduce((envs, env) => ({
      ...envs,
      [env.id]: { record: env },
    }), {})
    store.setTraderEnvs((envs) => ({ ...envs, ...traderEnvs }))

    const traderProfiles = groupTraderProfiles(profiles)
    store.setTraderProfiles((profiles) => ({ ...profiles, ...traderProfiles }))
  }

  // ------------------------------------------------------------ Fetch --

  const fetchUserOverall = async () => {
    const endpoint = `${routerEnum.Endpoint.Users}/overall`
    store.startLoading()
    try {
      const overall = await requestAdapter.sendGetRequest(endpoint)
      storeUserOverall(overall)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ Create --

  const createUser = async (
    email: string,
    password: string,
    isConfirmed: boolean,
  ) => {
    const endpoint = `${routerEnum.Endpoint.Users}`
    store.startLoading()
    try {
      await requestAdapter.sendPostRequest(endpoint, {
        email,
        password,
        isConfirmed,
      })
      navigate(routerTool.signInRoute())
      store.addMessage({
        id: Math.random(),
        type: 'success',
        title: localeTool.t('signUp.success'),
      })
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const createUserSubscription = async (
    subscriptionId: string,
    planType: number,
  ) => {
    const endpoint = `${routerEnum.Endpoint.Users}/subscription`
    store.startLoading()
    try {
      const userToken = await requestAdapter.sendPostRequest(endpoint, {
        subscriptionId,
      })
      storeUserToken(userToken)

      store.addMessage({
        id: Math.random(),
        type: 'success',
        title: localeTool.t('setting.subscribeSucceed'),
      })
      store.setResources((resource) => ({
        ...resource,
        userType: planType,
      }))
    } catch (e) {
      store.showRequestError({
        message: localeTool.t('setting.subscribeFailed', {
          email: commonEnum.Env.ContactEmail,
        }),
      })
    } finally {
      store.stopLoading()
    }
  }

  const createUserToken = async (
    email: string,
    password: string,
    shouldRemember: boolean,
  ) => {
    const endpoint = `${routerEnum.Endpoint.Users}/token`
    store.startLoading()
    try {
      const userToken = await requestAdapter.sendPostRequest(endpoint, {
        email,
        password,
        remember: shouldRemember,
      })
      storeUserToken(userToken)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const createResetEmail = async (
    email: string,
  ) => {
    const endpoint = `${routerEnum.Endpoint.Users}/reset`
    store.startLoading()
    try {
      await requestAdapter.sendPostRequest(endpoint, { email })
      navigate(routerTool.signInRoute())
      store.addMessage({
        id: Math.random(),
        type: 'success',
        title: localeTool.t('reset.emailSent'),
      })
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ Update --

  const activateUser = async (
    token: string,
  ) => {
    const endpoint = `${routerEnum.Endpoint.Users}/activate`
    store.startLoading()
    try {
      await requestAdapter.sendPutRequest(endpoint, { token })
      navigate(routerTool.signInRoute())
      store.addMessage({
        id: Math.random(),
        type: 'success',
        title: localeTool.t('activate.success'),
      })
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const updateUserPassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    const endpoint = `${routerEnum.Endpoint.Users}/password`
    store.startLoading()
    try {
      await requestAdapter.sendPutRequest(endpoint, {
        currentPassword, newPassword,
      })
      store.addMessage({
        id: Math.random(),
        type: 'success',
        title: localeTool.t('common.passwordUpdated'),
      })
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const resetUserPassword = async (
    email: string,
    password: string,
    resetCode: string,
  ) => {
    const endpoint = `${routerEnum.Endpoint.Users}/reset`
    store.startLoading()
    try {
      await requestAdapter.sendPutRequest(endpoint, {
        email, password, resetCode,
      })
      store.addMessage({
        id: Math.random(),
        type: 'success',
        title: localeTool.t('common.passwordUpdated'),
      })
      navigate(routerTool.signInRoute())
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const lockUserAccount = async () => {
    const endpoint = `${routerEnum.Endpoint.Users}/lock`
    store.startLoading()
    try {
      await requestAdapter.sendPutRequest(endpoint)
      store.cleanUserState()
      store.addMessage({
        id: Math.random(),
        type: 'success',
        title: localeTool.t('setting.lockAccessSuccess'),
      })
      navigate(routerTool.signInRoute())
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ Delete --

  const cancelUserSubscription = async () => {
    const endpoint = `${routerEnum.Endpoint.Users}/subscription`
    store.startLoading()
    try {
      await requestAdapter.sendDeleteRequest(endpoint)

      store.addMessage({
        id: Math.random(),
        type: 'success',
        title: localeTool.t('setting.unsubscribeSuccess'),
      })
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ Export --

  return {
    fetchUserOverall,
    createUser,
    createUserToken,
    createUserSubscription,
    createResetEmail,
    activateUser,
    updateUserPassword,
    resetUserPassword,
    lockUserAccount,
    cancelUserSubscription,
  }
}

export default useUserRequest
