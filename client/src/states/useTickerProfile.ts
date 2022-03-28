import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'
import * as requestAdapter from '../adapters/request'
import * as routerEnum from '../enums/router'

const useTickerProfile = () => {
  const store: Context = useContext(context)

  const storeTickerIdentities = (identites: interfaces.tickerProfileRes.TickerIdentity[]) => {
    const identitesMap = identites.reduce((identitesMap, identity) => {
      return {
        ...identitesMap,
        [identity.id]: identity,
      }
    }, {})
    store.setResources((resources) => ({ ...resources, tickerIdentities: identitesMap }))
  }

  const fetchTickerIdentities = async () => {
    const endpoint = `${routerEnum.API.TICKER_PROFILES}/identities`
    store.startLoading()
    try {
      const identitites = await requestAdapter.sendGetRequest(endpoint)
      storeTickerIdentities(identitites)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  return {
    tickerIdentities: store.resources.tickerIdentities,
    fetchTickerIdentities,
  }
}

export default useTickerProfile
