import { useContext } from 'react'
import { context, Context } from 'context'

const useUserState = () => {
  const store: Context = useContext(context)

  // ------------------------------------------------------------ Remove --

  const removeUser = () => {
    store.cleanUserState()
  }

  // ------------------------------------------------------------ Export --

  return {
    removeUser,
  }
}

export default useUserState
