import { useContext } from 'react'
import * as interfaces from '@shared/interfaces'
import { store, Context } from './context'
import useCommon from './useCommon'
import * as requestAdpater from '../adapters/request'
import * as routerConstant from '../constants/router'

const useResource = () => {
  const context: Context = useContext(store)
  const { startLoading, stopLoading } = useCommon()

  const storeTopPatterns = (topPatterns: interfaces.resourcesResponse.TopPatterns) => {
    context.setResources((resources) => ({
      ...resources,
      topPatterns,
    }))
  }

  const fetchTopPatterns = async () => {
    const endpoint = `${routerConstant.API.RESOURCES}/top`
    startLoading()
    const patterns = await requestAdpater.sendGetRequest(endpoint)
    stopLoading()
    storeTopPatterns(patterns)
  }

  return {
    topPatterns: context.resources.topPatterns,
    fetchTopPatterns,
  }
}

export default useResource
