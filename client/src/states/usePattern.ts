import { useState } from 'react'
import * as interfaces from '@shared/interfaces'
import useCommon from './useCommon'
import * as requestAdpater from '../adapters/request'
import * as routerConstant from '../constants/router'

const usePattern = () => {
  const { startLoading, stopLoading } = useCommon()

  const [topPatterns, setTopPatterns] = useState<interfaces.patternsResponse.Top | null>(null)

  const fetchTopPatterns = async () => {
    const endpoint = `${routerConstant.API.PATTERNS}/top`
    startLoading()
    const patterns = await requestAdpater.sendGetRequest(endpoint)
    stopLoading()
    setTopPatterns(patterns)
  }

  return {
    topPatterns,
    fetchTopPatterns,
  }
}

export default usePattern
