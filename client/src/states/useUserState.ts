import { context, Context } from '../context'
import * as vendorTool from '../tools/vendor'

const useUserState = () => {
  const store: Context = vendorTool.react.useContext(context)

  // ------------------------------------------------------------ Get --

  const getUser = () => {
    return {
      hasLogin: store.resources.hasLogin,
      userTraderIds: store.resources.userTraderIds,
      userType: store.resources.userType,
      userEmail: store.resources.userEmail,
      planStartAtUTC: store.resources.planStartAtUTC,
      planEndAtUTC: store.resources.planEndAtUTC,
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
