import * as interfaces from '@shared/interfaces'
import { context, Context, TraderProfiles } from './context'
import * as requestAdapter from '../adapters/request'
import * as routerEnum from '../enums/router'
import * as parseTool from '../tools/parse'
import * as vendorTool from '../tools/vendor'

const useRequest = () => {
  const store: Context = vendorTool.react.useContext(context)

  // ------------------------------------------------------------ store --

  const groupTraderProfilesForStore = (
    traderProfiles: interfaces.responses.TraderProfile[],
  ): TraderProfiles => {
    return traderProfiles.reduce((containedProfiles, traderProfile) => ({
      ...containedProfiles,
      [traderProfile.trader.id]: traderProfile,
    }), {})
  }

  const storeComboDetail = (
    id: number,
    comboDetail: interfaces.responses.ComboDetail,
  ) => {
    const traderProfiles = groupTraderProfilesForStore(comboDetail.profiles)
    store.setTraderProfiles((profiles) => ({ ...profiles, ...traderProfiles }))

    store.setResources((resource) => {
      const combos = resource.comboProfiles.map((combo) => {
        if (combo.identity.id !== id) return combo
        return {
          ...combo,
          detail: comboDetail,
        }
      })
      return {
        ...resource,
        comboProfiles: combos,
      }
    })
  }

  const storeSystemDefaults = (
    systemDefaults: interfaces.responses.SystemDefaults,
  ) => {
    const comboTraderProfiles = systemDefaults.comboProfiles.reduce((allTraderProfiles, combo) => {
      const traderProfiles = groupTraderProfilesForStore(combo.detail.profiles)
      return {
        ...allTraderProfiles,
        ...traderProfiles,
      }
    }, {})
    store.setTraderProfiles((profiles) => ({ ...profiles, ...comboTraderProfiles }))

    const parsedEnvs = systemDefaults.traderEnvs.map((env) => ({
      ...env,
      name: parseTool.traderEnvName(env),
    }))
    const parsedCombos = systemDefaults.comboProfiles.map((combo) => ({
      ...combo,
      identity: {
        ...combo.identity,
        name: parseTool.traderComboName(combo.identity),
      },
    }))
    const tickerIdentities = systemDefaults.tickerIdentities.reduce((identities, identity) => ({
      ...identities,
      [identity.id]: identity,
    }), {})
    const tickerCategories = systemDefaults.tickerCategories.reduce((categories, category) => ({
      ...categories,
      [category.id]: {
        ...category,
        name: parseTool.tickerCategoryName(category),
      },
    }), {})
    store.setResources((resources) => ({
      ...resources,
      tickerIdentities: {
        ...resources.tickerIdentities,
        ...tickerIdentities,
      },
      tickerCategories: {
        ...resources.tickerCategories,
        ...tickerCategories,
      },
      userTraderEnvs: [
        ...resources.userTraderEnvs,
        ...parsedEnvs,
      ],
      comboProfiles: [
        ...resources.comboProfiles,
        ...parsedCombos,
      ],
    }))
  }

  // ------------------------------------------------------------ fetch --

  const fetchSystemDefaults = async () => {
    const endpoint = `${routerEnum.Endpoint.Systems}/defaults`
    store.startLoading()
    try {
      const defaults = await requestAdapter.sendGetRequest(endpoint)
      storeSystemDefaults(defaults)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const fetchComboDetail = async (id: number) => {
    const endpoint = `${routerEnum.Endpoint.Traders}/combos/${id}`
    store.startLoading()
    try {
      const detail = await requestAdapter.sendGetRequest(endpoint)
      storeComboDetail(id, detail)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ export --

  return {
    fetchSystemDefaults,
    fetchComboDetail,
  }
}

export default useRequest
