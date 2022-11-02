import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import * as interfaces from '@shared/interfaces'
import { context, Context } from 'context'
import * as requestAdapter from 'adapters/request'
import * as routerEnum from 'enums/router'
import * as routerTool from 'tools/router'

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

  // ------------------------------------------------------------ Create --

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

  return {
    createTraderCombo,
    createTraderProfile,
  }
}

export default useTraderRequest
