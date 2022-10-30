const selectTickerCategoryBases = () => (state: AppState) => {
  const categories = Object.values(state.tickerCategory.base)
  return categories
}

export {
  selectTickerCategoryBases,
}
