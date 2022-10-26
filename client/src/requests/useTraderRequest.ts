import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import { context, Context } from 'context'
import * as requestAdapter from 'adapters/request'
import * as routerEnum from 'enums/router'
import * as routerTool from 'tools/router'
import groupTraderProfiles from './shared/groupTraderProfiles'
import stripTopProfiles from './shared/stripTopProfiles'

const useTraderRequest = () => {
  const store: Context = useContext(context)
  const navigate = useNavigate()

  // ------------------------------------------------------------ store --

  const storeTraderCombo = (combo: interfaces.traderComboModel.Identity) => {
    const isSame = !!store.traderCombos[combo.id]
    if (!isSame) {
      store.setTraderCombos((traderCombos) => ({
        ...traderCombos,
        [combo.id]: { identity: combo },
      }))
    }
  }

  const storeTraderComboDetail = (
    id: number,
    comboDetail: interfaces.response.ComboDetail,
  ) => {
    const traderProfiles = groupTraderProfiles(comboDetail.profiles)
    store.setTraderProfiles((profiles) => ({ ...profiles, ...traderProfiles }))

    store.setTraderCombos((combos) => ({
      ...combos,
      [id]: {
        ...combos[id],
        detail: comboDetail,
      },
    }))
  }

  const storeTraderBehavior = (
    envId: number,
    behavior: interfaces.traderPatternModel.Behavior,
    behaviorDetail: interfaces.response.BehaviorDetail,
  ) => {
    const { topProfiles } = behaviorDetail
    const traderProfiles = groupTraderProfiles([
      ...topProfiles.yearly, ...topProfiles.pastYear, ...topProfiles.pastQuarter,
      ...topProfiles.pastMonth, ...topProfiles.pastWeek,
    ])
    store.setTraderProfiles((profiles) => ({ ...profiles, ...traderProfiles }))

    const tops = stripTopProfiles(topProfiles)
    store.setTraderBehaviors((resources) => ({
      ...resources,
      [`${envId}-${behavior}`]: { tops },
    }))
  }

  const storeTraderTicker = (
    envId: number,
    tickerId: number,
    tickerDetail: interfaces.response.TickerDetail,
  ) => {
    const { topProfiles } = tickerDetail
    const traderProfiles = groupTraderProfiles([
      ...topProfiles.yearly, ...topProfiles.pastYear, ...topProfiles.pastQuarter,
      ...topProfiles.pastMonth, ...topProfiles.pastWeek,
    ])
    store.setTraderProfiles((profiles) => ({ ...profiles, ...traderProfiles }))

    const tops = stripTopProfiles(topProfiles)
    store.setTraderTickers((resources) => ({
      ...resources,
      [`${envId}-${tickerId}`]: { tops },
    }))
  }

  const storeTraderEnv = (env: interfaces.traderEnvModel.Record) => {
    const isSame = !!store.traderEnvs[env.id]
    if (!isSame) {
      store.setTraderEnvs((envs) => ({
        ...envs,
        [env.id]: { record: env },
      }))
    }
  }

  const storeTraderEnvDetail = (
    envId: number,
    envDetail: interfaces.response.EnvDetail,
  ) => {
    const { topProfiles } = envDetail
    const traderProfiles = groupTraderProfiles([
      ...topProfiles.yearly, ...topProfiles.pastYear, ...topProfiles.pastQuarter,
      ...topProfiles.pastMonth, ...topProfiles.pastWeek,
    ])
    store.setTraderProfiles((profiles) => ({ ...profiles, ...traderProfiles }))

    const tops = stripTopProfiles(topProfiles)
    store.setTraderEnvs((envs) => ({
      ...envs,
      [envId]: {
        ...envs[envId],
        tops,
      },
    }))
  }

  const storeTraderProfile = (profile: interfaces.response.TraderProfile) => {
    store.setTraderProfiles((profiles) => ({
      ...profiles,
      [profile.trader.id]: {
        ...profile,
      },
    }))
  }

  const storeWatchedProfile = (traderId: number) => {
    const currentUserIds = store.resources.userTraderIds
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

  const removeWatchedProfile = (traderId: number) => {
    const traderIds = store.resources.userTraderIds
    const remainingTraderIds = traderIds.filter((id) => id !== traderId)
    store.setResources((resources) => ({ ...resources, userTraderIds: remainingTraderIds }))
  }

  const removeWatchedEnv = (traderEnvId: number) => {
    const traderEnvs = { ...store.traderEnvs }
    delete traderEnvs[traderEnvId]
    store.setTraderEnvs(traderEnvs)
  }

  const removeWatchedCombo = (traderComboId: number) => {
    const traderCombos = { ...store.traderCombos }
    delete traderCombos[traderComboId]
    store.setTraderCombos(traderCombos)
  }

  // ------------------------------------------------------------ fetch --

  const fetchTraderCombo = async (id: number) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/combos/${id}`
    store.startLoading()
    try {
      const detail = await requestAdapter.sendGetRequest(endpoint)
      storeTraderComboDetail(id, detail)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const fetchTraderBehavior = async (
    traderEnvId: number, behavior: interfaces.traderPatternModel.Behavior,
  ) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/envs/${traderEnvId}/behaviors/${behavior}`
    store.startLoading()
    try {
      const detail = await requestAdapter.sendGetRequest(endpoint)
      storeTraderBehavior(traderEnvId, behavior, detail)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const fetchTraderTicker = async (
    traderEnvId: number, tickerId: number,
  ) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/envs/${traderEnvId}/tickers/${tickerId}`
    store.startLoading()
    try {
      const detail = await requestAdapter.sendGetRequest(endpoint)
      storeTraderTicker(traderEnvId, tickerId, detail)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const fetchTraderEnv = async (envId: number) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/envs/${envId}`
    store.startLoading()
    try {
      const detail = await requestAdapter.sendGetRequest(endpoint)
      storeTraderEnvDetail(envId, detail)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

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

  // ------------------------------------------------------------ Create --

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
      const link = routerTool.envDetailRoute(env.id)
      navigate(link)
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
      storeTraderCombo(combo)
      const link = routerTool.comboDetailRoute(combo.id)
      navigate(link)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

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

      const link = routerTool.profileDetailRoute(profile.trader.id, profile.trader.accessCode)
      navigate(link)
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

  // ------------------------------------------------------------ Export --

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

  const deleteTraderCombo = async (traderComboId: number) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/combos/${traderComboId}`
    store.startLoading()
    try {
      await requestAdapter.sendDeleteRequest(endpoint)
      removeWatchedCombo(traderComboId)
      const link = routerTool.dashboardRoute()
      navigate(link)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const deleteTraderEnv = async (traderEnvId: number) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/envs/${traderEnvId}`
    store.startLoading()
    try {
      await requestAdapter.sendDeleteRequest(endpoint)
      removeWatchedEnv(traderEnvId)
      const link = routerTool.dashboardRoute()
      navigate(link)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ Export --

  return {
    fetchTraderCombo,
    fetchTraderBehavior,
    fetchTraderTicker,
    fetchTraderEnv,
    fetchTraderProfile,
    fetchProfileDetail,
    createTraderEnv,
    createTraderCombo,
    createTraderProfile,
    createWatchedProfile,
    deleteWatchedProfile,
    deleteTraderEnv,
    deleteTraderCombo,
  }
}

export default useTraderRequest
