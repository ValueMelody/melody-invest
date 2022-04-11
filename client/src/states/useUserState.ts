import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'
import * as requestAdapter from '../adapters/request'
import * as storageAdapter from '../adapters/storage'
import * as vendorTool from '../tools/vendor'
import * as localeTool from '../tools/locale'
import * as routerEnum from '../enums/router'

const useUserState = () => {
  const store: Context = vendorTool.react.useContext(context)

  // ------------------------------------------------------------ Get --
  const getUser = () => {
    return {
      userTraderIds: store.resources.userTraderIds,
      userTraderEnvs: store.resources.userTraderEnvs,
      userTraderCombos: store.resources.userTraderCombos,
      userType: store.resources.userType,
      userEmail: store.resources.userEmail,
    }
  }

  // ------------------------------------------------------------ store --

  const storeUserToken = (userToken: interfaces.userRes.UserToken) => {
    const { jwtToken, userType } = userToken
    requestAdapter.setJWTToken(jwtToken)
    storageAdapter.set(storageAdapter.KEYS.JWT_TOKEN, jwtToken)
    storageAdapter.set(storageAdapter.KEYS.USER_TYPE, userType.toString())
    store.loadUserType(userType)
  }

  const storeUserOverall = (overall: interfaces.userRes.UserOverall) => {
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
      userTraderCombos: [...resources.userTraderCombos, ...traderCombos],
    }))

    const traderProfiles = profiles.reduce((traderProfiles, profile) => {
      return {
        ...traderProfiles,
        [profile.trader.id]: {
          ...profile,
        },
      }
    }, {})
    store.setProfileDetails((profiles) => ({ ...profiles, ...traderProfiles }))
  }

  // ------------------------------------------------------------ Fetch --

  const fetchUserOverall = async () => {
    const endpoint = `${routerEnum.API.USERS}/overall`
    store.startLoading()
    try {
      const overall = await requestAdapter.sendGetRequest(endpoint)
      storeUserOverall(overall)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ Create --

  const createUser = async (email: string, password: string, isConfirmed: boolean) => {
    const endpoint = `${routerEnum.API.USERS}`
    store.startLoading()
    try {
      const user = await requestAdapter.sendPostRequest(endpoint, {
        email,
        password,
        isConfirmed,
      })
      return user
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  const createUserToken = async (email: string, password: string, shouldRemember: boolean) => {
    const endpoint = `${routerEnum.API.USERS}/token`
    store.startLoading()
    try {
      const userToken = await requestAdapter.sendPostRequest(endpoint, {
        email,
        password,
        remember: shouldRemember,
      })
      storeUserToken(userToken)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ Update --

  const updateUserPassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    const endpoint = `${routerEnum.API.USERS}/password`
    store.startLoading()
    try {
      await requestAdapter.sendPutRequest(endpoint, {
        currentPassword, newPassword,
      })
      store.addMessage({ id: Math.random(), type: 'success', title: localeTool.t('setting.passwordUpdated') })
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ export --

  return {
    getUser,
    fetchUserOverall,
    createUser,
    createUserToken,
    updateUserPassword,
  }
}

export default useUserState
