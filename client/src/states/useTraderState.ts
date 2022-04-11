import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'
import * as requestAdapter from '../adapters/request'
import * as routerEnum from '../enums/router'
import * as vendorTool from '../tools/vendor'

const useTraderState = () => {
  const store: Context = vendorTool.react.useContext(context)

  // ------------------------------------------------------------ Get --

  const getTopProfiles = (envId: number | null) => {
    if (envId === null) return null
    return store.topProfiles[envId] || null
  }

  const getProfileDetail = (traderId: number | null) => {
    if (!traderId) return null
    return store.profileDetails[traderId] || null
  }

  const getBehaviorDetail = (
    traderEnvId: number | null, behavior: interfaces.traderPatternModel.Behavior | null,
  ) => {
    if (!traderEnvId || !behavior) return null
    return store.behaviorDetails[`${traderEnvId}-${behavior}`]
  }

  const getTickerDetail = (
    traderEnvId: number | null, tickerId: number | null,
  ) => {
    if (!traderEnvId || !tickerId) return null
    return store.tickerDetails[`${traderEnvId}-${tickerId}`]
  }

  // ------------------------------------------------------------ Store --

  const storeTraderProfile = (profile: interfaces.traderRes.TraderProfile) => {
    store.setProfileDetails((profiles) => ({
      ...profiles,
      [profile.trader.id]: {
        ...profile,
      },
    }))
  }

  const storeTraderProfiles = (profiles: interfaces.traderRes.TraderProfile[]) => {
    const traderProfiles = profiles.reduce((traderProfiles, profile) => ({
      ...traderProfiles,
      [profile.trader.id]: { ...profile },
    }), {})
    store.setProfileDetails((profiles) => ({ ...profiles, ...traderProfiles }))
  }

  const storeTopProfiles = (envId: number, topProfiles: interfaces.traderRes.TopProfiles) => {
    const profiles = [
      ...topProfiles.yearly, ...topProfiles.pastYear, ...topProfiles.pastQuarter,
      ...topProfiles.pastMonth, ...topProfiles.pastWeek,
    ]
    storeTraderProfiles(profiles)

    const tops = {
      yearly: topProfiles.yearly.map((profile) => profile.trader.id),
      pastYear: topProfiles.pastYear.map((profile) => profile.trader.id),
      pastQuarter: topProfiles.pastQuarter.map((profile) => profile.trader.id),
      pastMonth: topProfiles.pastMonth.map((profile) => profile.trader.id),
      pastWeek: topProfiles.pastWeek.map((profile) => profile.trader.id),
    }
    store.setTopProfiles((topProfiles) => ({
      ...topProfiles,
      [envId]: tops,
    }))
  }

  const storeBehaviorDetail = (
    envId: number,
    behavior: interfaces.traderPatternModel.Behavior,
    behaviorDetail: interfaces.traderRes.BehaviorDetail,
  ) => {
    const { topProfiles } = behaviorDetail
    const profiles = [
      ...topProfiles.yearly, ...topProfiles.pastYear, ...topProfiles.pastQuarter,
      ...topProfiles.pastMonth, ...topProfiles.pastWeek,
    ]
    storeTraderProfiles(profiles)

    const tops = {
      yearly: topProfiles.yearly.map((profile) => profile.trader.id),
      pastYear: topProfiles.pastYear.map((profile) => profile.trader.id),
      pastQuarter: topProfiles.pastQuarter.map((profile) => profile.trader.id),
      pastMonth: topProfiles.pastMonth.map((profile) => profile.trader.id),
      pastWeek: topProfiles.pastWeek.map((profile) => profile.trader.id),
    }
    store.setBehaviorDetails((resources) => ({
      ...resources,
      [`${envId}-${behavior}`]: { tops },
    }))
  }

  const storeTickerDetail = (
    envId: number,
    tickerId: number,
    tickerDetail: interfaces.traderRes.TickerDetail,
  ) => {
    const { topProfiles } = tickerDetail
    const profiles = [
      ...topProfiles.yearly, ...topProfiles.pastYear, ...topProfiles.pastQuarter,
      ...topProfiles.pastMonth, ...topProfiles.pastWeek,
    ]
    storeTraderProfiles(profiles)

    const tops = {
      yearly: topProfiles.yearly.map((profile) => profile.trader.id),
      pastYear: topProfiles.pastYear.map((profile) => profile.trader.id),
      pastQuarter: topProfiles.pastQuarter.map((profile) => profile.trader.id),
      pastMonth: topProfiles.pastMonth.map((profile) => profile.trader.id),
      pastWeek: topProfiles.pastWeek.map((profile) => profile.trader.id),
    }
    store.setTickerDetails((resources) => ({
      ...resources,
      [`${envId}-${tickerId}`]: { tops },
    }))
  }

  const storeTraderEnv = (env: interfaces.traderEnvModel.Record) => {
    const isSame = store.resources.userTraderEnvs.some((traderEnv) => traderEnv.id === env.id)
    if (!isSame) {
      store.setResources((resources) => ({
        ...resources,
        userTraderEnvs: [...resources.userTraderEnvs, env],
      }))
    }
  }

  const storeTraderCombo = (combo: interfaces.traderComboModel.Identity) => {
    const isSame = store.resources.userTraderCombos.some((traderCombo) => traderCombo.identity.id === combo.id)
    if (!isSame) {
      store.setResources((resources) => ({
        ...resources,
        userTraderCombos: [...resources.userTraderCombos, { identity: combo }],
      }))
    }
  }

  const storeWatchedProfile = (traderId: number) => {
    const currentUserIds = store.resources.userTraderIds || []
    if (currentUserIds.includes(traderId)) return
    const traderIds = [...currentUserIds, traderId]
    store.setResources((resources) => ({ ...resources, userTraderIds: traderIds }))
  }

  const storeProfileDetail = (
    traderId: number,
    detail: interfaces.traderRes.ProfileDetail,
  ) => {
    if (!store.profileDetails[traderId]) return
    store.setProfileDetails((details) => (
      {
        ...details,
        [traderId]: {
          ...details[traderId],
          ...detail,
        },
      }
    ))
  }

  // ------------------------------------------------------------ Remove --

  const removeWatchedProfile = (traderId: number) => {
    const traderIds = store.resources.userTraderIds || []
    const remainingTraderIds = traderIds.filter((id) => id !== traderId)
    store.setResources((resources) => ({ ...resources, userTraderIds: remainingTraderIds }))
  }

  const removeWatchedEnv = (traderEnvId: number) => {
    const traderEnvs = store.resources.userTraderEnvs
    const remainingTraderEnvs = traderEnvs.filter((env) => env.id !== traderEnvId)
    store.setResources((resources) => ({ ...resources, userTraderEnvs: remainingTraderEnvs }))
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
    const endpoint = envId
      ? `${routerEnum.API.TRADERS}/envs/${envId}/tops`
      : `${routerEnum.API.TRADERS}/envs/tops`
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

  const fetchBehaviorDetail = async (
    traderEnvId: number, behavior: interfaces.traderPatternModel.Behavior,
  ) => {
    const endpoint = `${routerEnum.API.TRADERS}/envs/${traderEnvId}/behaviors/${behavior}`
    store.startLoading()
    try {
      const detail = await requestAdapter.sendGetRequest(endpoint)
      storeBehaviorDetail(traderEnvId, behavior, detail)
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  const fetchTickerDetail = async (
    traderEnvId: number, tickerId: number,
  ) => {
    const endpoint = `${routerEnum.API.TRADERS}/envs/${traderEnvId}/tickers/${tickerId}`
    store.startLoading()
    try {
      const detail = await requestAdapter.sendGetRequest(endpoint)
      storeTickerDetail(traderEnvId, tickerId, detail)
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
      storeWatchedProfile(profile.trader.id)

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

  const createWatchedProfile = async (traderId: number) => {
    const endpoint = `${routerEnum.API.TRADERS}/profiles/${traderId}`
    store.startLoading()
    try {
      await requestAdapter.sendPostRequest(endpoint)
      storeWatchedProfile(traderId)
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

  const createTraderCombo = async (
    name: string,
    traderEnvId: number,
    traderIds: number[],
  ) => {
    const endpoint = `${routerEnum.API.TRADERS}/combos`
    store.startLoading()
    const reqs: interfaces.reqs.TraderComboCreation = {
      name, traderEnvId, traderIds,
    }
    try {
      const combo: interfaces.traderComboModel.Identity = await requestAdapter.sendPostRequest(
        endpoint, reqs,
      )
      storeTraderCombo(combo)
      return combo.id
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ export --

  const deleteWatchedProfile = async (traderId: number) => {
    const endpoint = `${routerEnum.API.TRADERS}/profiles/${traderId}`
    store.startLoading()
    try {
      await requestAdapter.sendDeleteRequest(endpoint)
      removeWatchedProfile(traderId)
      return true
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  const deleteWatchedEnv = async (traderEnvId: number) => {
    const endpoint = `${routerEnum.API.TRADERS}/envs/${traderEnvId}`
    store.startLoading()
    try {
      await requestAdapter.sendDeleteRequest(endpoint)
      removeWatchedEnv(traderEnvId)
      return true
    } catch (e: any) {
      store.showRequestError(e?.message)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ export --

  return {
    getTopProfiles,
    getProfileDetail,
    getBehaviorDetail,
    getTickerDetail,
    fetchTraderProfile,
    fetchProfileDetail,
    fetchBehaviorDetail,
    fetchTickerDetail,
    fetchTraderEnv,
    fetchTopProfiles,
    createTraderProfile,
    createTraderEnv,
    createTraderCombo,
    createWatchedProfile,
    deleteWatchedProfile,
    deleteWatchedEnv,
  }
}

export default useTraderState
