const selectTraderEnvBases = () => (state: AppState) => {
  return Object.values(state.traderEnv.base)
}

export {
  selectTraderEnvBases,
}
