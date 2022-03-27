import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'
import * as requestAdpater from '../adapters/request'
import * as routerEnum from '../enums/router'

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
    const endpoint = `${routerEnum.API.TRADER_PROFILES}/${id}/${accessCode}`
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
    const endpoint = `${routerEnum.API.TRADER_PROFILES}/tops`
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

  const getProfileDetail = (id: number | null) => {
    if (!id) return null
    return store.profileDetails[id] || null
  }

  const storeProfileDetail = (
    traderId: number,
    detail: interfaces.traderProfileRes.ProfileDetail,
  ) => {
    store.setProfileDetails((details) => ({ ...details, [traderId]: detail }))
  }

  const fetchProfileDetail = async (id: number, accessCode: string) => {
    const endpoint = `${routerEnum.API.TRADER_PROFILES}/${id}/${accessCode}/detail`
    store.startLoading()
    try {
      const detail = await requestAdpater.sendGetRequest(endpoint)
      storeProfileDetail(id, detail)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  return {
    getTraderProfile,
    fetchTraderProfile,
    getProfileDetail,
    fetchProfileDetail,
    topProfiles: store.resources.topProfiles,
    fetchTopProfiles,
  }
}

export default useTraderProfile
