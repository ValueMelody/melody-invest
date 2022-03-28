import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'
import * as requestAdapter from '../adapters/request'
import * as routerEnum from '../enums/router'

const useTraderState = () => {
  const store: Context = useContext(context)

  const getTraderProfile = (id: number | null) => {
    if (!id) return null
    return store.traderProfiles[id] || null
  }

  const storeTraderProfile = (profile: interfaces.traderRes.TraderProfile) => {
    store.setTraderProfiles((profiles) => ({ ...profiles, [profile.trader.id]: profile }))
  }

  const fetchTraderProfile = async (id: number, accessCode: string) => {
    const endpoint = `${routerEnum.API.TRADERS}/${id}/${accessCode}`
    store.startLoading()
    try {
      const profile = await requestAdapter.sendGetRequest(endpoint)
      storeTraderProfile(profile)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  const storeTopProfiles = (topProfiles: interfaces.traderRes.TopProfiles) => {
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
    const endpoint = `${routerEnum.API.TRADERS}/tops`
    store.startLoading()
    try {
      const traders = await requestAdapter.sendGetRequest(endpoint)
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
    detail: interfaces.traderRes.ProfileDetail,
  ) => {
    store.setProfileDetails((details) => ({ ...details, [traderId]: detail }))
  }

  const fetchProfileDetail = async (id: number, accessCode: string) => {
    const endpoint = `${routerEnum.API.TRADERS}/${id}/${accessCode}/detail`
    store.startLoading()
    try {
      const detail = await requestAdapter.sendGetRequest(endpoint)
      storeProfileDetail(id, detail)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  const storeUserFollowed = (traderId: number) => {
    const currentUserIds = store.resources.userTraderIds || []
    if (currentUserIds.includes(traderId)) return
    const traderIds = [...currentUserIds, traderId]
    store.setResources((resources) => ({ ...resources, userTraderIds: traderIds }))
  }

  const createTraderProfile = async (
    traderEnvId: number,
    traderPattern: interfaces.traderPatternModel.Create,
  ) => {
    const endpoint = `${routerEnum.API.TRADERS}`
    store.startLoading()
    try {
      const profile: interfaces.traderRes.TraderProfile = await requestAdapter.sendPostRequest(
        endpoint, { traderEnvId, traderPattern },
      )
      storeTraderProfile(profile)
      storeUserFollowed(profile.trader.id)

      return {
        traderId: profile.trader.id,
        accessCode: profile.trader.accessCode,
      }
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
    createTraderProfile,
  }
}

export default useTraderState
