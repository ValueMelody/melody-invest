import * as interfaces from '@shared/interfaces'
import { useContext, useState } from 'react'
import { context, Context } from './context'
import * as requestAdpater from '../adapters/request'
import * as routerConstant from '../constants/router'

const usePattern = () => {
  const store: Context = useContext(context)
  const [topPatterns, setTopPatterns] = useState<interfaces.patternsResponse.Top | null>(null)

  const fetchTopPatterns = async () => {
    const endpoint = `${routerConstant.API.PATTERNS}/top`
    const patterns = await requestAdpater.sendGetRequest(endpoint)
    setTopPatterns(patterns)
  }

  return {
    topPatterns,
    fetchTopPatterns,
    patterns: store.patterns,
  }
}

export default usePattern
