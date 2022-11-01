import { UserState } from 'stores/user'
import * as constants from '@shared/constants'

const getLimit = (userType: number) => {
  switch (userType) {
    case constants.User.Type.Premium:
      return constants.User.PlanLimit.Premium
    case constants.User.Type.Pro:
      return constants.User.PlanLimit.Pro
    case constants.User.Type.Basic:
      return constants.User.PlanLimit.Basic
    default:
      return constants.User.PlanLimit.Guest
  }
}

const selectUser = () => (state: AppState): UserState => {
  const user = state.user

  const limits = getLimit(user.userType)

  const envs = Object.values(state.traderEnv.base)
  const userEnvs = envs.filter((env) => !env.isSystem)
  const combos = Object.values(state.traderCombo.base)
  const userCombos = combos.filter((combo) => !combo.isSystem)

  const canFollowEnv = limits.Envs > userEnvs.length
  const canFollowCombo = limits.Combos > userCombos.length
  const canFollowTrader = limits.Profiles > user.userTraderIds.length

  const accessibleEnvIds = userEnvs.map((env) => env.id).slice(0, limits.Envs)
  const accessibleComboIds = userCombos.map((combo) => combo.id).slice(0, limits.Combos)
  const accessibleTraderIds = user.userTraderIds.slice(0, limits.Profiles)

  const access = {
    canFollowEnv,
    canFollowCombo,
    canFollowTrader,
    accessibleEnvIds,
    accessibleComboIds,
    accessibleTraderIds,
  }

  return {
    ...user,
    access,
  }
}

export {
  selectUser,
}
