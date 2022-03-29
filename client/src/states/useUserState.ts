import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'
import * as requestAdapter from '../adapters/request'
import * as storageAdapter from '../adapters/storage'
import * as localeTool from '../tools/locale'
import * as routerEnum from '../enums/router'

const useUserState = () => {
  const store: Context = useContext(context)

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

  const storeUserToken = (userToken: interfaces.userRes.UserToken) => {
    const { jwtToken, userType } = userToken
    requestAdapter.setJWTToken(jwtToken)
    storageAdapter.set(storageAdapter.KEYS.JWT_TOKEN, jwtToken)
    storageAdapter.set(storageAdapter.KEYS.USER_TYPE, userType.toString())
    store.loadUserType(userType)
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

  const storeUserOverall = (overall: interfaces.userRes.UserOverall) => {
    const { traderProfiles: profiles, email } = overall
    const traderIds = profiles.map((profile) => profile.trader.id)
    store.setResources((resources) => ({ ...resources, userTraderIds: traderIds }))
    const traderProfiles = profiles.reduce((traderProfiles, profile) => {
      return { ...traderProfiles, [profile.trader.id]: profile }
    }, {})
    store.setTraderProfiles((profiles) => ({ ...profiles, ...traderProfiles }))
    store.setResources((resources) => ({ ...resources, userEmail: email }))
  }

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

  const storeCreatedFollowed = (traderId: number) => {
    const traderIds = store.resources.userTraderIds || []
    const updatedTraderIds = [...traderIds, traderId]
    store.setResources((resources) => ({ ...resources, userTraderIds: updatedTraderIds }))
  }

  const createUserFollowed = async (traderId: number) => {
    const endpoint = `${routerEnum.API.USERS}/traders/${traderId}`
    store.startLoading()
    try {
      await requestAdapter.sendPostRequest(endpoint)
      storeCreatedFollowed(traderId)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  const storeDeletedFollowed = (traderId: number) => {
    const traderIds = store.resources.userTraderIds || []
    const remainingTraderIds = traderIds.filter((id) => id !== traderId)
    store.setResources((resources) => ({ ...resources, userTraderIds: remainingTraderIds }))
  }

  const deleteUserFollowed = async (traderId: number) => {
    const endpoint = `${routerEnum.API.USERS}/traders/${traderId}`
    store.startLoading()
    try {
      await requestAdapter.sendDeleteRequest(endpoint)
      storeDeletedFollowed(traderId)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

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

  return {
    fetchUserOverall,
    createUser,
    createUserToken,
    createUserFollowed,
    updateUserPassword,
    deleteUserFollowed,
    userTraderIds: store.resources.userTraderIds,
    userType: store.resources.userType,
    userEmail: store.resources.userEmail,
  }
}

export default useUserState
