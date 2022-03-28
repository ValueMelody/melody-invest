import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'
import * as requestAdapter from '../adapters/request'
import * as storageAdapter from '../adapters/storage'
import * as routerEnum from '../enums/router'

const useUser = () => {
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

  const storeUserFollowed = (profiles: interfaces.traderProfileRes.TraderProfile[]) => {
    const traderIds = profiles.map((profile) => profile.trader.id)
    store.setResources((resources) => ({ ...resources, userTraderIds: traderIds }))
    const traderProfiles = profiles.reduce((traderProfiles, profile) => {
      return { ...traderProfiles, [profile.trader.id]: profile }
    }, {})
    store.setTraderProfiles((profiles) => ({ ...profiles, ...traderProfiles }))
  }

  const fetchUserFollowed = async () => {
    const endpoint = `${routerEnum.API.USERS}/traders`
    store.startLoading()
    try {
      const profiles = await requestAdapter.sendGetRequest(endpoint)
      storeUserFollowed(profiles)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  const createFollowed = (traderId: number) => {
    const traderIds = store.resources.userTraderIds || []
    const updatedTraderIds = [...traderIds, traderId]
    store.setResources((resources) => ({ ...resources, userTraderIds: updatedTraderIds }))
  }

  const createUserFollowed = async (traderId: number) => {
    const endpoint = `${routerEnum.API.USERS}/traders/${traderId}`
    store.startLoading()
    try {
      await requestAdapter.sendPostRequest(endpoint)
      createFollowed(traderId)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  const deleteFollowed = (traderId: number) => {
    const traderIds = store.resources.userTraderIds || []
    const remainingTraderIds = traderIds.filter((id) => id !== traderId)
    store.setResources((resources) => ({ ...resources, userTraderIds: remainingTraderIds }))
  }

  const deleteUserFollowed = async (traderId: number) => {
    const endpoint = `${routerEnum.API.USERS}/traders/${traderId}`
    store.startLoading()
    try {
      await requestAdapter.sendDeleteRequest(endpoint)
      deleteFollowed(traderId)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  return {
    createUser,
    createUserToken,
    fetchUserFollowed,
    createUserFollowed,
    deleteUserFollowed,
    userTraderIds: store.resources.userTraderIds,
    userType: store.common.userType,
  }
}

export default useUser
