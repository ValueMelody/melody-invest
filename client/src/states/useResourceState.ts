import { useContext } from 'react'
import { context, Context } from 'context'

const useResourceState = () => {
  const store: Context = useContext(context)

  // ------------------------------------------------------------ Get --

  const getOverallTopTraderProfiles = () => {
    return store.resources.overallTopTraderProfiles
  }

  // ------------------------------------------------------------ export --

  return {
    getOverallTopTraderProfiles,
  }
}

export default useResourceState
