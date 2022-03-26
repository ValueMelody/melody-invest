import { useContext } from 'react'
import { context, Context } from './context'

const useTraderEnv = () => {
  const store: Context = useContext(context)

  const getTraderEnv = (id: number | null) => {
    if (!id) return null
    return store.traderEnvs[id] || null
  }

  return {
    getTraderEnv,
  }
}

export default useTraderEnv
