import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import * as constants from '@shared/constants'
import { context, Context } from 'context'
import * as requestAdapter from 'adapters/request'
import * as routerEnum from 'enums/router'
import * as parseTool from 'tools/parse'
import groupTraderProfiles from './shared/groupTraderProfiles'
import stripTopProfiles from './shared/stripTopProfiles'

const useSystemRequest = () => {
  const store: Context = useContext(context)

  // ------------------------------------------------------------ store --

  const storeTopTraderCombos = (
    comboProfiles: interfaces.response.ComboProfile[],
  ) => {
    const initial: interfaces.response.TraderProfile[] = []
    const comboTraderProfiles = comboProfiles.reduce((allTraderProfiles, combo) => {
      return [...allTraderProfiles, ...combo.detail.profiles]
    }, initial)
    const traderProfiles = groupTraderProfiles(comboTraderProfiles)
    store.setTraderProfiles((profiles) => ({ ...profiles, ...traderProfiles }))

    const parsedCombos = comboProfiles.reduce((combos, combo) => ({
      ...combos,
      [combo.identity.id]: {
        identity: {
          ...combo.identity,
          name: parseTool.traderComboName(combo.identity),
        },
        detail: combo.detail,
      },
    }), {})
    store.setTraderCombos((combos) => ({
      ...combos,
      ...parsedCombos,
    }))
  }

  const storeTopTraderProfiles = (
    topProfiles: interfaces.response.TopTraderProfiles,
  ) => {
    const traderProfiles = groupTraderProfiles([
      ...topProfiles.yearly, ...topProfiles.pastYear, ...topProfiles.pastQuarter,
      ...topProfiles.pastMonth, ...topProfiles.pastWeek,
    ])
    store.setTraderProfiles((profiles) => ({ ...profiles, ...traderProfiles }))

    const tops = stripTopProfiles(topProfiles)
    store.setResources((resources) => ({
      ...resources,
      overallTopTraderProfiles: tops,
    }))
  }

  const storeSystemPolicy = (
    type: number,
    policy: interfaces.policyModel.Record,
  ) => {
    let key: 'privacyPolicy' | 'termsPolicy'
    switch (type) {
      case constants.Content.PolicyType.Privacy:
        key = 'privacyPolicy'
        break
      case constants.Content.PolicyType.TermsAndConditions:
      default:
        key = 'termsPolicy'
        break
    }
    store.setResources((resources) => ({
      ...resources,
      [key]: policy.content,
    }))
  }

  // ------------------------------------------------------------ fetch --

  const fetchSystemPolicy = async (type: number) => {
    const endpoint = `${routerEnum.Endpoint.Systems}/policy/${type}`
    store.startLoading()
    try {
      const policy = await requestAdapter.sendGetRequest(endpoint)
      storeSystemPolicy(type, policy)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const fetchSystemTraderCombos = async () => {
    const endpoint = `${routerEnum.Endpoint.Systems}/default-trader-combos`
    store.startLoading()
    try {
      const combos = await requestAdapter.sendGetRequest(endpoint)
      storeTopTraderCombos(combos)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  const fetchOverallTopTraderProfiles = async () => {
    const endpoint = `${routerEnum.Endpoint.Systems}/top-trader-profiles`
    store.startLoading()
    try {
      const topProfiles = await requestAdapter.sendGetRequest(endpoint)
      storeTopTraderProfiles(topProfiles)
    } catch (e) {
      store.showRequestError(e)
    } finally {
      store.stopLoading()
    }
  }

  // ------------------------------------------------------------ export --

  return {
    fetchSystemPolicy,
    fetchSystemTraderCombos,
    fetchOverallTopTraderProfiles,
  }
}

export default useSystemRequest
