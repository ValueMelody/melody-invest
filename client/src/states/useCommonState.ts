import { context, Context, Message } from '../context'
import * as vendorTool from '../tools/vendor'

const useCommonState = () => {
  const store: Context = vendorTool.react.useContext(context)

  // ------------------------------------------------------------ Get --

  const getActiveChartIndex = (): number => {
    return store.common.activeChartIndex
  }

  const getMessages = (): Message[] => {
    return store.common.messages
  }

  // ------------------------------------------------------------ Set --

  const setActiveChartIndex = (index: number) => {
    return store.setCommon((common) => ({ ...common, activeChartIndex: index }))
  }

  // ------------------------------------------------------------ Export --

  return {
    getActiveChartIndex,
    setActiveChartIndex,
    getMessages,
    addMessage: store.addMessage,
    removeMessage: store.removeMessage,
    clearMessages: store.clearMessages,
  }
}

export default useCommonState
