const selectTickerIdentityBases = () => (state: AppState) => {
  const tickers = Object.values(state.tickerIdentity.base)
  return tickers.sort((prev, curr) => curr.symbol > prev.symbol ? -1 : 1)
}

const selectTickerIdentityBaseById = (id?: number) => (state: AppState) => {
  if (!id) return undefined
  const ticker = state.tickerIdentity.base[id]
  return ticker
}

export {
  selectTickerIdentityBases,
  selectTickerIdentityBaseById,
}
