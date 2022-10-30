import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { context, Context } from 'context'

const useResourceState = () => {
  const store: Context = useContext(context)

  // ------------------------------------------------------------ Get --

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
    getTickerCategory,
    getTickerCategories,
    getOverallTopTraderProfiles,
  }
}

export default useResourceState
