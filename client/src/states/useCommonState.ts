import { context, Context } from './context'
import * as vendorTool from '../tools/vendor'

const useCommonState = () => {
  const store: Context = vendorTool.react.useContext(context)

  // ------------------------------------------------------------ export --

  return {
    messages: store.common.messages,
    addMessage: store.addMessage,
    removeMessage: store.removeMessage,
    clearMessages: store.clearMessages,
  }
}

export default useCommonState
