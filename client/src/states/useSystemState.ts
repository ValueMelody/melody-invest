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
    const comboProfiles = systemDefaults.traderCombos.reduce((allProfiles, combo) => {
      const profiles = combo.profiles.reduce((containedProfiles, profile) => ({
        ...containedProfiles,
        [profile.trader.id]: profile,
      }), {})
      return {
        ...allProfiles,
        ...profiles,
      }
    }, {})
    store.setTraderProfiles((details) => ({ ...details, ...comboProfiles }))

    const parsedEnvs = systemDefaults.traderEnvs.map((env) => ({
      ...env,
      name: parseTool.traderEnvName(env),
    }))
    const parsedCombos = systemDefaults.traderCombos.map((combo) => ({
      identity: {
        ...combo.identity,
        name: parseTool.traderComboName(combo.identity),
      },
      holdings: combo.holdings,
      traderIds: combo.profiles.map((profile) => profile.trader.id),
    }))
    const tickerIdentities = systemDefaults.tickerIdentities.reduce((identities, identity) => ({
      ...identities,
      [identity.id]: identity,
    }), {})
    store.setResources((resources) => ({
      ...resources,
      tickerIdentities,
      userTraderEnvs: [
        ...resources.userTraderEnvs,
        ...parsedEnvs,
      ],
      userTraderCombos: [
        ...resources.userTraderCombos,
        ...parsedCombos,
      ],
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
