import * as interfaces from '@shared/interfaces'
import { TickerIdentityBase } from 'stores/tickerIdentity'

const selectHasTickerIdentity = () => (
  state: AppState,
): boolean => {
  return Object.keys(state.tickerIdentity.base).length > 0
}

const selectTickerIdentityBaseDict = () => (
  state: AppState,
): TickerIdentityBase => {
  return state.tickerIdentity.base
}

const selectTickerIdentityBases = () => (
  state: AppState,
): interfaces.tickerModel.Record[] => {
  const tickers = Object.values(state.tickerIdentity.base)
  return tickers.sort((prev, curr) => curr.symbol > prev.symbol ? -1 : 1)
}

const selectTickerIdentityBaseById = (id?: number) => (
  state: AppState,
): interfaces.tickerModel.Record | undefined => {
  if (!id) return undefined
  const ticker = state.tickerIdentity.base[id]
  return ticker
}

const selectTickerIdentityDetail = (envId: number, tickerId?: number) => (
  state: AppState,
): { topProfiles: TopTraderProfileIds } | undefined => {
  if (!envId || !tickerId) return undefined
  const detail = state.tickerIdentity.detail[`${envId}-${tickerId}`]
  return detail
}

export {
  selectHasTickerIdentity,
  selectTickerIdentityBaseDict,
  selectTickerIdentityBases,
  selectTickerIdentityBaseById,
  selectTickerIdentityDetail,
}
