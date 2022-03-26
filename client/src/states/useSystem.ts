import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'
import * as requestAdapter from '../adapters/request'
import * as routerEnum from '../enums/router'

const useSystem = () => {
  const store: Context = useContext(context)

  const storeSystemDefaults = (systemDefaults: interfaces.systemRes.Defaults) => {
    const traderEnvs = systemDefaults.traderEnvs.reduce((envs, env) => {
      return { ...envs, [env.id]: env }
    }, {})
    store.setTraderEnvs((envs) => ({ ...envs, ...traderEnvs }))

    const systemTraderEnvIds = systemDefaults.traderEnvs.map((env) => env.id)
    store.setResources((resources) => ({ ...resources, systemTraderEnvIds }))
  }

  const fetchSystemDefaults = async () => {
    const endpoint = `${routerEnum.API.SYSTEMS}/defaults`
    store.startLoading()
    try {
      const defaults = await requestAdapter.sendGetRequest(endpoint)
      storeSystemDefaults(defaults)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  return {
    systemTraderEnvIds: store.resources.systemTraderEnvIds,
    fetchSystemDefaults,
  }
}

export default useSystem
