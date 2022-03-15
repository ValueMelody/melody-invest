import { useContext } from 'react'
import { context, Context } from './context'
import * as requestAdpater from '../adapters/request'
import * as routerConstant from '../constants/router'

const useUser = () => {
  const store: Context = useContext(context)

  const postUser = async (email: string, password: string, isConfirmed: boolean) => {
    const endpoint = `${routerConstant.API.USERS}`
    store.startLoading()
    const user = await requestAdpater.sendPostRequest(endpoint, {
      email,
      password,
      isConfirmed,
    })
    console.log(user)
    store.stopLoading()
    return user
  }

  return {
    postUser,
  }
}

export default useUser
