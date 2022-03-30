import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'
import * as requestAdapter from '../adapters/request'
import * as routerEnum from '../enums/router'

const useTraderState = () => {
  const store: Context = useContext(context)

  // ------------------------------------------------------------ Get --

  const getTopProfiles = (envId: number | null) => {
    if (envId === null) return null
    return store.resources.envTopProfiles ? store.resources.envTopProfiles[envId] : null
  }

  const getTraderProfile = (traderId: number | null) => {
    if (!traderId) return null
    return store.traderProfiles[traderId] || null
  }

  const getProfileDetail = (traderId: number | null) => {
    if (!traderId) return null
    return store.profileDetails[traderId] || null
  }

  const getTraderEnv = (traderEnvId: number | null) => {
    if (!traderEnvId) return null
    return store.traderEnvs[traderEnvId] || null
  }

  // ------------------------------------------------------------ Store --

  const storeTopProfiles = (envId: number, topProfiles: interfaces.traderRes.TopProfiles) => {
    const profiles = [
      ...topProfiles.yearly,
      ...topProfiles.pastYear, ...topProfiles.pastQuarter,
      ...topProfiles.pastMonth, ...topProfiles.pastWeek,
    ]
    const traderProfiles = profiles.reduce((traderProfiles, profile) => {
      return { ...traderProfiles, [profile.trader.id]: profile }
    }, {})
    store.setTraderProfiles((profiles) => ({ ...profiles, ...traderProfiles }))

    const tops = {
      yearly: topProfiles.yearly.map((profile) => profile.trader.id),
      pastYear: topProfiles.pastYear.map((profile) => profile.trader.id),
      pastQuarter: topProfiles.pastQuarter.map((profile) => profile.trader.id),
      pastMonth: topProfiles.pastMonth.map((profile) => profile.trader.id),
      pastWeek: topProfiles.pastWeek.map((profile) => profile.trader.id),
    }
    store.setResources((resources) => ({
      ...resources,
      envTopProfiles: {
        ...resources.envTopProfiles,
        [envId]: tops,
      },
    }))
  }

  const storeTraderProfile = (profile: interfaces.traderRes.TraderProfile) => {
    store.setTraderProfiles((profiles) => ({ ...profiles, [profile.trader.id]: profile }))
  }

  const storeTraderEnv = (env: interfaces.traderEnvModel.Record) => {
    store.setTraderEnvs((envs) => ({ ...envs, [env.id]: env }))
    if (!env.isSystem) {
      const userTraderEnvIds = [...store.resources.userTraderEnvIds, env.id]
      store.setResources((resources) => ({ ...resources, userTraderEnvIds }))
    }
  }

  const storeUserFollowed = (traderId: number) => {
    const currentUserIds = store.resources.userTraderIds || []
    if (currentUserIds.includes(traderId)) return
    const traderIds = [...currentUserIds, traderId]
    store.setResources((resources) => ({ ...resources, userTraderIds: traderIds }))
  }

  const storeProfileDetail = (
    traderId: number,
    detail: interfaces.traderRes.ProfileDetail,
  ) => {
    store.setProfileDetails((details) => ({ ...details, [traderId]: detail }))
  }

  // ------------------------------------------------------------ fetch --

  const fetchTraderProfile = async (id: number, accessCode: string) => {
    const endpoint = `${routerEnum.API.TRADERS}/profiles/${id}/${accessCode}`
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

  const fetchTopProfiles = async (envId: number) => {
    const endpoint = `${routerEnum.API.TRADERS}/envs/${envId}/tops`
    store.startLoading()
    try {
      const tops = await requestAdapter.sendGetRequest(endpoint)
      storeTopProfiles(envId, tops)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  const fetchProfileDetail = async (id: number, accessCode: string) => {
    const endpoint = `${routerEnum.API.TRADERS}/profiles/${id}/${accessCode}/detail`
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

  const fetchTraderEnv = async (id: number) => {
    const endpoint = `${routerEnum.API.TRADERS}/envs/${id}`
    store.startLoading()
    try {
      const env = await requestAdapter.sendGetRequest(endpoint)
      storeTraderEnv(env)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ create --

  const createTraderProfile = async (
    traderEnvId: number,
    traderPattern: interfaces.traderPatternModel.Create,
  ) => {
    const endpoint = `${routerEnum.API.TRADERS}/profiles`
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

  const createTraderEnv = async (
    name: string,
    startDate: string,
    tickerIds: number[] | null,
  ) => {
    const endpoint = `${routerEnum.API.TRADERS}/envs`
    store.startLoading()
    const reqs: interfaces.reqs.TraderEnvCreation = {
      name, startDate, tickerIds,
    }
    try {
      const env: interfaces.traderEnvModel.Record = await requestAdapter.sendPostRequest(
        endpoint, reqs,
      )
      storeTraderEnv(env)
      return env.id
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ export --

  return {
    getTopProfiles,
    getTraderProfile,
    getTraderEnv,
    getProfileDetail,
    fetchTraderProfile,
    fetchProfileDetail,
    fetchTraderEnv,
    fetchTopProfiles,
    createTraderProfile,
    createTraderEnv,
  }
}

export default useTraderState
