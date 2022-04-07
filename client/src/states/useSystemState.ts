import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'
import * as requestAdapter from '../adapters/request'
import * as routerEnum from '../enums/router'

const useSystemState = () => {
  const store: Context = useContext(context)

  // ------------------------------------------------------------ store --

  const storeSystemDefaults = (systemDefaults: interfaces.systemRes.Defaults) => {
    const userTraderEnvs = [
      ...store.resources.userTraderEnvs,
      ...systemDefaults.traderEnvs,
    ]
    const userTraderCombos = [
      ...store.resources.userTraderCombos,
      ...systemDefaults.traderCombos,
    ]
    const tickerIdentities = systemDefaults.tickerIdentities.reduce((identities, identity) => ({
      ...identities,
      [identity.id]: identity,
    }), {})
    store.setResources((resources) => ({
      ...resources,
      userTraderEnvs,
      userTraderCombos,
      tickerIdentities,
    }))
  }

  // ------------------------------------------------------------ fetch --

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

  // ------------------------------------------------------------ export --

  return {
    fetchSystemDefaults,
  }
}

export default useSystemState
