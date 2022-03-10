import { useContext } from 'react'
import { context, Context } from './context'

const useCommon = () => {
  const store: Context = useContext(context)

  const startLoading = () => {
    store.setCommon((common) => ({
      ...common,
      isLoading: true,
    }))
  }

  const stopLoading = () => {
    store.setCommon((common) => ({
      ...common,
      isLoading: false,
    }))
  }

  return {
    isLoading: store.common.isLoading,
    startLoading,
    stopLoading,
  }
}

export default useCommon
