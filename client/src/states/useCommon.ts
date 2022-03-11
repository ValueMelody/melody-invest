import { useContext } from 'react'
import { store, Context } from './context'

const useCommon = () => {
  const context: Context = useContext(store)

  const startLoading = () => {
    context.setCommon((common) => ({
      ...common,
      isLoading: true,
    }))
  }

  const stopLoading = () => {
    context.setCommon((common) => ({
      ...common,
      isLoading: false,
    }))
  }

  return {
    isLoading: context.common.isLoading,
    startLoading,
    stopLoading,
  }
}

export default useCommon
