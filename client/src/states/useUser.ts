import { useContext } from 'react'
import { context, Context } from './context'
import * as requestAdpater from '../adapters/request'
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

  const getUserToken = (email: string, password: string) => {

  }

  return {
    postUser,
    getUserToken,
  }
}

export default useUser
