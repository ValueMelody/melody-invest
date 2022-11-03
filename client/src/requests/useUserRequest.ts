import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import { context, Context } from 'context'
import * as requestAdapter from 'adapters/request'
import * as storageAdapter from 'adapters/storage'
import * as routerEnum from 'enums/router'
import * as commonEnum from 'enums/common'
import * as routerTool from 'tools/router'
import * as localeTool from 'tools/locale'
import { useDispatch } from 'react-redux'
import { userSlice } from 'stores/user'

const useUserRequest = () => {
  const store: Context = useContext(context)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  // ------------------------------------------------------------ Store --

  const storeUserToken = (userToken: interfaces.response.UserToken) => {
    const { jwtToken } = userToken
    requestAdapter.setAuthToken(jwtToken)
    storageAdapter.set(commonEnum.StorageKey.AuthToken, jwtToken)
    store.setResources((resources) => ({
      ...resources,
      hasLogin: true,
    }))
    dispatch(userSlice.actions.updateUserLoginState(true))
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

  return {
    createUser,
    createUserSubscription,
    activateUser,
  }
}

export default useUserRequest
