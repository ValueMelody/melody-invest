import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useTrader from '../../states/useTrader'
import * as routerConstant from '../../constants/router'

const Trader = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { getTrader, fetchTrader } = useTrader()

  const traderId = params.traderId ? parseInt(params.traderId) : null
  const accessCode = params?.accessCode || null
  const trader = getTrader(traderId)

  useEffect(() => {
    if (trader) return
    const hasValidParam = traderId && accessCode && accessCode.length === 16
    if (!hasValidParam) navigate(routerConstant.NAV.NOT_FOUND)
    fetchTrader(traderId!, accessCode!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trader])

  return (
    <div>
      123
    </div>
  )
}

export default Trader
