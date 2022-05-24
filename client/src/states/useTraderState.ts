import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'
import * as requestAdapter from '../adapters/request'
import * as routerEnum from '../enums/router'
import * as vendorTool from '../tools/vendor'

const useTraderState = () => {
  const store: Context = vendorTool.react.useContext(context)

  // ------------------------------------------------------------ Get --

  const getTopTraderProfiles = (envId: number | null) => {
    if (envId === null) return null
    return store.topTraderProfiles[envId] || null
  }

  const getTraderProfile = (traderId: number | null) => {
    if (!traderId) return null
    return store.traderProfiles[traderId] || null
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

  const storeTraderProfile = (profile: interfaces.response.TraderProfile) => {
    store.setTraderProfiles((profiles) => ({
      ...profiles,
      [profile.trader.id]: {
        ...profile,
      },
    }))
  }

  const storeTraderProfiles = (profiles: interfaces.response.TraderProfile[]) => {
    const traderProfiles = profiles.reduce((traderProfiles, profile) => ({
      ...traderProfiles,
      [profile.trader.id]: profile,
    }), {})
    store.setTraderProfiles((profiles) => ({ ...profiles, ...traderProfiles }))
  }

  const storeTopProfiles = (
    envId: number,
    topTraderProfiles: interfaces.response.TopTraderProfiles,
  ) => {
    const topProfiles = [
      ...topTraderProfiles.yearly,
      ...topTraderProfiles.pastYear,
      ...topTraderProfiles.pastQuarter,
      ...topTraderProfiles.pastMonth,
      ...topTraderProfiles.pastWeek,
    ]
    storeTraderProfiles(topProfiles)

    const tops = {
      yearly: topTraderProfiles.yearly.map((profile) => profile.trader.id),
      pastYear: topTraderProfiles.pastYear.map((profile) => profile.trader.id),
      pastQuarter: topTraderProfiles.pastQuarter.map((profile) => profile.trader.id),
      pastMonth: topTraderProfiles.pastMonth.map((profile) => profile.trader.id),
      pastWeek: topTraderProfiles.pastWeek.map((profile) => profile.trader.id),
    }
    store.setTopTraderProfiles((profiles) => ({
      ...profiles,
      [envId]: tops,
    }))
  }

  const storeBehaviorDetail = (
    envId: number,
    behavior: interfaces.traderPatternModel.Behavior,
    behaviorDetail: interfaces.response.BehaviorDetail,
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
    tickerDetail: interfaces.response.TickerDetail,
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

  const storeComboIdentity = (combo: interfaces.traderComboModel.Identity) => {
    const isSame = store.resources.comboProfiles.some((traderCombo) => traderCombo.identity.id === combo.id)
    if (!isSame) {
      store.setResources((resources) => ({
        ...resources,
        comboProfiles: [...resources.comboProfiles, { identity: combo }],
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
    detail: interfaces.response.ProfileDetail,
  ) => {
    if (!store.traderProfiles[traderId]) return
    store.setTraderProfiles((details) => (
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
    const endpoint = `${routerEnum.Endpoint.Traders}/profiles/${id}/${accessCode}`
    store.startLoading()
    try {
      const profile = await requestAdapter.sendGetRequest(endpoint)
      storeTraderProfile(profile)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const fetchTopProfiles = async (envId: number) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/envs/${envId}/tops`
    store.startLoading()
    try {
      const tops = await requestAdapter.sendGetRequest(endpoint)
      storeTopProfiles(envId, tops)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const fetchProfileDetail = async (id: number, accessCode: string) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/profiles/${id}/${accessCode}/detail`
    store.startLoading()
    try {
      const detail = await requestAdapter.sendGetRequest(endpoint)
      storeProfileDetail(id, detail)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const fetchBehaviorDetail = async (
    traderEnvId: number, behavior: interfaces.traderPatternModel.Behavior,
  ) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/envs/${traderEnvId}/behaviors/${behavior}`
    store.startLoading()
    try {
      const detail = await requestAdapter.sendGetRequest(endpoint)
      storeBehaviorDetail(traderEnvId, behavior, detail)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const fetchTickerDetail = async (
    traderEnvId: number, tickerId: number,
  ) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/envs/${traderEnvId}/tickers/${tickerId}`
    store.startLoading()
    try {
      const detail = await requestAdapter.sendGetRequest(endpoint)
      storeTickerDetail(traderEnvId, tickerId, detail)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ create --

  const createTraderProfile = async (
    traderEnvId: number,
    traderPattern: interfaces.traderPatternModel.Create,
  ) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/profiles`
    store.startLoading()
    try {
      const profile: interfaces.response.TraderProfile = await requestAdapter.sendPostRequest(
        endpoint, { traderEnvId, traderPattern },
      )
      storeTraderProfile(profile)
      storeWatchedProfile(profile.trader.id)

      return {
        traderId: profile.trader.id,
        accessCode: profile.trader.accessCode,
      }
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const createWatchedProfile = async (traderId: number) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/profiles/${traderId}`
    store.startLoading()
    try {
      await requestAdapter.sendPostRequest(endpoint)
      storeWatchedProfile(traderId)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const createTraderEnv = async (
    name: string,
    startDate: string,
    tickerIds: number[] | null,
  ) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/envs`
    store.startLoading()
    const reqs: interfaces.request.TraderEnvCreation = {
      name, startDate, tickerIds,
    }
    try {
      const env: interfaces.traderEnvModel.Record = await requestAdapter.sendPostRequest(
        endpoint, reqs,
      )
      storeTraderEnv(env)
      return env.id
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const createTraderCombo = async (
    name: string,
    traderIds: number[],
  ) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/combos`
    store.startLoading()
    const reqs: interfaces.request.TraderComboCreation = {
      name, traderIds,
    }
    try {
      const combo: interfaces.traderComboModel.Identity = await requestAdapter.sendPostRequest(
        endpoint, reqs,
      )
      storeComboIdentity(combo)
      return combo.id
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ export --

  const deleteWatchedProfile = async (traderId: number) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/profiles/${traderId}`
    store.startLoading()
    try {
      await requestAdapter.sendDeleteRequest(endpoint)
      removeWatchedProfile(traderId)
      return true
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const deleteWatchedEnv = async (traderEnvId: number) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/envs/${traderEnvId}`
    store.startLoading()
    try {
      await requestAdapter.sendDeleteRequest(endpoint)
      removeWatchedEnv(traderEnvId)
      return true
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ export --

  return {
    getTopTraderProfiles,
    getTraderProfile,
    getBehaviorDetail,
    getTickerDetail,
    fetchTraderProfile,
    fetchProfileDetail,
    fetchBehaviorDetail,
    fetchTickerDetail,
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
