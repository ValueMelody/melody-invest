import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context } from 'context'
import * as requestAdapter from 'adapters/request'
import * as routerEnum from 'enums/router'
import groupTraderProfiles from './shared/groupTraderProfiles'
import stripTopProfiles from './shared/stripTopProfiles'

const useSystemRequest = () => {
  const store: Context = useContext(context)

  // ------------------------------------------------------------ store --

  const storeTopTraderProfiles = (
    topProfiles: interfaces.response.TopTraderProfiles,
  ) => {
    const traderProfiles = groupTraderProfiles([
      ...topProfiles.yearly, ...topProfiles.pastYear, ...topProfiles.pastQuarter,
      ...topProfiles.pastMonth, ...topProfiles.pastWeek,
    ])
    store.setTraderProfiles((profiles) => ({ ...profiles, ...traderProfiles }))

    const tops = stripTopProfiles(topProfiles)
    store.setResources((resources) => ({
      ...resources,
      overallTopTraderProfiles: tops,
    }))
  }

  // ------------------------------------------------------------ fetch --

  const fetchOverallTopTraderProfiles = async () => {
    const endpoint = `${routerEnum.Endpoint.Systems}/top-trader-profiles`
    store.startLoading()
    try {
      const topProfiles = await requestAdapter.sendGetRequest(endpoint)
      storeTopTraderProfiles(topProfiles)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ export --

  return {
    fetchOverallTopTraderProfiles,
  }
}

export default useSystemRequest
