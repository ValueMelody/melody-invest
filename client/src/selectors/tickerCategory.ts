import * as interfaces from '@shared/interfaces'

const selectTickerCategoryBases = () => (
  state: AppState,
): interfaces.tickerCategoryModel.Record[] => {
  const categories = Object.values(state.tickerCategory.base)
  return categories
}

export {
  selectTickerCategoryBases,
}
