import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { store, Context } from './context'
import * as requestAdpater from '../adapters/request'
import * as routerConstant from '../constants/router'

const useTraderProfile = () => {
  const context: Context = useContext(store)

  const getTraderProfile = (id: number | null) => {
    if (!id) return null
    return context.traderProfiles[id] || null
  }

  const storeTraderProfile = (profile: interfaces.traderProfileRes.TraderProfile) => {
    context.setTraderProfiles((profiles) => ({ ...profiles, [profile.trader.id]: profile }))
  }

  const fetchTraderProfile = async (id: number, accessCode: string) => {
    const endpoint = `${routerConstant.API.TRADER_PROFILES}/${id}/${accessCode}`
    context.startLoading()
    const profile = await requestAdpater.sendGetRequest(endpoint)
    storeTraderProfile(profile)
    context.stopLoading()
  }

  const storeTopProfiles = (topProfiles: interfaces.traderProfileRes.TopProfiles) => {
    context.setResources((resources) => ({ ...resources, topProfiles }))
    const profiles = [
      ...topProfiles.yearly,
      ...topProfiles.pastYear, ...topProfiles.pastQuarter,
      ...topProfiles.pastMonth, ...topProfiles.pastWeek,
    ]
    const traderProfiles = profiles.reduce((traderProfiles, profile) => {
      return { ...traderProfiles, [profile.trader.id]: profile }
    }, {})
    context.setTraderProfiles((profiles) => ({ ...profiles, ...traderProfiles }))
  }

  const fetchTopProfiles = async () => {
    const endpoint = `${routerConstant.API.TRADER_PROFILES}/top`
    context.startLoading()
    const traders = await requestAdpater.sendGetRequest(endpoint)
    context.stopLoading()
    storeTopProfiles(traders)
  }

  return {
    getTraderProfile,
    fetchTraderProfile,
    topProfiles: context.resources.topProfiles,
    fetchTopProfiles,
  }
}

export default useTraderProfile
