import * as constants from '@shared/constants'
import { context, Context, TraderCombo, TraderEnv } from '../context'
import * as requestAdapter from '../adapters/request'
import * as storageAdapter from '../adapters/storage'
import * as vendorTool from '../tools/vendor'

const useUserState = () => {
  const store: Context = vendorTool.react.useContext(context)

  // ------------------------------------------------------------ Get --

  const getUser = () => {
    return {
      userTraderIds: store.resources.userTraderIds,
      userType: store.resources.userType,
      userEmail: store.resources.userEmail,
    }
  }

  // ------------------------------------------------------------ Remove --

  const removeUser = () => {
    store.setResources((resources) => ({
      ...resources,
      userType: constants.User.Type.Guest,
      userTraderIds: [],
    }))

    store.setTraderCombos((combos) => {
      const systemCombos = Object.values(combos).filter((combo: TraderCombo) => combo.identity.isSystem)
      const systemComboMap = systemCombos.reduce((comboMap, combo) => ({
        ...comboMap,
        [combo.identity.id]: combo,
      }), {})
      return systemComboMap
    })

    store.setTraderEnvs((envs) => {
      const systemEnvs = Object.values(envs).filter((env: TraderEnv) => env.record.isSystem)
      const systemEnvMap = systemEnvs.reduce((envMap, env) => ({
        ...envMap,
        [env.record.id]: env,
      }), {})
      return systemEnvMap
    })

    requestAdapter.setJWTToken('')
    storageAdapter.remove(storageAdapter.Key.JWTToken)
    storageAdapter.remove(storageAdapter.Key.UserType)
  }

  // ------------------------------------------------------------ Export --

  return {
    removeUser,
    getUser,
  }
}

export default useUserState
