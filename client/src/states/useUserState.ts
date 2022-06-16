import * as constants from '@shared/constants'
import { context, Context, TraderEnv, TraderCombo } from '../context'
import * as vendorTool from '../tools/vendor'

const useUserState = () => {
  const store: Context = vendorTool.react.useContext(context)

  const limits = vendorTool.react.useMemo(() => {
    switch (store.resources.userType) {
      case constants.User.Type.Premium:
        return constants.User.PlanLimit.Premium
      case constants.User.Type.Pro:
        return constants.User.PlanLimit.Pro
      case constants.User.Type.Basic:
      default:
        return constants.User.PlanLimit.Basic
    }
  }, [store.resources.userType])

  const envs: TraderEnv[] = Object.values(store.traderEnvs)
  const userEnvs = envs.filter((env: TraderEnv) => !env.record.isSystem)
  const combos: TraderCombo[] = Object.values(store.traderCombos)
  const userCombos = combos.filter((combo: TraderCombo) => !combo.identity.isSystem)

  const canFollowEnv = limits.Envs > userEnvs.length
  const canFollowCombo = limits.Combos > userCombos.length
  const canFollowTrader = limits.Profiles > store.resources.userTraderIds.length

  const accessibleEnvIds = userEnvs.map((env) => env.record.id).slice(0, limits.Envs)
  const accessibleComboIds = userCombos.map((combo) => combo.identity.id).slice(0, limits.Combos)
  const accessibleTraderIds = store.resources.userTraderIds.slice(0, limits.Profiles)

  // ------------------------------------------------------------ Get --

  const getUser = () => {
    return {
      hasLogin: store.resources.hasLogin,
      userTraderIds: store.resources.userTraderIds,
      userType: store.resources.userType,
      userEmail: store.resources.userEmail,
      planStartAtUTC: store.resources.planStartAtUTC,
      planEndAtUTC: store.resources.planEndAtUTC,
      canFollowEnv,
      canFollowCombo,
      canFollowTrader,
      accessibleEnvIds,
      accessibleComboIds,
      accessibleTraderIds,
    }
  }

  // ------------------------------------------------------------ Remove --

  const removeUser = () => {
    store.cleanUserState()
  }

  // ------------------------------------------------------------ Export --

  return {
    removeUser,
    getUser,
  }
}

export default useUserState
