import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context } from 'context'

const useResourceState = () => {
  const store: Context = useContext(context)

  // ------------------------------------------------------------ Get --

  const getPolicy = () => {
    return {
      privacyPolicy: store.resources.privacyPolicy,
      termsPolicy: store.resources.termsPolicy,
    }
  }

  const getTickerIdentity = (
    tickerId: number,
  ): interfaces.tickerModel.Identity | null => {
    const identities = store.resources.tickerIdentities
    return identities[tickerId] || null
  }

  const getTickerCategory = (
    categoryId: number,
  ): interfaces.tickerCategoryModel.Record | null => {
    const categories = store.resources.tickerCategories
    return categories[categoryId] || null
  }

  const getTickerCategories = (): interfaces.tickerCategoryModel.Record[] => {
    const categories = Object.values(store.resources.tickerCategories)
    return categories
  }

  const getOverallTopTraderProfiles = () => {
    return store.resources.overallTopTraderProfiles
  }

  // ------------------------------------------------------------ export --

  return {
    getPolicy,
    getTickerIdentity,
    getTickerCategory,
    getTickerCategories,
    getOverallTopTraderProfiles,
  }
}

export default useResourceState
