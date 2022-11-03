import * as interfaces from '@shared/interfaces'

const selectTraderComboBases = () => (
  state: AppState,
): interfaces.traderComboModel.Identity[] => {
  return Object.values(state.traderCombo.base)
}

const selectTraderComboBaseById = (id?: number) => (
  state: AppState,
): interfaces.traderComboModel.Identity | undefined => {
  if (!id) return undefined
  const detail = state.traderCombo.base[id]
  return detail
}

const selectTraderComboDetailById = (id?: number) => (
  state: AppState,
): interfaces.response.ComboDetail | undefined => {
  if (!id) return undefined
  const detail = state.traderCombo.detail[id]
  return detail
}

export {
  selectTraderComboBases,
  selectTraderComboBaseById,
  selectTraderComboDetailById,
}
