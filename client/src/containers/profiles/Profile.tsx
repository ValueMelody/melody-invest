import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useTrader from '../../states/useTraderProfile'
import * as routerConstant from '../../constants/router'
import TraderSummary from './blocks/TraderStats'

const Trader = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { getTraderProfile, fetchTraderProfile } = useTrader()

  const traderId = params.traderId ? parseInt(params.traderId) : null
  const accessCode = params?.accessCode || null
  const traderProfile = getTraderProfile(traderId)

  useEffect(() => {
    if (traderProfile) return
    const hasValidParam = traderId && accessCode && accessCode.length === 16
    if (!hasValidParam) navigate(routerConstant.NAV.NOT_FOUND)
    fetchTraderProfile(traderId!, accessCode!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traderProfile])

  if (!traderProfile) return null

  return (
    <div>
      <TraderSummary
        trader={traderProfile.trader}
        pattern={traderProfile.pattern}
      />
    </div>
  )
}

export default Trader
