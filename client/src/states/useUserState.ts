import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import { context, Context } from './context'
import * as requestAdapter from '../adapters/request'
import * as storageAdapter from '../adapters/storage'
import * as vendorTool from '../tools/vendor'
import * as localeTool from '../tools/locale'
import * as routerTool from '../tools/router'
import * as routerEnum from '../enums/router'

const useUserState = () => {
  const store: Context = vendorTool.react.useContext(context)
  const navigate = vendorTool.router.useNavigate()

  // ------------------------------------------------------------ Get --
  const getUser = () => {
    return {
      userTraderIds: store.resources.userTraderIds,
      userTraderEnvs: store.resources.userTraderEnvs,
      comboProfiles: store.resources.comboProfiles,
      userType: store.resources.userType,
      userEmail: store.resources.userEmail,
    }
  }

  // ------------------------------------------------------------ store --

  const storeUserToken = (userToken: interfaces.response.UserToken) => {
    const { jwtToken, userType } = userToken
    requestAdapter.setJWTToken(jwtToken)
    storageAdapter.set(storageAdapter.Key.JWTToken, jwtToken)
    storageAdapter.set(storageAdapter.Key.UserType, userType.toString())
    store.loadUserType(userType)
  }

  const storeUserOverall = (overall: interfaces.response.UserOverall) => {
    const {
      traderProfiles: profiles,
      traderEnvs: envs,
      traderCombos: combos,
      email,
    } = overall

    const traderIds = profiles.map((profile) => profile.trader.id)

    const traderCombos = combos.map((combo) => ({
      identity: combo,
    }))

    store.setResources((resources) => ({
      ...resources,
      userEmail: email,
      userTraderIds: traderIds,
      userTraderEnvs: [...resources.userTraderEnvs, ...envs],
      comboProfiles: [...resources.comboProfiles, ...traderCombos],
    }))

    const traderProfiles = profiles.reduce((traderProfiles, profile) => {
      return {
        ...traderProfiles,
        [profile.trader.id]: {
          ...profile,
        },
      }
    }, {})
    store.setTraderProfiles((profiles) => ({ ...profiles, ...traderProfiles }))
  }

  // ------------------------------------------------------------ Remove --

  const removeUserToken = () => {
    store.setResources((resources) => ({
      ...resources,
      userType: constants.User.Type.Guest,
      userTraderIds: [],
      userTraderEnvs: resources.userTraderEnvs.filter((env) => env.isSystem),
      comboProfiles: resources.comboProfiles.filter((combo) => combo.identity.isSystem),
    }))
    requestAdapter.setJWTToken('')
    storageAdapter.remove(storageAdapter.Key.JWTToken)
    storageAdapter.remove(storageAdapter.Key.UserType)
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
        title: localeTool.t('common.signUpSuccess'),
      })
    } catch (e) {
      store.showRequestError(e)
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

  const createResetCode = async (
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
        title: localeTool.t('common.resetEmailSent'),
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
        title: localeTool.t('common.activationSuccess'),
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
      store.addMessage({ id: Math.random(), type: 'success', title: localeTool.t('common.passwordUpdated') })
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

  // ------------------------------------------------------------ export --

  return {
    removeUserToken,
    getUser,
    fetchUserOverall,
    createUser,
    createUserToken,
    createResetCode,
    activateUser,
    updateUserPassword,
    resetUserPassword,
  }
}

export default useUserState
