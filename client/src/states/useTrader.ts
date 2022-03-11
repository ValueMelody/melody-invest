import { useContext } from 'react'
import { store, Context } from './context'
import useCommon from './useCommon'
import * as requestAdpater from '../adapters/request'
import * as routerConstant from '../constants/router'

const useTrader = () => {
  const context: Context = useContext(store)
  const { startLoading, stopLoading } = useCommon()

  const getTrader = (id: number | null) => {
    if (!id) return null
    return context.traders[id] || null
  }

  const fetchTrader = async (id: number, accessCode: string) => {
    const endpoint = `${routerConstant.API.TRADERS}/${id}/${accessCode}`
    startLoading()
    const trader = await requestAdpater.sendGetRequest(endpoint)
    console.log(trader)
    stopLoading()
  }

  return {
    getTrader,
    fetchTrader,
  }
}

export default useTrader
