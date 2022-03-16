import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'
import * as requestAdpater from '../adapters/request'
import * as storageAdpater from '../adapters/storage'
import * as routerConstant from '../constants/router'

const useUser = () => {
  const store: Context = useContext(context)

  const postUser = async (email: string, password: string, isConfirmed: boolean) => {
    const endpoint = `${routerConstant.API.USERS}`
    store.startLoading()
    try {
      const user = await requestAdpater.sendPostRequest(endpoint, {
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
    storageAdpater.set(storageAdpater.KEYS.JWT_TOKEN, jwtToken)
    storageAdpater.set(storageAdpater.KEYS.USER_TYPE, userType.toString())
    store.loadUserType(userType)
  }

  const createUserToken = async (email: string, password: string, shouldRemember: boolean) => {
    const endpoint = `${routerConstant.API.USERS}/token`
    store.startLoading()
    try {
      const userToken = await requestAdpater.sendPostRequest(endpoint, {
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

  const fetchUserFollowed = async () => {
    const endpoint = `${routerConstant.API.USERS}/traders`
    store.startLoading()
    try {
      const traders = await requestAdpater.sendGetRequest(endpoint)
      console.log(traders)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  return {
    postUser,
    createUserToken,
    fetchUserFollowed,
    userTraderIds: store.resources.userTraderIds,
    userType: store.common.userType,
  }
}

export default useUser