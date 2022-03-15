import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'
import * as requestAdpater from '../adapters/request'
import * as routerConstant from '../constants/router'

const useTraderProfile = () => {
  const store: Context = useContext(context)

  const getTraderProfile = (id: number | null) => {
    if (!id) return null
    return store.traderProfiles[id] || null
  }

  const storeTraderProfile = (profile: interfaces.traderProfileRes.TraderProfile) => {
    store.setTraderProfiles((profiles) => ({ ...profiles, [profile.trader.id]: profile }))
  }

  const fetchTraderProfile = async (id: number, accessCode: string) => {
    const endpoint = `${routerConstant.API.TRADER_PROFILES}/${id}/${accessCode}`
    store.startLoading()
    try {
      const profile = await requestAdpater.sendGetRequest(endpoint)
      storeTraderProfile(profile)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  const storeTopProfiles = (topProfiles: interfaces.traderProfileRes.TopProfiles) => {
    store.setResources((resources) => ({ ...resources, topProfiles }))
    const profiles = [
      ...topProfiles.yearly,
      ...topProfiles.pastYear, ...topProfiles.pastQuarter,
      ...topProfiles.pastMonth, ...topProfiles.pastWeek,
    ]
    const traderProfiles = profiles.reduce((traderProfiles, profile) => {
      return { ...traderProfiles, [profile.trader.id]: profile }
    }, {})
    store.setTraderProfiles((profiles) => ({ ...profiles, ...traderProfiles }))
  }

  const fetchTopProfiles = async () => {
    const endpoint = `${routerConstant.API.TRADER_PROFILES}/tops`
    store.startLoading()
    try {
      const traders = await requestAdpater.sendGetRequest(endpoint)
      storeTopProfiles(traders)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  const getProfileHoldings = (id: number | null) => {
    if (!id) return null
    return store.profileHoldings[id] || null
  }

  const storeProfileHoldings = (
    traderId: number,
    holdings: interfaces.traderHoldingModel.Record[],
  ) => {
    store.setProfileHoldings((profiles) => ({ ...profiles, [traderId]: holdings }))
  }

  const fetchProfileHoldings = async (id: number, accessCode: string) => {
    const endpoint = `${routerConstant.API.TRADER_PROFILES}/${id}/${accessCode}/holdings`
    store.startLoading()
    try {
      const holdings = await requestAdpater.sendGetRequest(endpoint)
      storeProfileHoldings(id, holdings)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  return {
    getTraderProfile,
    fetchTraderProfile,
    getProfileHoldings,
    fetchProfileHoldings,
    topProfiles: store.resources.topProfiles,
    fetchTopProfiles,
  }
}

export default useTraderProfile
