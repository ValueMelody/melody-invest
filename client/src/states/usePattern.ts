import { useContext } from 'react'
import { context, Context } from './context'
import * as requestAdpater from '../adapters/request'
import * as routerConstant from '../constants/router'

const usePattern = () => {
  const store: Context = useContext(context)

  const fetchTopPatterns = async () => {
    const endpoint = `${routerConstant.API.PATTERNS}/top`
    const patterns = await requestAdpater.sendGetRequest(endpoint)
    console.log(patterns)
  }

  return {
    fetchTopPatterns,
    patterns: store.patterns,
  }
}

export default usePattern
