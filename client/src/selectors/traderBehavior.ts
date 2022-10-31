import * as interfaces from '@shared/interfaces'

const selectTraderBehaviorDetail = (
  envId: number,
  behavior?: interfaces.traderPatternModel.Behavior,
) => (
  state: AppState,
): { topProfiles: TopTraderProfileIds } | undefined => {
  if (!envId || !behavior) return undefined
  const detail = state.traderBehavior.detail[`${envId}-${behavior}`]
  return detail
}

export {
  selectTraderBehaviorDetail,
}
