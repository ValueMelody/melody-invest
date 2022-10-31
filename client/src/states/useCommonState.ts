import { useContext } from 'react'
import { context, Context } from 'context'

const useCommonState = () => {
  const store: Context = useContext(context)

  // ------------------------------------------------------------ Set --

  // ------------------------------------------------------------ Export --

  return {
    addMessage: store.addMessage,
    removeMessage: store.removeMessage,
  }
}

export default useCommonState
