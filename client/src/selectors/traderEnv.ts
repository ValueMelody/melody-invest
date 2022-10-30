import { RootState } from 'stores'

const selectTraderEnvs = () => (state: RootState) => {
  return Object.values(state.traderEnv)
}

export {
  selectTraderEnvs,
}
