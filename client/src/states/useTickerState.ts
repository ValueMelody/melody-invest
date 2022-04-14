import * as interfaces from '@shared/interfaces'
import { context, Context } from './context'
import * as vendorTool from '../tools/vendor'

const useTickerState = () => {
  const store: Context = vendorTool.react.useContext(context)

  // ------------------------------------------------------------ Get --

  const getTickerIdentity = (
    tickerId: number,
  ): interfaces.tickerModel.Identity | null => {
    const identities = store.resources.tickerIdentities
    return identities[tickerId] || null
  }

  const getTickerIdentities = (): interfaces.tickerModel.Identity[] => {
    const tickers = Object.values(store.resources.tickerIdentities)
    return tickers.sort((prev, curr) => curr.symbol > prev.symbol ? -1 : 1)
  }

  const getTickerCategory = (
    categoryId: number,
  ): interfaces.tickerCategoryModel.Record | null => {
    const categories = store.resources.tickerCategories
    return categories[categoryId] || null
  }

  const getTickerCategories = (): interfaces.tickerCategoryModel.Record[] => {
    const categories = Object.values(store.resources.tickerCategories)
    return categories.sort((prev, curr) => curr.id > prev.id ? -1 : 1)
  }

  // ------------------------------------------------------------ export --

  return {
    getTickerIdentity,
    getTickerIdentities,
    getTickerCategory,
    getTickerCategories,
  }
}

export default useTickerState
