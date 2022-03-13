import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'
import * as requestAdpater from '../adapters/request'
import * as routerConstant from '../constants/router'

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
    const endpoint = `${routerConstant.API.TICKER_PROFILES}/identities`
    store.startLoading()
    const identitites = await requestAdpater.sendGetRequest(endpoint)
    store.stopLoading()
    storeTickerIdentities(identitites)
  }

  return {
    tickerIdentities: store.resources.tickerIdentities,
    fetchTickerIdentities,
  }
}

export default useTickerProfile
