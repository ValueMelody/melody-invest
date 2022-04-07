import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'
import * as requestAdapter from '../adapters/request'
import * as routerEnum from '../enums/router'
import * as parseTool from '../tools/parse'

const useSystemState = () => {
  const store: Context = useContext(context)

  // ------------------------------------------------------------ store --

  const storeSystemDefaults = (systemDefaults: interfaces.systemRes.Defaults) => {
    const parsedEnvs = systemDefaults.traderEnvs.map((env) => ({
      ...env,
      name: parseTool.traderEnvName(env),
    }))
    const userTraderEnvs = [
      ...store.resources.userTraderEnvs,
      ...parsedEnvs,
    ]
    const parsedCombos = systemDefaults.traderCombos.map((combo) => ({
      ...combo,
      name: parseTool.traderComboName(combo),
    }))
    const userTraderCombos = [
      ...store.resources.userTraderCombos,
      ...parsedCombos,
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
      console.log(defaults.traderCombos)
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
