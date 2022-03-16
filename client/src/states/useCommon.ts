import { useContext } from 'react'
import { context, Context } from './context'

const useCommon = () => {
  const store: Context = useContext(context)

  return {
    messages: store.common.messages,
    addMessage: store.addMessage,
    removeMessage: store.removeMessage,
    clearMessages: store.clearMessages,
  }
}

export default useCommon
