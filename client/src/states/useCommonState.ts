import { context, Context } from './context'
import * as vendorTool from '../tools/vendor'

const useCommonState = () => {
  const store: Context = vendorTool.react.useContext(context)

  // ------------------------------------------------------------ Get --

  const getActiveChartIndex = (): number => {
    return store.common.activeChartIndex
  }

  // ------------------------------------------------------------ Get --

  const setActiveChartIndex = (index: number) => {
    return store.setCommon((common) => ({ ...common, activeChartIndex: index }))
  }

  // ------------------------------------------------------------ export --

  return {
    getActiveChartIndex,
    setActiveChartIndex,
    messages: store.common.messages,
    addMessage: store.addMessage,
    removeMessage: store.removeMessage,
    clearMessages: store.clearMessages,
  }
}

export default useCommonState
